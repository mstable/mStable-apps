import { BytesLike } from '@ethersproject/bytes'
import { BigNumberish } from 'ethers'
import React, { FC, useCallback, useContext } from 'react'
import styled from 'styled-components'

import { MerkleDrop__factory } from '@apps/artifacts/typechain'
import { useAccount, useSigner } from '@apps/base/context/account'
import { usePropose } from '@apps/base/context/transactions'
import { Button } from '@apps/dumb-components'
import { Interfaces, TransactionManifest } from '@apps/transaction-manifest'
import { useFetchState } from '@apps/hooks'
import { SendButton } from '@apps/base/components/forms'

import { merkleClaimsCtx } from './MerkleClaimsProvider'
import { MerkleClaim, MerkleClaimProof } from './types'
import { createMerkleClaimProofs } from './utils'

const StyledSendButton = styled(SendButton)`
  height: auto;
`

const Container = styled.div`
  h5 {
    font-size: 0.9rem;
  }
  p {
    font-size: 0.8rem;
    color: ${({ theme }) => theme.color.bodyTransparent};
  }

  button {
    width: 100%;
    height: auto;
  }

  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: space-between;
  text-align: center;
`

export const MerkleClaimForm: FC<{ merkleDropAddress: string }> = ({ merkleDropAddress }) => {
  const merkleClaims = useContext(merkleClaimsCtx)
  const account = useAccount()
  const signer = useSigner()
  const propose = usePropose()
  const [merkleClaimProofs, setMerkleClaimProofs] = useFetchState<MerkleClaimProof[]>()

  const merkleClaim = merkleClaims.value?.[merkleDropAddress]

  const fetchMerkleClaimProofs = useCallback(
    async (account: string, merkleClaim: MerkleClaim) => {
      if (!account) return

      setMerkleClaimProofs.fetching()
      try {
        const proofs = await createMerkleClaimProofs(account, merkleClaim)
        setMerkleClaimProofs.value(proofs)
      } catch (error) {
        setMerkleClaimProofs.error(error)
      }
    },
    [setMerkleClaimProofs],
  )

  return (
    <Container>
      {merkleClaim && merkleClaim.tranches.length > 0 ? (
        <>
          <div>
            <h5>
              Available to claim: {merkleClaim.totalUnclaimedSimple.toFixed(4)} {merkleClaim.token.symbol}
            </h5>
            <p>
              Tranches:{' '}
              {merkleClaim.tranches.length === 1
                ? merkleClaim.tranches[0].trancheId
                : `${merkleClaim.tranches[0].trancheId} to ${merkleClaim.tranches[merkleClaim.tranches.length - 1].trancheId}`}
            </p>
          </div>
          <div>
            {merkleClaimProofs.value ? (
              <StyledSendButton
                valid
                title="Claim"
                handleSend={() => {
                  if (!signer || !account || !merkleClaimProofs.value) return

                  // One tranche to claim
                  if (merkleClaimProofs.value.length === 1) {
                    const [{ trancheId, balance, proof }] = merkleClaimProofs.value
                    propose<Interfaces.MerkleDrop, 'claimTranche'>(
                      new TransactionManifest(
                        MerkleDrop__factory.connect(merkleDropAddress, signer),
                        'claimTranche',
                        [account, trancheId, balance, proof],
                        {
                          past: `Claimed tranche ${trancheId}}`,
                          present: `Claiming tranche ${trancheId}`,
                        },
                      ),
                    )
                    return
                  }

                  // Multiple tranches to claim
                  const claimArgs = merkleClaimProofs.value.reduce<[string, BigNumberish[], BigNumberish[], BytesLike[][]]>(
                    ([_account, _ids, _balances, _merkleProofs], { trancheId, proof, balance }) => [
                      _account,
                      [..._ids, trancheId],
                      [..._balances, balance],
                      [..._merkleProofs, proof] as BytesLike[][],
                    ],
                    [account, [], [], []],
                  )

                  propose<Interfaces.MerkleDrop, 'claimTranches'>(
                    new TransactionManifest(MerkleDrop__factory.connect(merkleDropAddress, signer), 'claimTranches', claimArgs, {
                      past: 'Claimed tranches',
                      present: 'Claiming tranches',
                    }),
                  )
                }}
              />
            ) : (
              <Button
                disabled={merkleClaimProofs.fetching}
                onClick={() => {
                  if (!account) return

                  fetchMerkleClaimProofs(account, merkleClaim).catch(error => {
                    console.error(error)
                  })
                }}
              >
                {merkleClaimProofs.fetching ? 'Verifying...' : 'Verify claim'}
              </Button>
            )}
          </div>
          {merkleClaimProofs.error && <div>Error verifying claim</div>}
        </>
      ) : (
        <div>
          <p>No platform rewards available to claim at this time.</p>
        </div>
      )}
    </Container>
  )
}
