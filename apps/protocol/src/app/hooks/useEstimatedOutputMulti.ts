import type { FeederPool, Masset } from '@apps/artifacts/typechain'
import { useEffect, useMemo } from 'react'
import { useDebounce } from 'react-use'
import { BigNumber } from 'ethers'

import { getPriceImpact } from '@apps/quick-maths'
import { sanitizeMassetError } from '@apps/formatters'
import { BigDecimal } from '@apps/bigdecimal'
import { useFetchState } from '@apps/hooks'
import { FetchState, LPPriceAdjustment, PriceImpact, ScaledInput } from '@apps/types'

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
  scaledInput: ScaledInput,
  lpPriceAdjustment?: LPPriceAdjustment,
  contract?: MintableContract,
): Output => {
  const [estimatedOutputRange, setEstimatedOutputRange] = useFetchState<[BigDecimal, BigDecimal]>()

  const priceImpact = useMemo<FetchState<PriceImpact>>(() => {
    if (estimatedOutputRange.fetching) return { fetching: true }

    if (scaledInput.scaledHighTotal.exact.eq(0) || !estimatedOutputRange.value) return {}

    const value = getPriceImpact(
      [scaledInput.scaledLowTotal, scaledInput.scaledHighTotal],
      estimatedOutputRange.value,
      lpPriceAdjustment,
      route === Route.Redeem,
    )

    return { value }
  }, [estimatedOutputRange.fetching, estimatedOutputRange.value, scaledInput, lpPriceAdjustment, route])

  const [update] = useDebounce(
    () => {
      if (!contract || Object.values(scaledInput.values).length === 0) return {}

      setEstimatedOutputRange.fetching()

      const addresses = Object.keys(scaledInput.values)
      const lowAmounts = addresses.map(address => scaledInput.values[address].low.exact)
      const highAmounts = addresses.map(address => scaledInput.values[address].high.exact)

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
    [contract, scaledInput],
  )

  const amountIsSet = scaledInput.highTotal.exact.gt(0)

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
