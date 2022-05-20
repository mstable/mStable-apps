import { BigNumber } from 'ethers'
import { keccak256, solidityKeccak256, formatUnits } from 'ethers/lib/utils'
import { MerkleTree } from 'merkletreejs'

import { MerkleClaim, MerkleClaimProof } from './types'

const hashFn = (data: string) => keccak256(data).slice(2)

const getProof = (balances: Record<string, string>, claimant: string): { balance: BigNumber; balanceSimple: number; proof: string[] } => {
  let claimantLeaf: string | undefined
  let claimantBalance: BigNumber | undefined

  const leaves = Object.entries(balances).map(([_account, _balance]) => {
    const balance = BigNumber.from(_balance)
    const leaf = solidityKeccak256(['address', 'uint256'], [_account, balance.toString()])

    if (!claimantLeaf && _account.toLowerCase() === claimant.toLowerCase()) {
      claimantLeaf = leaf
      claimantBalance = balance
    }

    return leaf
  })

  if (!claimantBalance || !claimantLeaf) throw new Error('Claim not found')

  const tree = new MerkleTree(leaves, hashFn, { sort: true })
  const proof = tree.getHexProof(claimantLeaf)

  const balanceSimple = parseFloat(formatUnits(claimantBalance))
  return { proof, balance: claimantBalance, balanceSimple }
}

export const createMerkleClaimProofs = async (claimant: string, { tranches }: MerkleClaim): Promise<MerkleClaimProof[]> => {
  if (tranches.some(t => !t.uri)) {
    throw new Error('Missing Tranche URI')
  }

  if (tranches.some(t => !(t.uri as string).startsWith('ipfs://'))) {
    throw new Error('Unexpected tranche URI')
  }

  return Promise.all(
    tranches.map(async ({ uri, trancheId }) => {
      // const url = `https://cloudflare-ipfs.com/ipfs/${(uri as string).split('ipfs://')[1]}`
      const url = `https://gateway.pinata.cloud/ipfs/${(uri as string).split('ipfs://')[1]}`
      const response = await fetch(url)
      const balances = (await response.json()) as Record<string, string>
      return { ...getProof(balances, claimant), trancheId }
    }),
  )
}
