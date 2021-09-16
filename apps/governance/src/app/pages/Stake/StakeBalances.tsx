import React, { FC, useMemo } from 'react'
import { useTokenSubscription } from '@apps/base/context/tokens'
import { BigNumber, utils } from 'ethers'
import styled from 'styled-components'

import { Button, CountUp, ThemedSkeleton } from '@apps/components/core'
import { TokenIcon } from '@apps/components/icons'
import { ViewportWidth } from '@apps/base/theme'

import { useStakedToken, useStakedTokenQuery } from '../../context/StakedTokenProvider'
import { useRewardsEarned } from './context'

const BALANCER_URL = 'https://app.balancer.fi/#/pool/0xe2469f47ab58cf9cf59f9822e3c5de4950a41c49000200000000000000000089'
const MTA_URL = 'https://cowswap.exchange/#/swap?outputCurrency=0xa3bed4e1c75d00fa6f4e5e6922db7261b5e9acd2'

interface Balance {
  symbol?: string
  amount?: number
  decimals?: number
  suffix?: string
}

interface GroupProps {
  label: string
  loading: boolean
  placeholder?: string
  balance?: Balance
}

const ONE_DAY = BigNumber.from(60 * 60 * 24)
const SCALE = BigNumber.from((1e18).toString())

const calculateStakingApy = (
  priceCoefficient?: string,
  rewardRate?: BigNumber,
  rawBalance?: BigNumber,
  stakingBalance?: BigNumber,
  totalSupply?: BigNumber,
) => {
  if (!(rewardRate && stakingBalance && totalSupply && rawBalance) || (totalSupply && totalSupply.eq(0))) {
    return
  }

  // share = stakingBalance / totalSupply
  // dailyRewards = day * rewardRate
  // dailyReturn = (dailyRewards * share) / stakingBalance
  // percentage = dailyReturn * 365 * 100

  const maybePriceCoeff = BigNumber.from(priceCoefficient ?? 1)
  const priceScaledStakingBalance = maybePriceCoeff.mul(stakingBalance)
  const priceScaledRawBalance = maybePriceCoeff.mul(rawBalance)

  const share = priceScaledStakingBalance.mul(SCALE).div(totalSupply)
  if (share.eq(0)) {
    return
  }

  const dailyRewards = ONE_DAY.mul(rewardRate)
  const dailyReturn = dailyRewards.mul(share).div(priceScaledRawBalance)

  return parseFloat(utils.formatUnits(dailyReturn)) * 365 * 100
}

const External: FC<{ highlighted?: boolean }> = ({ highlighted }) => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 2C3.82843 2 1 2 1 2V10H9V7.5" stroke={highlighted ? 'white' : 'black'} />
    <path d="M6 5.5L10.5 1M10.5 1H7.16667M10.5 1V4.33333" stroke={highlighted ? 'white' : 'black'} />
  </svg>
)

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
    min-height: 1.5rem;

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

const InfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;

  > div:first-child > h3 {
    margin-bottom: 0.5rem;
  }

  h3 {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.color.bodyAccent};
  }

  span {
    font-size: 1.125rem;
    font-weight: 300;
  }

  button {
    height: 2.5rem;
    align-self: center;
  }
