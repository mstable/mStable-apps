import type { InputRatios } from '@apps/types'
import type { BigDecimal } from '@apps/bigdecimal'

export const scaleFassetAmount = (amount?: BigDecimal, address?: string, ratios?: InputRatios): BigDecimal | undefined => {
  const addresses = ratios && Object.keys(ratios)
  if (!addresses?.length || !amount) return amount
  const match = !!addresses.find(k => k === address && !!ratios[k])
  return match ? amount.mulRatioTruncate(ratios[address]).setDecimals(18) : amount
}
