import { useEffect, useMemo, useState } from 'react'

import { FeederPool__factory, Masset__factory } from '@apps/artifacts/typechain'
import { useSigner } from '@apps/base/context/account'
import { BigDecimal } from '@apps/bigdecimal'
import { sanitizeMassetError } from '@apps/formatters'
import { useFetchState } from '@apps/hooks'
import { useSelectedMassetState } from '@apps/masset-hooks'
import { getPriceImpact } from '@apps/quick-maths'
import { useDebounce, usePrevious } from 'react-use'

import { useMassetInputRatios } from './useMassetInputRatios'
import { useScaledInput } from './useScaledInput'

import type { FeederPool, Masset } from '@apps/artifacts/typechain'
import type { MassetState } from '@apps/data-provider'
import type { BigDecimalInputValue } from '@apps/hooks'
import type { FetchState, LPPriceAdjustment, PriceImpact } from '@apps/types'
import type { BigNumber } from 'ethers'

type Contract = Masset | FeederPool

interface Output {
  estimatedOutputAmount: FetchState<BigDecimal>
  priceImpact: FetchState<PriceImpact>
  exchangeRate: FetchState<number>
  feeRate: FetchState<BigDecimal>
}

enum Action {
  SWAP,
  REDEEM,
  MINT,
}

const withFee = new Set<Action | undefined>([Action.SWAP, Action.REDEEM])

const inputValuesAreEqual = (a?: BigDecimalInputValue, b?: BigDecimalInputValue): boolean =>
  !!((!a && !b) || (a && b && a.amount?.exact.toString() === b.amount?.exact.toString() && a.address === b.address))

/**
 * This hook is designed to route to correct hook based on input/output
 */
