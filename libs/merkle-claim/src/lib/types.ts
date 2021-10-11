import { BigNumber } from 'ethers'
import { BigDecimal } from '@apps/bigdecimal'

export interface MerkleClaim {
  address: string
  token: string
  tranches: { trancheId: number; amount: BigDecimal; uri: string }[]
  totalUnclaimed: BigDecimal
}

export interface MerkleClaims {
  [merkleDrop: string]: MerkleClaim
}

export interface MerkleClaimProof {
  trancheId: number
  proof: string[]
  balance: BigNumber
}
