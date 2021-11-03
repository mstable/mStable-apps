import { BigNumber } from 'ethers'

export interface MerkleClaim {
  address: string
  token: { address: string; symbol: string }
  tranches: { trancheId: number; amount: BigNumber; uri: string }[]
  totalUnclaimed: BigNumber
  totalUnclaimedSimple: number
}

export interface MerkleClaims {
  [merkleDrop: string]: MerkleClaim
}

export interface MerkleClaimProof {
  trancheId: number
  proof: string[]
  balance: BigNumber
  balanceSimple: number
}
