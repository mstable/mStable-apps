import { createMemo } from 'react-use'
import { BigDecimal } from '@apps/bigdecimal'
import { BigDecimalInputValues } from '@apps/hooks'
import { InputRatios, ScaledInput } from '@apps/types'

export const useScaledInput = createMemo((inputValues: BigDecimalInputValues, inputRatios: InputRatios): ScaledInput => {
  const touched = Object.values(inputValues).filter(value => value.touched && value.amount.exact.gt(0))

  const highAmounts = touched.map(value => value.amount)
  const highTotal = BigDecimal.sum(...highAmounts)

  const scaledHighAmounts = touched.map(({ amount, address }) =>
    // Only scale with a ratio; massets are not scaled
    inputRatios[address] ? amount.mulRatioTruncate(inputRatios[address]).setDecimals(18) : amount,
  )
  const scaledHighTotal = BigDecimal.sum(...scaledHighAmounts)

  return touched.reduce<ScaledInput>(
    (prev, { amount: high, address }, idx) => {
      const scaledHigh = scaledHighAmounts[idx]

      const low = high.divPrecisely(highTotal)
      const lowTotal = prev.lowTotal.add(low)

      const scaledLow = scaledHigh.divPrecisely(highTotal)
      const scaledLowTotal = prev.scaledLowTotal.add(scaledLow)

      return {
        ...prev,
        lowTotal,
        scaledLowTotal,
        values: { ...prev.values, [address]: { low, high, scaledLow, scaledHigh } },
      } as ScaledInput
    },
    { highTotal, scaledHighTotal, scaledLowTotal: BigDecimal.ZERO, lowTotal: BigDecimal.ZERO, values: {} } as ScaledInput,
  )
})
