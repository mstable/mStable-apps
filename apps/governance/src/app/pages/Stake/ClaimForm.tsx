import { EthereumKovan, useNetworkAddresses } from '@apps/base/context/network'
import { MerkleClaimForm, MerkleClaimsProvider } from '@apps/merkle-claim'
import React, { FC } from 'react'
import { useToggle } from 'react-use'
import styled from 'styled-components'

import { usePropose } from '@apps/base/context/transactions'
import { TransactionManifest, Interfaces } from '@apps/transaction-manifest'
import { ToggleInput } from '@apps/dumb-components'
import { SendButton } from '@apps/base/components/forms'
import { MultiRewards } from '@apps/base/components/core'
import { BigDecimal } from '@apps/bigdecimal'

import { useStakedToken, useStakedTokenContract, useStakedTokenQuery } from '../../context/StakedToken'
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

const ClaimFormRewards: FC = () => {
  const rewardsEarned = useRewardsEarned()
  return <StyledMultiRewards rewardsEarned={{ rewards: [{ earned: BigDecimal.fromSimple(rewardsEarned?.rewards ?? 0), token: 'MTA' }] }} />
}

const MerkleDropBAL: FC = () => {
  const addresses = useNetworkAddresses<EthereumKovan>()
  return addresses.MerkleDropMBPTBAL ? (
    <MerkleClaimsProvider>
      <MerkleClaimForm merkleDropAddress={addresses.MerkleDropMBPTBAL} />
    </MerkleClaimsProvider>
  ) : null
}

const ClaimFormSend: FC<{ isCompounding: boolean }> = ({ isCompounding }) => {
  const rewardsEarned = useRewardsEarned()
  const { data } = useStakedTokenQuery()
  const stakedTokenContract = useStakedTokenContract()
  const propose = usePropose()

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
    <SendButton valid={!!rewardsEarned?.rewards} title={isCompounding ? 'Compound Rewards' : 'Claim Rewards'} handleSend={handleSend} />
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
  height: 100%;
`

export const ClaimForm: FC = () => {
  const { selected: stakedTokenAddress, options } = useStakedToken()
  const [isCompounding, toggleIsCompounding] = useToggle(false)

  const stakedTokenSymbol = options[stakedTokenAddress]?.icon?.symbol

  return (
    <Container>
      <ClaimFormRewards />
      {stakedTokenSymbol === 'MTA' ? (
        <Compound>
          <div>
            <h3>Compound rewards?</h3>
            <ToggleInput onClick={toggleIsCompounding} checked={isCompounding} />
          </div>
          <p>This will claim and re-stake your earned MTA in 1 transaction</p>
        </Compound>
      ) : (
        <MerkleDropBAL />
      )}
      <ClaimFormSend isCompounding={isCompounding} />
    </Container>
  )
}
