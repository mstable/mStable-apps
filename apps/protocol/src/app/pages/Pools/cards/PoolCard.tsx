import { TokenIcon, TokenPair } from '@apps/base/components/core'
import { CountUp, Tooltip } from '@apps/dumb-components'
import { useFeederPool } from '@apps/masset-hooks'
import { useSelectedMassetName } from '@apps/masset-provider'
import { ViewportWidth } from '@apps/theme'
import Skeleton from 'react-loading-skeleton'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { useFeederPoolApy } from '../../../hooks/useFeederPoolApy'
import { usePoolMetrics } from '../../../hooks/usePoolMetrics'
import { assetColorMapping } from '../constants'
import { Card } from './Card'

import type { FeederPoolState } from '@apps/data-provider'
import type { FC } from 'react'

interface Props {
  className?: string
  poolAddress: string
  deprecated?: boolean
}

const RewardsAPY = styled.div`
  display: flex;
  align-items: center;

  img {
    width: 2rem !important;
    margin-left: 0.5rem;
  }

  > div {
    display: flex;
    align-items: center;

    > div {
      display: flex;
    }
  }
`

const UnderlinedTip = styled(Tooltip)`
  text-decoration: underline;
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
    }
  }

  > div > div {
    font-size: 1rem;
  }

  ${RewardsAPY} + div {
    text-align: left;
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
  }

  > :last-child > a * {
    display: inline;
  }
`

export const PoolCard: FC<Props> = ({ poolAddress, className, deprecated }) => {
  const feederPool = useFeederPool(poolAddress) as FeederPoolState
  const feederPoolApy = useFeederPoolApy(poolAddress)
  const { baseApy } = usePoolMetrics(poolAddress)
  const massetName = useSelectedMassetName()
  const history = useHistory()

  const { vault } = feederPool

  const handleClick = (): void => history.push(`/${massetName}/pools/${poolAddress}`)

  if (!feederPool) return <Skeleton height={200} />

  return (
    <Container
      className={className}
      gradientColor={assetColorMapping[feederPool.title]}
      title={
        <div>
          <TokenPair symbols={[feederPool.masset.token.symbol, feederPool.fasset.token.symbol]} isLarge={false} />
          {feederPool.title}
        </div>
      }
      iconType={'chevron'}
      onClick={handleClick}
    >
      {!deprecated && (
        <StatsContainer>
          {!!feederPool?.vault && !!(feederPoolApy.value?.rewards.base || feederPoolApy.value?.rewards.maxBoost) && (
            <RewardsAPY>
              <p>
                <Tooltip tip="33% of earned MTA rewards are claimable immediately. The remaining rewards are streamed linearly after 26 weeks">
                  Rewards APY
                </Tooltip>
              </p>
              <div>
                <div>
                  <div>{feederPoolApy.value && <CountUp end={feederPoolApy.value.rewards.base} suffix="%" />}</div>
                  <div>
                    &nbsp;→&nbsp;
                    <UnderlinedTip tip="Max boost can be achieved by staking MTA" hideIcon>
                      {feederPoolApy.value && <CountUp end={feederPoolApy.value.rewards.maxBoost} suffix="%" />}
                    </UnderlinedTip>
                  </div>
                </div>
                <TokenIcon symbol={vault?.rewardsToken.symbol} />
              </div>
            </RewardsAPY>
          )}
          {!!feederPoolApy.value?.platformRewards && (
            <RewardsAPY>
              <p>
                <Tooltip tip="Platform rewards are not boosted and 100% is claimable immediately.">Platform APY</Tooltip>
              </p>
              <div>
                <div>{feederPoolApy.value && <CountUp end={feederPoolApy.value.platformRewards} suffix="%" />} </div>
                <TokenIcon symbol={vault?.platformRewardsToken?.symbol} />
              </div>
            </RewardsAPY>
          )}
          {baseApy > 0.05 && (
            <RewardsAPY>
              <p>
                <Tooltip tip="Base APY represents the increase in the value of the pool token over time.">Base APY</Tooltip>
              </p>
              <div>
                <div>
                  <CountUp end={baseApy} suffix="%" />
                </div>
              </div>
            </RewardsAPY>
          )}
          {feederPoolApy.value && feederPoolApy.value.rewards.base > 1000 && <div>While liquidity is low, this APY is highly volatile</div>}
        </StatsContainer>
      )}
    </Container>
  )
}