export const useEstimatedOutput = (
  inputValue?: BigDecimalInputValue,
  outputValue?: BigDecimalInputValue,
  lpPriceAdjustment?: LPPriceAdjustment,
  shouldSkip?: boolean,
): Output => {
  const inputValuePrev = usePrevious(inputValue)
  const outputValuePrev = usePrevious(outputValue)

  const [estimatedOutputRange, setEstimatedOutputRange] = useFetchState<[BigDecimal, BigDecimal]>()

  const [action, setAction] = useState<Action | undefined>()

  const signer = useSigner()
  const massetState = useSelectedMassetState() as MassetState
  const { address: massetAddress, fAssets, bAssets, feeRate: swapFeeRate, redemptionFeeRate } = massetState

  const poolAddress = Object.values(fAssets).find(
    f =>
      f.feederPoolAddress === inputValue?.address ||
      f.feederPoolAddress === outputValue?.address ||
      f.address === inputValue?.address ||
      f.address === outputValue?.address,
  )?.feederPoolAddress

  const inputRatios = useMassetInputRatios()
  const scaledInput = useScaledInput(inputValue, outputValue, inputRatios)

  const contract: Contract | undefined = useMemo(() => {
    if (!signer) return

    // use feeder pool to do swap
    if (poolAddress) {
      return FeederPool__factory.connect(poolAddress, signer)
    }
    return Masset__factory.connect(massetAddress, signer)
  }, [poolAddress, massetAddress, signer])

  const isFeederPool = contract?.address === poolAddress

  const exchangeRate = useMemo<FetchState<number>>(() => {
    if (shouldSkip) return {}

    if (estimatedOutputRange.fetching) return { fetching: true }
    if (!scaledInput?.high || !outputValue || !estimatedOutputRange.value) return {}

    const [, high] = estimatedOutputRange.value

    if (!high.exact.gt(0) || !scaledInput.high.exact.gt(0)) {
      return { error: 'Amount must be greater than zero' }
    }

    const value = high.simple / scaledInput.high.simple
    return { value }
  }, [estimatedOutputRange, scaledInput, outputValue, shouldSkip])

  const feeRate = useMemo<FetchState<BigDecimal>>(() => {
    if (shouldSkip || !withFee.has(action) || !estimatedOutputRange.value?.[1]) return {}

    if (estimatedOutputRange.fetching) return { fetching: true }

    const _feeRate = action === Action.SWAP ? swapFeeRate : redemptionFeeRate

    const swapFee = estimatedOutputRange.value[1]
      .scale()
      .divPrecisely(BigDecimal.ONE.sub(_feeRate))
      .sub(estimatedOutputRange.value[1].scale())

    return { value: swapFee }
  }, [action, estimatedOutputRange, swapFeeRate, redemptionFeeRate, shouldSkip])

  const priceImpact = useMemo<FetchState<PriceImpact>>(() => {
    if (estimatedOutputRange.fetching || !estimatedOutputRange.value) return { fetching: true }

    if (!scaledInput || !scaledInput.high.exact.gt(0)) return {}

    const value = getPriceImpact([scaledInput.scaledLow, scaledInput.scaledHigh], estimatedOutputRange.value, lpPriceAdjustment)

    return { value }
  }, [estimatedOutputRange.fetching, estimatedOutputRange.value, lpPriceAdjustment, scaledInput])

  /*
   * |------------------------------------------------------|
   * | ROUTES                                               |
   * | -----------------------------------------------------|
   * | Input  | Output | Function      | Tokens             |
   * | -----------------------------------------------------|
   * | basset | masset | masset mint   | 1 basset, 1 masset |
   * | masset | basset | masset redeem | 1 masset, 1 basset |
   * | basset | basset | masset swap   | 2 bassets          |
   * | fasset | basset | fpool swap    | 1 fasset           |
   * | fasset | masset | fpool swap    | 1 fasset           |
   * |------------------------------------------------------|
   */

  const inputEq = inputValuesAreEqual(inputValue, inputValuePrev)
  const outputEq = inputValuesAreEqual(outputValue, outputValuePrev)
  const eq = inputEq && outputEq

  const [update] = useDebounce(
    () => {
      if (!scaledInput || !outputValue || shouldSkip || !contract) return

      const { address: inputAddress, decimals: inputDecimals } = inputValue
      const { address: outputAddress, decimals: outputDecimals } = outputValue

      const isLPRedeem = contract.address === inputAddress
      const isLPMint = contract.address === outputAddress
      const isMassetMint = bAssets[inputAddress]?.address && outputAddress === massetAddress
      const isBassetSwap = [inputAddress, outputAddress].filter(address => bAssets[address]?.address).length === 2
      const isInvalid = inputAddress === outputAddress

      if (!scaledInput.high.exact.gt(0)) return

      // same -> same; fallback to input value 1:1
      if (isInvalid) {
        setEstimatedOutputRange.value([scaledInput.scaledLow, scaledInput.high])
        return
      }

      let outputLowPromise: Promise<BigNumber> | undefined
      let outputHighPromise: Promise<BigNumber> | undefined

      if (isMassetMint || isLPMint) {
        setAction(Action.MINT)
        outputLowPromise = contract.getMintOutput(inputAddress, scaledInput.low.scale(inputDecimals).exact)
        outputHighPromise = contract.getMintOutput(inputAddress, scaledInput.high.exact)
      } else if ((isFeederPool || isBassetSwap) && !isLPRedeem) {
        setAction(Action.SWAP)
        outputLowPromise = contract.getSwapOutput(inputAddress, outputAddress, scaledInput.low.scale(inputDecimals).exact)
        outputHighPromise = contract.getSwapOutput(inputAddress, outputAddress, scaledInput.high.exact)
      } else if (!isFeederPool || isLPRedeem) {
        setAction(Action.REDEEM)
        outputLowPromise = contract.getRedeemOutput(outputAddress, scaledInput.low.scale(inputDecimals).exact)
        outputHighPromise = contract.getRedeemOutput(outputAddress, scaledInput.high.exact)
      }

      if (outputLowPromise && outputHighPromise) {
        setEstimatedOutputRange.fetching()

        Promise.all([outputLowPromise, outputHighPromise])
          .then(data => {
            const [_low, _high] = data
            const low = new BigDecimal(_low, outputDecimals)
            const high = new BigDecimal(_high, outputDecimals)
            setEstimatedOutputRange.value([low, high])
          })
          .catch(_error => {
            setEstimatedOutputRange.error(sanitizeMassetError(_error))
          })
        return
      }

      setEstimatedOutputRange.value()
    },
    2500,
    [eq],
  )

  useEffect(() => {
    if (shouldSkip) return

    if (!eq && contract && scaledInput && outputValue) {
      if (scaledInput.high.exact.gt(0)) {
        setEstimatedOutputRange.fetching()
        update()
      } else {
        setEstimatedOutputRange.value()
      }
    }
  }, [eq, contract, setEstimatedOutputRange, update, scaledInput, outputValue, shouldSkip])

  return useMemo(
    () => ({
      estimatedOutputAmount: {
        fetching: estimatedOutputRange.fetching,
        error: estimatedOutputRange.error,
        value: estimatedOutputRange.value?.[1],
      },
      priceImpact,
      exchangeRate,
      feeRate,
    }),
    [estimatedOutputRange, priceImpact, exchangeRate, feeRate],
  )
}