`

const Info: FC<{ isBPT?: boolean }> = ({ isBPT = false }) => {
  const subtitle = isBPT ? 'Provide Liquidity' : 'Purchase MTA'
  const title = isBPT ? 'MTA/ETH BPT' : 'MTA'
  const buttonTitle = isBPT ? 'Balancer' : 'Buy MTA'
  const link = isBPT ? BALANCER_URL : MTA_URL
  return (
    <InfoContainer>
      <div>
        <h3>{subtitle}</h3>
        <span>{title}</span>
      </div>
      <Button highlighted onClick={() => window.open(link)}>
        {buttonTitle} <External highlighted />
      </Button>
    </InfoContainer>
  )
}

const Group: FC<GroupProps> = ({ balance, label, loading, placeholder }) => {
  const { amount, symbol, suffix, decimals } = balance ?? {}
  return (
    <GroupContainer>
      <h3>{label}</h3>
      <div>
        {!loading ? (
          placeholder ? (
            <div>{placeholder}</div>
          ) : (
            <div key={symbol}>
              {symbol && <StyledTokenIcon symbol={symbol} />}
              <CountUp end={amount} suffix={suffix} decimals={decimals} />
            </div>
          )
        ) : (
          <ThemedSkeleton height={20} width={80} />
        )}
      </div>
    </GroupContainer>
  )
}

const DefaultWidget = styled.div`
  border: 1px ${({ theme }) => theme.color.defaultBorder} solid;
`

const InfoWidget = styled.div`
  border: 1px ${({ theme }) => theme.color.defaultBorder} dashed;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.75rem;

  > div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 1.5rem;
    border-radius: 1.5rem;
    gap: 1rem;
    flex: 1;
  }

  @media (min-width: ${ViewportWidth.m}) {
    flex-direction: row;

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
  const { selected, options } = useStakedToken()
  const { data, loading } = useStakedTokenQuery()
  const rewardsEarned = useRewardsEarned()
  const stakedToken = useTokenSubscription(data?.stakedToken?.token.address)
  const isBPT = options[selected]?.icon?.symbol === 'mBPT'

  const values = useMemo<{
    baseRewardsApy?: Balance
    userRewardsApy?: Balance
    stake?: Balance
    votingPower?: Balance
    rewardsEarned?: Balance
  }>(() => {
    if (!data?.stakedToken?.accounts?.[0]?.balance) {
      return {}
    }

    const {
      stakedToken: {
        priceCoefficient,
        token: { totalSupply },
        stakingRewards: { rewardRate: _rewardRate },
        accounts: [
          {
            balance: { rawBD, votesBD, cooldownUnits, questMultiplierSimple, timeMultiplierSimple },
          },
        ],
      },
    } = data

    // TODO use @client Apollo fields
    const rewardRate = BigNumber.from(_rewardRate)
    const cooldown = parseFloat(cooldownUnits) / 1e18

    const userRewardsApy = calculateStakingApy(
      priceCoefficient,
      rewardRate,
      rawBD?.exact,
      stakedToken?.balance?.exact,
      totalSupply?.bigDecimal.exact,
    )

    const baseRewardsApy = userRewardsApy / ((1 + questMultiplierSimple / 10) * (1 + timeMultiplierSimple / 10))

    return {
      stake: { amount: rawBD.simple + cooldown, symbol: data.stakedToken.stakingToken.symbol },
      votingPower: { amount: votesBD.simple, symbol: 'vMTA' },
      rewardsEarned: { decimals: 4, symbol: data.stakedToken.stakingRewards.rewardsToken.symbol, amount: rewardsEarned.rewards },
      baseRewardsApy: { suffix: '%', amount: baseRewardsApy },
      userRewardsApy: { suffix: '%', amount: userRewardsApy },
    }
  }, [data, rewardsEarned.rewards, stakedToken])

  return (
    <Container>
      <DefaultWidget>
        <Group label="My Stake" balance={values.stake} loading={loading} />
        <Group label="My Voting Power" balance={values.votingPower} loading={loading} />
      </DefaultWidget>
      {!!values.stake ? (
        <DefaultWidget>
          <Group label="Earned" balance={values.rewardsEarned} loading={loading} />
          <Group label="Base APY" balance={values.baseRewardsApy} loading={loading} />
          <Group label="My APY" balance={values.userRewardsApy} loading={loading} />
          {stakedToken?.symbol === 'stkBPT' && <Group label="BAL APY" placeholder="Soon!" loading={loading} />}
        </DefaultWidget>
      ) : (
        <InfoWidget>
          <Info isBPT={isBPT} />
        </InfoWidget>
      )}
    </Container>
  )
}
