import { useMemo } from 'react'

import { getDistancePercentage } from '@apps/quick-maths'
import { getPenaltyMessage } from '@apps/formatters'
import { BigDecimal } from '@apps/bigdecimal'

enum OutputType {
  Minimum,
  Maximum,
}

interface Output {
  penaltyBonus: {
    percentage?: number
    message?: string
  }
}

interface MaximumOutput extends Output {
  maxOutputAmount?: BigDecimal
}

interface MinimumOutput extends Output {
  minOutputAmount?: BigDecimal
}

const useOutput = (
  type: OutputType,
  slippageSimple?: number | undefined,
  inputAmount?: BigDecimal | undefined,
  outputAmount?: BigDecimal | undefined,
): MaximumOutput | MinimumOutput => {
  const amount = useMemo(() => {
    if (!outputAmount || !slippageSimple) return undefined

    const simpleAmount =
      type === OutputType.Maximum ? outputAmount.simple * (1 + slippageSimple / 100) : outputAmount.simple * (1 - slippageSimple / 100)

    return BigDecimal.fromSimple(simpleAmount, outputAmount.decimals)
  }, [type, outputAmount, slippageSimple])

  const penaltyBonus = useMemo(() => {
    const reverse = type === OutputType.Maximum
    const percentage = getDistancePercentage(inputAmount, outputAmount, undefined, reverse)
    const message = getPenaltyMessage(percentage)

    return { percentage, message }
  }, [type, inputAmount, outputAmount])

  return {
    ...(type === OutputType.Maximum ? { maxOutputAmount: amount } : { minOutputAmount: amount }),
    penaltyBonus,
  }
}

/**
 * This hook returns maxOutputAmount + penaltyBonus
 *
 * @param slippageSimple Initial BigDecimal value (optional)
 * @param inputAmount Initial BigDecimal value (optional)
 * @param outputAmount Initial BigDecimal value (optional)
 * @returns [value, formValue, onChange, setValue]
 */
export const useMaximumOutput = (
  slippageSimple?: number | undefined,
  inputAmount?: BigDecimal | undefined,
  outputAmount?: BigDecimal | undefined,
): MaximumOutput => useOutput(OutputType.Maximum, slippageSimple, inputAmount, outputAmount)

/**
 * This hook returns minOutputAmount + penaltyBonus
 *
 * @param slippageSimple Initial BigDecimal value (optional)
 * @param inputAmount Initial BigDecimal value (optional)
 * @param outputAmount Initial BigDecimal value (optional)
 * @returns [value, formValue, onChange, setValue]
 */
export const useMinimumOutput = (
  slippageSimple?: number | undefined,
  inputAmount?: BigDecimal | undefined,
  outputAmount?: BigDecimal | undefined,
): MinimumOutput => useOutput(OutputType.Minimum, slippageSimple, inputAmount, outputAmount)
