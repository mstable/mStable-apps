import { useEffect, useMemo } from 'react'

import { BigDecimal } from '@apps/bigdecimal'
import { sanitizeMassetError } from '@apps/formatters'
import { useFetchState } from '@apps/hooks'
import { getPriceImpact } from '@apps/quick-maths'
import { useDebounce } from 'react-use'

import type { FeederPool, Masset } from '@apps/artifacts/typechain'
import type { FetchState, LPPriceAdjustment, PriceImpact, ScaledInputs } from '@apps/types'
import type { BigNumber } from 'ethers'

type MintableContract = Masset | FeederPool

export enum Route {
  Mint = 'mint',
  Redeem = 'redeem',
}

interface Output {
  estimatedOutputAmount: FetchState<BigDecimal>
  priceImpact: FetchState<PriceImpact>
}

/*
 * |--------------------------------------------------------|
 * | ROUTES                                                 |
 * | -------------------------------------------------------|
 * | Input    | Output | Function      | Tokens             |
 * | -------------------------------------------------------|
 * | bassets  | masset | masset mint   | bassets, 1 masset  |
 * | fassets  | lp     | lp mint       | 1 masset, 1 basset |
 * |--------------------------------------------------------|
 */

/**
 * This hook is designed for use with contracts that support mint & mintMulti, redeemExact
 */
export const useEstimatedOutputMulti = (
  route: Route,
  scaledInputs: ScaledInputs,
  lpPriceAdjustment?: LPPriceAdjustment,
  contract?: MintableContract,
): Output => {
  const [estimatedOutputRange, setEstimatedOutputRange] = useFetchState<[BigDecimal, BigDecimal]>()

  const priceImpact = useMemo<FetchState<PriceImpact>>(() => {
    if (estimatedOutputRange.fetching) return { fetching: true }

    if (scaledInputs.scaledHighTotal.exact.eq(0) || !estimatedOutputRange.value) return {}

    const value = getPriceImpact(
      [scaledInputs.scaledLowTotal, scaledInputs.scaledHighTotal],
      estimatedOutputRange.value,
      lpPriceAdjustment,
      route === Route.Redeem,
    )

    return { value }
  }, [estimatedOutputRange.fetching, estimatedOutputRange.value, scaledInputs, lpPriceAdjustment, route])

  const [update] = useDebounce(
    () => {
      if (!contract || Object.values(scaledInputs.values).length === 0) return {}

      setEstimatedOutputRange.fetching()

      const addresses = Object.keys(scaledInputs.values)
      const lowAmounts = addresses.map(address => scaledInputs.values[address].low.exact)
      const highAmounts = addresses.map(address => scaledInputs.values[address].high.exact)

      const paths = ((): Promise<BigNumber>[] => {
        switch (route) {
          case Route.Mint: {
            const outputLow = contract.getMintMultiOutput(addresses, lowAmounts)
            const outputHigh = contract.getMintMultiOutput(addresses, highAmounts)
            return [outputLow, outputHigh]
          }
          case Route.Redeem: {
            const outputLow = contract.getRedeemExactBassetsOutput(addresses, lowAmounts)
            const outputHigh = contract.getRedeemExactBassetsOutput(addresses, highAmounts)
            return [outputLow, outputHigh]
          }
          default:
            return []
        }
      })()

      Promise.all(paths)
        .then(data => {
          const [_low, _high] = data
          const low = new BigDecimal(_low)
          const high = new BigDecimal(_high)
          setEstimatedOutputRange.value([low, high])
        })
        .catch((_error: Error): void => {
          setEstimatedOutputRange.error(sanitizeMassetError(_error))
        })
    },
    2500,
    [contract, scaledInputs],
  )

  const amountIsSet = scaledInputs.highTotal.exact.gt(0)

  useEffect(() => {
    if (!contract) return

    if (amountIsSet) {
      setEstimatedOutputRange.fetching()
      update()
    } else {
      setEstimatedOutputRange.value()
    }
  }, [contract, setEstimatedOutputRange, amountIsSet, update])

  return useMemo(
    () => ({
      estimatedOutputAmount: {
        fetching: estimatedOutputRange.fetching,
        error: estimatedOutputRange.error,
        value: estimatedOutputRange.value?.[1],
      },
      priceImpact,
    }),
    [estimatedOutputRange, priceImpact],
  )
}
