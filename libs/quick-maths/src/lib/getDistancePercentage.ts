import { BigDecimal } from '@apps/bigdecimal'
import { LPPriceAdjustment } from '@apps/types'

export const getSignedDistance = (distance: number, reverse?: boolean): number => {
  const isBonus = distance > 1
  const sign = (isBonus && !reverse) || (!isBonus && reverse) ? 1 : -1
  return (isBonus ? distance - 1 : 1 - distance) * (sign * 100)
}

export const getDistancePercentage = (
  inputAmount?: BigDecimal,
  outputAmount?: BigDecimal, // min or max output
  lpPriceAdjustment?: LPPriceAdjustment,
  reverse?: boolean,
): number | undefined => {
  if (!inputAmount || !outputAmount || inputAmount.exact.eq(0)) return

  const isInput = lpPriceAdjustment?.isInput
  const lpPrice = lpPriceAdjustment?.price?.simple ?? 1

  const scaledInput = isInput ? inputAmount.simple * lpPrice : inputAmount.simple
  const scaledOutput = isInput ? outputAmount.simple : outputAmount.simple * lpPrice
  const distance = scaledOutput / scaledInput

  return getSignedDistance(distance, reverse)
}
