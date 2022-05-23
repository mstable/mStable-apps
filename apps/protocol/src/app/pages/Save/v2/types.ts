import type { BigDecimal } from '@apps/bigdecimal'
import type { PriceImpact } from '@apps/types'

export enum SaveRoutes {
  Save,
  Stake,
  SaveAndStake,
  MintAndSave,
  MintAndStake,
  BuyAndSave,
  BuyAndStake,
  SwapAndSave,
  SwapAndStake,
}

export enum SaveRoutesOut {
  Withdraw,
  WithdrawAndRedeem,
  VaultWithdraw,
  VaultUnwrapAndRedeem,
}

export interface SaveOutput {
  amount: BigDecimal
  amountOut?: BigDecimal
  path?: [string, string]
  priceImpact?: PriceImpact
}
