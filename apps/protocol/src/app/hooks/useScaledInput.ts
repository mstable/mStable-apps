import { useMemo } from 'react'

import { BigDecimalInputValue } from '@apps/hooks'
import { useSelectedMassetConfig } from '@apps/masset-provider'
import { InputRatios, ScaledInput } from '@apps/types'

const RAI = '0x03ab458634910aad20ef5f1c8ee96f1d6ac54919'

export const useScaledInput = (
  inputValue?: BigDecimalInputValue,
  outputValue?: BigDecimalInputValue,
  inputRatios?: InputRatios,
): ScaledInput | undefined => {
  const massetConfig = useSelectedMassetConfig()

  return useMemo(() => {
    if (!inputValue || !inputValue.amount || !outputValue || !inputRatios) return undefined

    const high = inputValue.amount
    const low = massetConfig.lowInputValue

    const ratio = inputRatios[inputValue.address]
    let scaledHigh = ratio ? high.mulRatioTruncate(ratio).setDecimals(18) : high
    let scaledLow = low

    if (inputValue.address === RAI) {
      scaledLow = low.mulRatioTruncate(ratio)
    } else if (outputValue.address === RAI) {
      const raiRatio = inputRatios[outputValue.address]
      scaledLow = low.divRatioPrecisely(raiRatio)
      scaledHigh = high.divRatioPrecisely(raiRatio)
    }

    return { low, high, scaledHigh, scaledLow }
  }, [inputRatios, inputValue, outputValue, massetConfig.lowInputValue])
}
