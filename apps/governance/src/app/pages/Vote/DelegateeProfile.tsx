import { CountUp } from '@apps/components/core'
import { TokenIcon } from '@apps/components/icons'
import React, { FC } from 'react'
import styled from 'styled-components'
import { DelegateeInfo } from '@mstable/delegatee-lists'

import { useStakedToken } from '../../context/StakedTokenProvider'
import { useAccountQuery } from '../../hooks/useAccountQuery'

import { VotingHistory } from './VotingHistory'

const StyledTokenIcon = styled(TokenIcon)`
  width: 1.5rem;
  height: auto;
`

const StyledCountUp = styled(CountUp)`
  font-size: 1.25rem;
  font-weight: 300;
`

const DelegateeBalancesContainer = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.5rem;
  border-radius: 1rem;
  border: 1px ${({ theme }) => theme.color.background[3]} solid;

  h4 {
    padding-bottom: 0.5rem;
    font-size: 0.875rem;
  }

  > * {
    padding: 1rem 0;

    > * {
      padding: 0 1.25rem;
    }
    > div {
      align-items: center;
      display: flex;
      gap: 1rem;
    }
    &:not(:last-child) {
      border-bottom: 1px ${({ theme }) => theme.color.background[3]} solid;
    }
  }
`

const DelegateeBioContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 1rem;
  border: 1px ${({ theme }) => theme.color.background[3]} dashed;
  line-height: 1.5rem;
`

const DelegateeBio: FC<{ delegateeInfo?: DelegateeInfo }> = ({ delegateeInfo }) =>
  delegateeInfo ? (
    <DelegateeBioContainer>
      <h4>Bio</h4>
      <p>{(delegateeInfo as { bio?: string })?.bio as string}</p>
    </DelegateeBioContainer>
  ) : null

const DelegateeBalances: FC<{ address?: string }> = ({ address }) => {
  const stakedToken = useStakedToken()
  const delegateeQuery = useAccountQuery(address.toLowerCase())
  return (
    <>
      {delegateeQuery.data?.account?.stakedTokenAccounts
        .filter(account => account.stakedToken.id === stakedToken.selected)
        .map(({ stakedToken: { stakingToken }, balance, id }) => (
          <DelegateeBalancesContainer key={id}>
            <div>
              <h4>Staked Balance</h4>
              <div>
                <StyledTokenIcon symbol={stakingToken.symbol} />
                <StyledCountUp end={balance.rawBD.simple} />
              </div>
            </div>
            <div>
              <h4>Voting Power</h4>
              <div>
                <StyledTokenIcon symbol="vMTA" />
                <StyledCountUp end={balance.votesBD.simple} />
              </div>
            </div>
          </DelegateeBalancesContainer>
        ))}
    </>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;

  > :first-child {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    min-width: 16rem;
    margin-top: 2.2rem;
  }

  h4 {
    color: ${({ theme }) => theme.color.bodyAccent};
  }
`

export const DelegateeProfile: FC<{ delegateeInfo?: DelegateeInfo; address?: string; addressOrENSName: string }> = ({
  delegateeInfo,
  addressOrENSName,
  address,
}) => {
  return (
    <Container>
      <div>
        <DelegateeBio delegateeInfo={delegateeInfo} />
        <DelegateeBalances address={address} />
      </div>
      <VotingHistory address={address} addressOrENSName={addressOrENSName} />
    </Container>
  )
}
