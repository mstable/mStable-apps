import type { PriceImpact } from '@apps/types'
import type { BigDecimal } from '@apps/bigdecimal'

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
  VaultUnwrap,
  VaultUnwrapAndRedeem,
}

export interface SaveOutput {
  amount: BigDecimal
  amountOut?: BigDecimal
  path?: [string, string]
  priceImpact?: PriceImpact
}
