import React, { FC } from 'react'
import styled from 'styled-components'
import { DelegateeInfo } from '@mstable/delegatee-lists'

import { Button, CountUp } from '@apps/dumb-components'
import { TokenIcon } from '@apps/base/components/core'
import { ViewportWidth } from '@apps/theme'
import { BigDecimal } from '@apps/bigdecimal'

import { useAccountQuery } from '../../hooks/useAccountQuery'
import { useDelegatorModal } from '../../hooks/useDelegatorModal'
import { VotingHistory } from './VotingHistory'

const StyledTokenIcon = styled(TokenIcon)`
  width: 1.5rem;
  height: auto;
`

const StyledCountUp = styled(CountUp)`
  font-size: 1.25rem;
  font-weight: 300;
`

const Widget = styled.div`
  padding: 1rem 0;

  h4 {
    padding-bottom: 0.5rem;
    font-size: 0.875rem;
  }

  > * {
    padding: 0 1.25rem;
  }

  > div {
    align-items: center;
    display: flex;
    gap: 1rem;
  }
`

const Delegators = styled(Widget)`
  border: 1px ${({ theme }) => theme.color.background[3]} solid;
  border-radius: 1rem;

  > div {
    justify-content: space-between;
  }
`

const DelegateeBalancesContainer = styled.div`
  flex-direction: row;
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: space-evenly;
  line-height: 1.5rem;
  border-radius: 1rem;
  border: 1px ${({ theme }) => theme.color.background[3]} solid;

  @media (min-width: ${ViewportWidth.m}) {
    flex-direction: column;
    width: 16rem;

    > * {
      &:not(:last-child) {
        border-bottom: 1px ${({ theme }) => theme.color.background[3]} solid;
      }
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
  delegateeInfo?.bio ? (
    <DelegateeBioContainer>
      <h4>Bio</h4>
      <p>{delegateeInfo.bio}</p>
    </DelegateeBioContainer>
  ) : null

const DelegateeBalances: FC<{
  accounts?: {
    id: string
    stakedToken: {
      id: string
      stakingToken: {
        symbol: string
      }
    }
    balance: {
      cooldownUnits: string
      rawBD: BigDecimal
      votesBD: BigDecimal
    }
  }[]
}> = ({ accounts }) => {
  const votingPower = accounts?.map(a => a?.balance?.votesBD?.simple ?? 0).reduce((a, b) => a + b)
  return (
    <DelegateeBalancesContainer>
      {accounts?.map(({ stakedToken: { stakingToken }, balance, id }) => {
        const cooldownSimple = parseFloat(balance.cooldownUnits) / 1e18
        return (
          <React.Fragment key={id}>
            <Widget>
              <h4>Staked {stakingToken.symbol}</h4>
              <div>
                <StyledTokenIcon symbol={stakingToken.symbol} />
                <StyledCountUp end={balance.rawBD.simple + cooldownSimple} />
              </div>
            </Widget>
          </React.Fragment>
        )
      })}
      <Widget>
        <h4>Voting Power</h4>
        <div>
          <StyledTokenIcon symbol="vMTA" />
          <StyledCountUp end={votingPower} />
        </div>
      </Widget>
    </DelegateeBalancesContainer>
  )
}

const DelegateeDelegators: FC<{ delegators?: string[] }> = ({ delegators }) => {
  const [showModal] = useDelegatorModal(delegators ?? [])
  return (
    <Delegators>
      <h4>Delegators</h4>
      <div>
        <StyledCountUp end={delegators?.length} decimals={0} />
        {!!delegators?.length && <Button onClick={showModal}>View List</Button>}
      </div>
    </Delegators>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;

  > :first-child {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2.25rem;
  }

  h4 {
    color: ${({ theme }) => theme.color.bodyAccent};
  }

  @media (min-width: ${ViewportWidth.m}) {
    flex-direction: row;
    margin-top: 1rem;

    > :first-child {
      flex-direction: column;
      max-width: 16rem;
      margin-top: 2.25rem;
      margin-bottom: 0;
    }
  }
`

export const DelegateeProfile: FC<{ delegateeInfo?: DelegateeInfo; address?: string; addressOrENSName: string }> = ({
  delegateeInfo,
  addressOrENSName,
  address,
}) => {
  const delegateeQuery = useAccountQuery(address?.toLowerCase())
  const accounts = delegateeQuery.data?.account?.stakedTokenAccounts
  const delegators = delegateeQuery?.data?.account?.delegators?.map(({ id }) => id?.split('.')?.[0] ?? '')

  return (
    <Container>
      <div>
        <DelegateeBio delegateeInfo={delegateeInfo} />
        <DelegateeBalances accounts={accounts} />
        <DelegateeDelegators delegators={delegators} />
      </div>
      <VotingHistory address={address} addressOrENSName={addressOrENSName} />
    </Container>
  )
}
