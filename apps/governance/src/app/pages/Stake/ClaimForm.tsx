import { MerkleClaimForm, MerkleClaimsProvider } from '@apps/merkle-claim'
import React, { FC } from 'react'
import { useToggle } from 'react-use'
import styled from 'styled-components'

import { usePropose } from '@apps/base/context/transactions'
import { TransactionManifest, Interfaces } from '@apps/transaction-manifest'
import { SendButton, ToggleInput } from '@apps/components/forms'
import { MultiRewards } from '@apps/components/core'
import { BigDecimal } from '@apps/bigdecimal'

import { useStakedToken, useStakedTokenContract, useStakedTokenQuery } from '../../context/StakedTokenProvider'
import { useRewardsEarned } from './context'

const Compound = styled.div`
  padding: 0 0.5rem;

  > div {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: center;
    margin-bottom: 0.25rem;
  }

  p {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.color.bodyAccent};
  }
`

const StyledMultiRewards = styled(MultiRewards)`
  tbody {
    background: ${({ theme }) => theme.color.background[0]};
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
  height: 100%;
`

export const ClaimForm: FC = () => {
  const { data } = useStakedTokenQuery()
  const rewardsEarned = useRewardsEarned()
  const { selected: stakedTokenAddress, options } = useStakedToken()
  const [isCompounding, toggleIsCompounding] = useToggle(false)

  const stakedTokenContract = useStakedTokenContract()
  const propose = usePropose()

  const stakedTokenSymbol = options[stakedTokenAddress]?.icon?.symbol

  const handleSend = () => {
    if (!stakedTokenContract || !data) return

    if (isCompounding) {
      return propose<Interfaces.StakedToken, 'compoundRewards'>(
        new TransactionManifest(stakedTokenContract, 'compoundRewards', [], {
          present: `Compound rewards`,
          past: `Compounded rewards`,
        }),
      )
    }

    propose<Interfaces.StakedToken, 'claimReward()'>(
      new TransactionManifest(stakedTokenContract, 'claimReward()', [], {
        present: `Claim rewards`,
        past: `Claimed rewards`,
      }),
    )
  }

  return (
    <Container>
      <StyledMultiRewards rewardsEarned={{ rewards: [{ earned: BigDecimal.fromSimple(rewardsEarned?.rewards ?? 0), token: 'MTA' }] }} />
      {stakedTokenSymbol === 'MTA' && (
        <Compound>
          <div>
            <h3>Compound rewards?</h3>
            <ToggleInput onClick={toggleIsCompounding} checked={isCompounding} />
          </div>
          <p>This will claim and re-stake your earned MTA in 1 transaction</p>
        </Compound>
      )}
      {stakedTokenSymbol === 'mBPT' && (
        <MerkleClaimsProvider>
          <MerkleClaimForm merkleDropAddress="0x4912c0fa9ed21f8f5420bdfaa097220120610082" />
        </MerkleClaimsProvider>
      )}
      <SendButton valid={!!rewardsEarned?.rewards} title={isCompounding ? 'Compound Rewards' : 'Claim Rewards'} handleSend={handleSend} />
    </Container>
  )
}
