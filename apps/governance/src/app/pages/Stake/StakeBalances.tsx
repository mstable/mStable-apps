import React, { FC, useMemo } from 'react'
import styled from 'styled-components'

import { CountUp, ThemedSkeleton } from '@apps/components/core'
import { TokenIcon } from '@apps/components/icons'

import { useStakedTokenQuery } from '../../context/StakedTokenProvider'
import { ViewportWidth } from '@apps/base/theme'

interface Balance {
  symbol?: string
  amount: number
  decimals?: number
  suffix?: string
}

interface GroupProps {
  label: string
  balances?: Balance[]
}

const StyledTokenIcon = styled(TokenIcon)`
  width: 1.5rem;
  height: auto;
`

const GroupContainer = styled.div`
  > :first-child {
    margin-bottom: 0.5rem;
  }

  > :last-child {
    display: flex;
    gap: 1rem;

    > * {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }

  h3 {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.color.bodyAccent};
  }

  span {
    font-size: 1.125rem;
    font-weight: 300;
  }
`

const Group: FC<GroupProps> = ({ balances, label }) => (
  <GroupContainer>
    <h3>{label}</h3>
    <div>
      {balances ? (
        balances.map(({ amount, symbol, suffix, decimals }, key) => (
          <div key={symbol ?? key}>
            {symbol && <StyledTokenIcon symbol={symbol} />}
            <CountUp end={amount} suffix={suffix} decimals={decimals} />
          </div>
        ))
      ) : (
        <ThemedSkeleton height={20} width={80} />
      )}
    </div>
  </GroupContainer>
)

const Container = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 0.75rem;

  > div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border: 1px ${({ theme }) => theme.color.defaultBorder} solid;
    padding: 1.5rem;
    border-radius: 1.5rem;
    gap: 1rem;
    flex: 1;
  }

  @media (min-width: ${ViewportWidth.m}) {
    > div {
      flex-direction: row;
    }
    > div:first-child {
      flex-basis: 60%;
    }
    > div:last-child {
      flex-basis: 40%;
    }
  }
`

export const StakeBalances: FC = () => {
  const { data } = useStakedTokenQuery()

  // TODO create rewardsEarned context
  const { stake, votingPower, rewardsEarned } = useMemo<{ stake?: Balance[]; votingPower?: Balance[]; rewardsEarned?: Balance[] }>(() => {
    const account = data?.stakedToken?.accounts?.[0]
    if (!data || !account) {
      return {}
    }

    const {
      balance: { rawBD, votesBD, cooldownUnits },
      rewards,
    } = account
    const cooldown = parseFloat(cooldownUnits) / 1e18
    return {
      // TODO simple rewards earned
      stake: [{ amount: rawBD.simple + cooldown, symbol: data.stakedToken.stakingToken.symbol }],
      votingPower: [{ amount: votesBD.simple, symbol: 'vMTA' }],
      rewardsEarned: [{ symbol: data.stakedToken.stakingRewards.rewardsToken.symbol, amount: parseInt(rewards) / 1e18 }],
    }
  }, [data])

  // TODO calculate rewards APY
  const rewardsApy = [{ suffix: '%', amount: 23.02 }]

  return (
    <Container>
      <div>
        <Group label="My Stake" balances={stake} />
        <Group label="My Voting Power" balances={votingPower} />
      </div>
      <div>
        <Group label="Rewards Earned" balances={rewardsEarned} />
        <Group label="APY" balances={rewardsApy} />
      </div>
    </Container>
  )
}
