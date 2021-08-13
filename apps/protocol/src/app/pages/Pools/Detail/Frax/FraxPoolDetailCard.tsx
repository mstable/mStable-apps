import React, { FC } from 'react'
import styled from 'styled-components'
import Skeleton from 'react-loading-skeleton'

import { FeederPoolState } from '@apps/data-provider'
import { ViewportWidth } from '@apps/base/theme'
import { Button, CountUp, ExternalLink } from '@apps/components/core'
import { TokenIcon, TokenPair } from '@apps/components/icons'
import { useFeederPool } from '@apps/hooks'
import { assetColorMapping } from '../../constants'
import { Card } from '../../cards/Card'
import { useFraxStakingContract, useFraxStakingState } from 'apps/protocol/src/app/context/FraxStakingProvider'
import { usePropose } from '@apps/base/context/transactions'
import { Interfaces } from '@apps/types'
import { TransactionManifest } from '@apps/transaction-manifest'

interface Props {
  className?: string
  poolAddress: string
  deprecated?: boolean
}

const StyledTokenIcon = styled(TokenIcon)`
  width: 2rem;
`

const BottomContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
`

const Rewards = styled.div`
  display: flex;

  > *:not(:last-child) {
    margin-right: 1rem;
  }
`

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0.5rem;

  > div {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;

    > :first-child {
      font-weight: 600;
    }

    > :last-child {
      text-align: right;
      span {
        ${({ theme }) => theme.mixins.numeric};
      }
    }

    @media (min-width: ${ViewportWidth.m}) {
      flex-direction: row;
      flex: 0;
      justify-content: space-between;
      flex-basis: calc(50% - 5%);
    }
  }

  @media (min-width: ${ViewportWidth.m}) {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }
`

const Container = styled(Card)`
  h2 > div {
    display: flex;
    align-items: center;

    > *:first-child {
      margin-right: 0.5rem;
    }
  }

  > div {
    width: 100%;

    > div {
      width: 100%;
    }
  }

  > :last-child > a * {
    display: inline;
  }

  h3 {
    font-size: 1.75rem;
  }
`

export const FraxPoolDetailCard: FC<Props> = ({ poolAddress, className }) => {
  const feederPool = useFeederPool(poolAddress) as FeederPoolState
  const stakingContract = useFraxStakingContract()
  const propose = usePropose()
  const { subscribedData, rewards } = useFraxStakingState()

  const claimRewards = () => {
    if (!stakingContract) return

    propose<Interfaces.FraxCrossChainFarm, 'getReward'>(
      new TransactionManifest(stakingContract, 'getReward', [], { present: 'Claiming rewards', past: 'Claimed rewards' }),
    )
  }

  const canClaimRewards = subscribedData.value?.accountData?.earned?.some(e => e.amount.exact.gt(0))

  if (!feederPool) return <Skeleton height={200} />

  return (
    <Container
      className={className}
      gradientColor={assetColorMapping[feederPool.title]}
      title={
        <div>
          <TokenPair symbols={[feederPool.masset.token.symbol, feederPool.fasset.token.symbol]} isLarge={true} />
          {feederPool.title}
        </div>
      }
    >
      <div>
        <StatsContainer>
          <div>
            <p>Balance</p>
            <div>
              {subscribedData.value?.accountData ? (
                <CountUp end={subscribedData.value.accountData.poolBalance.simple} prefix="$" />
              ) : (
                <Skeleton height={20} />
              )}
            </div>
          </div>
          <div>
            <p>Rewards APY</p>
            <div>
              {rewards.value ? (
                <>
                  <CountUp end={rewards.value.base} suffix="%" /> – <CountUp end={rewards.value.maxBoost} suffix="%" />
                </>
              ) : (
                <Skeleton height={20} />
              )}
            </div>
          </div>
          <div>
            <p>Base APY</p>
            <div>{feederPool ? <CountUp end={feederPool.dailyApy} suffix="%" /> : <Skeleton height={20} />}</div>
          </div>
          <div>
            <p>Rewards</p>
            <Rewards>
              {subscribedData.value?.accountData ? (
                subscribedData.value.accountData?.earned?.map(({ symbol, amount }) => (
                  <div key={symbol}>
                    <StyledTokenIcon symbol={symbol} />
                    <CountUp end={amount.simple} />
                  </div>
                ))
              ) : (
                <Skeleton height={20} />
              )}
            </Rewards>
          </div>
        </StatsContainer>
        <BottomContainer>
          <ExternalLink href="https://app.frax.finance/staking#mStable_FRAX_mUSD">Use this pool on Frax</ExternalLink>
          <div>
            <Button scale={0.7} highlighted={canClaimRewards} onClick={claimRewards} disabled={!canClaimRewards}>
              Claim rewards
            </Button>
          </div>
        </BottomContainer>
      </div>
    </Container>
  )
}
