import { useSelectedMassetState } from '@apps/masset-hooks'
import { useMemo } from 'react'

import { BigDecimal } from '@apps/bigdecimal'
import type { MassetState } from '@apps/data-provider'
import type { BigDecimalInputValue, BigDecimalInputValues } from '@apps/hooks'
import type { FetchState } from '@apps/types'

import { useSelectedFeederPoolState } from '../pages/Pools/FeederPoolProvider'

export const useExchangeRateForMassetInputs = (
  estimatedOutputAmount?: FetchState<BigDecimal>,
  inputValues?: BigDecimalInputValues,
): FetchState<number> => {
  const massetState = useSelectedMassetState() as MassetState

  return useMemo(() => {
    if (!inputValues) return {}

    const touched = Object.values(inputValues).filter(v => v.touched)

    if (!touched.length) return {}
    if (estimatedOutputAmount?.error) return {}
    if (!estimatedOutputAmount?.value) return { fetching: true }

    // Scale asset via ratio
    const scaleAssetValue = (input: BigDecimalInputValue): BigDecimal => {
      const { address, amount } = input
      if (!amount) return BigDecimal.ZERO

      if (massetState.bAssets[address]) {
        const ratio = massetState.bassetRatios[address]
        return ratio ? amount.mulRatioTruncate(ratio) : amount
      }
      return amount
    }

    const totalAmount = BigDecimal.sum(...Object.values(touched).map(scaleAssetValue))

    if (totalAmount) {
      if (estimatedOutputAmount.value.exact.eq(0) || totalAmount.exact.eq(0)) {
        return { error: 'Output amount must be greater than zero' }
      }

      const value = estimatedOutputAmount.value.divPrecisely(totalAmount).simple
      return { value }
    }

    return {}
  }, [estimatedOutputAmount, inputValues, massetState])
}

export const useExchangeRateForFPInputs = (
  poolAddress: string,
  estimatedOutputAmount: FetchState<BigDecimal>,
  inputValues?: BigDecimalInputValues,
): FetchState<number> => {
  const feederPool = useSelectedFeederPoolState()

  return useMemo(() => {
    if (!inputValues) return {}

    const touched = Object.values(inputValues).filter(v => v.touched && v.amount.exact.gt(0))

    if (!touched.length) return {}
    if (estimatedOutputAmount.error) return {}
    if (!estimatedOutputAmount.value) return { fetching: true }

    const inputAmount = Object.values(touched).reduce<BigDecimal>((prev, { address, amount }) => {
      if (address === feederPool.masset.address) return prev.add(amount)

      let scaledAmount = amount.mulRatioTruncate(feederPool.fasset.ratio).setDecimals(18)

      if (feederPool.fasset.token.symbol === 'RAI') {
        // For RAI, scale back down; the ratio is the relative price :)
        scaledAmount = feederPool.fasset.price.divPrecisely(scaledAmount)
      }

      return prev.add(scaledAmount)
    }, BigDecimal.ZERO)

    if (estimatedOutputAmount.value.exact.eq(0) || inputAmount.exact.eq(0)) {
      return { error: 'Output amount must be greater than zero' }
    }

    const value = estimatedOutputAmount.value.divPrecisely(inputAmount).simple
    return { value }
  }, [inputValues, estimatedOutputAmount.error, estimatedOutputAmount.value, feederPool])
}
