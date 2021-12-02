import { BigDecimal } from '@apps/bigdecimal'
import { LPPriceAdjustment, PriceImpact } from '@apps/types'

import { getDistancePercentage } from './getDistancePercentage'

const IMPACT_WARNING_THRESHOLD = 0.03 // > 3%

export const getPriceImpact = (
  [inputLow, inputHigh]: [BigDecimal, BigDecimal],
  [outputLow, outputHigh]: [BigDecimal, BigDecimal],
  lpPriceAdjustment?: LPPriceAdjustment,
  reverse = false,
): PriceImpact => {
  const startRate = outputLow.simple / inputLow.simple
  const endRate = outputHigh.simple / inputHigh.simple

  const impact = Math.abs(startRate - endRate)
  const showImpactWarning = impact > IMPACT_WARNING_THRESHOLD
  const impactPercentage = impact * 100
  const distancePercentage = getDistancePercentage(inputHigh, outputHigh, lpPriceAdjustment, reverse)

  return {
    distancePercentage,
    impactPercentage,
    showImpactWarning,
  }
}
