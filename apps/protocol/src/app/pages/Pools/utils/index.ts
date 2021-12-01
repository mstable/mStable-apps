import type { InputRatios } from '@apps/types'
import type { BigDecimal } from '@apps/bigdecimal'

export const scaleFassetAmount = (amount?: BigDecimal, ratios?: InputRatios): BigDecimal | undefined => {
  const addresses = ratios && Object.keys(ratios)
  if (!addresses?.length || !amount) return amount
  const address = addresses.find(k => !!ratios[k])
  return !!address ? amount.mulRatioTruncate(ratios[address]).setDecimals(18) : amount
}
