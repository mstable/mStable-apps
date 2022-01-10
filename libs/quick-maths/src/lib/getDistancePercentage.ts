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

  const isInputLPToken = lpPriceAdjustment?.isInput
  const lpPrice = lpPriceAdjustment?.price?.simple ?? 1

  if (isInputLPToken) {
    // redeem - scale input (lp token)
    const scaledInput = inputAmount.simple * lpPrice
    return getSignedDistance(outputAmount.simple / scaledInput, reverse)
  } else {
    // deposit - scale output (lp token)
    const scaledOutput = outputAmount.simple * lpPrice
    return getSignedDistance(scaledOutput / inputAmount.simple, reverse)
  }
}
