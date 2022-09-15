import { useMemo } from 'react'

import { useTokenSubscription } from '@apps/base/context/tokens'
import { BigDecimal } from '@apps/bigdecimal'
import { ViewportWidth } from '@apps/theme'
import { BigNumber, utils } from 'ethers'
import styled from 'styled-components'

// @ts-ignore
import { ReactComponent as MigrationArrow } from '../../../assets/migration-arrow.svg'
import { useStakedToken, useStakedTokenQuery } from '../../context/StakedToken'
import { StakeForm } from './StakeForm'

import type { FC } from 'react'

interface Balance {
  symbol?: string
  amount?: number
  decimals?: number
  suffix?: string
}

const StyledStakeForm = styled(StakeForm)`
  background: ${({ theme }) => theme.color.background[0]};
  padding: 1rem 0.75rem;
  border-radius: 1rem;
  max-width: 32rem;
`

const StakeFormContainer = styled.div`
  background: #3f51f0;
  display: flex;
  padding: 0.5rem;
  justify-content: center;
  width: 100%;
  border-radius: 1rem;

  @media (min-width: ${ViewportWidth.m}) {
    padding: 1rem;
  }

  @media (min-width: ${ViewportWidth.l}) {
    padding: 0.5rem;
    max-width: 26rem;
  }
`

const MigrationPanel = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.5rem 1.25rem;

  > div:first-child {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  h1 {
    font-size: 2.125rem;
    font-weight: 600;
    max-width: 12ch;
    line-height: 2.75rem;
    color: ${({ theme }) => theme.color.white};
  }

  p {
    font-size: 1rem;
    color: ${({ theme }) => theme.color.white};
    line-height: 1.5rem;
  }

  a {
    color: ${({ theme }) => theme.color.white};
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (min-width: ${ViewportWidth.l}) {
    padding: 2.125rem;
  }
`

const Achievement = styled.div`
  ${({ theme }) => theme.mixins.mono};

  display: flex;
  justify-content: space-between;
  color: ${({ theme }) => theme.color.white};
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.color.whiteTransparenter};
  padding-top: 1.5rem;

  span {
    ${({ theme }) => theme.mixins.numeric};
    background: linear-gradient(180deg, #4859f0 0%, #1929c0 100%);
    box-shadow: 0px 4px 10px 0px #1e2db9;
    border-radius: 1rem;
    padding: 1rem;
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(333.23deg, #2c3dd7 30.23%, #144561 135.17%);
  border-radius: 1.125rem;
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  align-items: center;

  @media (min-width: ${ViewportWidth.m}) {
    padding: 2rem;
  }

  @media (min-width: ${ViewportWidth.l}) {
    padding: 0;
    flex-direction: row;
  }
`

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

export const StakeMigration: FC<{ onSkip?: () => void }> = ({ onSkip }) => {
  const { selected, options } = useStakedToken()
  const { data } = useStakedTokenQuery()
  const stakedToken = useTokenSubscription(data?.stakedToken?.token.address)
  const isBPT = options[selected]?.icon?.symbol === 'mBPT'

  const values = useMemo<{
    baseRewardsApy?: Balance
    userRewardsApy?: Balance
  }>(() => {
    // TODO use @client Apollo fields
    const rewardRate = BigNumber.from(data?.stakedToken?.stakingRewards?.rewardRate ?? '0')
    const priceCoefficient = data?.stakedToken?.priceCoefficient
    const totalSupply = data?.stakedToken?.token?.totalSupply?.bigDecimal

    if (!data?.stakedToken?.accounts?.[0]?.balance) {
      // no balance, return with apy only
      if (data?.stakedToken?.stakingRewards?.rewardRate) {
        const baseRewardsApy = calculateStakingApy(
          priceCoefficient,
          rewardRate,
          BigNumber.from((1e18).toString()),
          BigNumber.from((1e18).toString()),
          totalSupply?.exact,
        )

        return {
          baseRewardsApy: { suffix: '%', amount: baseRewardsApy },
        }
      }

      return {}
    }

    const {
      stakedToken: {
        accounts: [
          {
            balance: { rawBD, userPriceCoefficient },
          },
        ],
      },
    } = data

    const scaledBalance = isBPT
      ? new BigDecimal(stakedToken?.balance?.exact?.div(userPriceCoefficient).mul(1e4).toString())
      : stakedToken?.balance

    const baseRewardsApy = calculateStakingApy(priceCoefficient, rewardRate, rawBD?.exact, rawBD?.exact, totalSupply?.exact)
    const userRewardsApy = calculateStakingApy(priceCoefficient, rewardRate, rawBD?.exact, scaledBalance?.exact, totalSupply?.exact)

    return {
      baseRewardsApy: { suffix: '%', amount: baseRewardsApy },
      userRewardsApy: { suffix: '%', amount: userRewardsApy },
    }
  }, [data, stakedToken, isBPT])

  return (
    <Container>
      <MigrationPanel>
        <div>
          <h1>
            Migrate
            <br /> to Staking V2
          </h1>
          <MigrationArrow />
        </div>
        <p>
          Migrate your MTA to the new Staking V2 contract in order to continue to govern the protocol and to receive rewards in MTA.{' '}
          <b>The longer you keep staking, the higher your multiplier becomes for voting power and rewards.</b>
        </p>
        <Achievement>
          <div>Current APY</div>
          <span>{values?.userRewardsApy ? values.userRewardsApy?.amount?.toFixed(2) : values?.baseRewardsApy?.amount?.toFixed(2)}%</span>
        </Achievement>
      </MigrationPanel>
      <StakeFormContainer>
        <StyledStakeForm isMigrating={true} />
      </StakeFormContainer>
    </Container>
  )
}
