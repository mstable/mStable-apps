import { BigNumber } from 'ethers'
import React, { FC, useMemo } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import Skeleton from 'react-loading-skeleton'

import { useFeederPoolMetricsQuery } from '@apps/artifacts/graphql/feeders'
import { useSelectedMassetName } from '@apps/masset-provider'
import { useTokenSubscription } from '@apps/base/context/tokens'
import { FeederPoolState } from '@apps/data-provider'
import { useBlockNumbers } from '@apps/base/context/block'
import { BigDecimal } from '@apps/bigdecimal'
import { ViewportWidth } from '@apps/base/theme'
import { toK } from '@apps/formatters'
import { CountUp, CountUpUSD, Table, TableCell, TableRow, Tooltip } from '@apps/components/core'
import { TokenIcon, TokenPair } from '@apps/components/icons'
import { useFeederPool } from '@apps/hooks'

import { useSelectedMassetPrice } from '../../../hooks/useSelectedMassetPrice'
import { useFeederPoolApy } from '../../../hooks/useFeederPoolApy'
import { assetColorMapping } from '../constants'
import { Card } from './Card'

interface Props {
  className?: string
  poolAddress: string
  color?: string
}

const RewardsAPY = styled.div<{ isLarge?: boolean }>`
  img {
    width: 2rem !important;
    margin-left: 0.5rem;
  }

  > div {
    display: flex;
    align-items: center;
  }
`

const UnderlinedTip = styled(Tooltip)`
  text-decoration: underline;
`

const StatsContainer = styled.div<{ isLarge?: boolean }>`
  display: flex;
  flex-direction: column;
  flex: 1;

  > div:not(:last-child) {
    margin-bottom: 0.5rem;
  }

  // hide amount on small card
  > div:first-child {
    margin-bottom: 1rem;
    > div {
      > span:first-child {
        display: ${({ isLarge }) => (isLarge ? 'inherit' : 'none')};
      }
    }
  }

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
      flex-basis: ${({ isLarge }) => isLarge && `calc(50% - 5%)`};
    }
  }

  @media (min-width: ${ViewportWidth.m}) {
    ${({ isLarge }) =>
      isLarge && {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}
  }
  > div > div {
    font-size: ${({ isLarge }) => !isLarge && `1rem`};
  }

  ${RewardsAPY} + div {
    text-align: left;
  }
`

const PoolStats: FC<{ address: string }> = ({ address }) => {
  const { liquidity, price, vault } = useFeederPool(address) as FeederPoolState
  const massetPrice = useSelectedMassetPrice()

  const { block24h } = useBlockNumbers()

  const fpMetrics = useFeederPoolMetricsQuery({
    variables: { feederPool: address, block: { number: block24h as number } },
    skip: !block24h,
  })

  const fpTokenPrice = massetPrice ? price.simple * (massetPrice.value ?? 0) : undefined
  const feederPoolApy = useFeederPoolApy(address)

  const metrics = useMemo(() => {
    let volume = BigDecimal.ZERO
    let baseApy

    if (fpMetrics.data?.historic && fpMetrics.data.current) {
      const { current, historic } = fpMetrics.data
      {
        const swapped = BigDecimal.fromMetric(current.cumulativeSwapped).sub(BigDecimal.fromMetric(historic.cumulativeSwapped))
        const minted = BigDecimal.fromMetric(current.cumulativeMinted).sub(BigDecimal.fromMetric(historic.cumulativeMinted))
        const redeemed = BigDecimal.fromMetric(current.cumulativeRedeemed).sub(BigDecimal.fromMetric(historic.cumulativeRedeemed))
        volume = swapped.add(minted).add(redeemed)
      }
      {
        // This can go out of sync when the price hasn't updated for > 24h; we should
        // track priceUpdatedAt on the subgraph
        const rateDiff = parseFloat(current.price) / parseFloat(historic.price)
        baseApy = (rateDiff ** 365 - 1) * 100
      }
    }

    return { volume, baseApy }
  }, [fpMetrics])

  const withdrawHeaderTitles = ['Vault', 'Rewards Multiplier', 'Time Remaining'].map(t => ({ title: t }))

  return (
    <StatsContainer isLarge={true}>
      <Table headerTitles={withdrawHeaderTitles}>
        <TableRow>
          <TableCell>Hello</TableCell>
          <TableCell>Hello</TableCell>
          <TableCell>Hello</TableCell>
        </TableRow>
      </Table>
      {/* <div>
        <p>Liquidity</p>
        <CountUpUSD end={liquidity.simple} price={fpTokenPrice} formattingFn={toK} />
      </div>
      <div>
        <p>Price</p>
        <div>
          <CountUpUSD end={price.simple} decimals={10} price={massetPrice.value} />
        </div>
      </div>
      <div>
        <p>24h Volume</p>
        <CountUpUSD end={metrics.volume.simple} decimals={10} price={massetPrice.value} formattingFn={toK} />
      </div>
      <RewardsAPY isLarge={true}>
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
          <TokenIcon symbol={vault.rewardsToken.symbol} />
        </div>
      </RewardsAPY>
      {feederPoolApy.value?.platformRewards && (
        <>
          <div />
          <RewardsAPY isLarge={isLarge}>
            <p>
              <Tooltip tip="Platform rewards are not boosted and 100% is claimable immediately.">Platform APY</Tooltip>
            </p>
            <div>
              <div>{feederPoolApy.value && <CountUp end={feederPoolApy.value.platformRewards} suffix="%" />} </div>
              <TokenIcon symbol={vault.platformRewardsToken?.symbol} />
            </div>
          </RewardsAPY>
        </>
      )}
      {!!metrics.baseApy && metrics.baseApy > 0 && (
        <>
          <div />
          <RewardsAPY isLarge={true}>
            <p>
              <Tooltip tip="Base APY represents the increase in the value of the pool token over time.">Base APY</Tooltip>
            </p>
            <div>
              <div>
                <CountUp end={metrics.baseApy} suffix="%" />
              </div>
            </div>
          </RewardsAPY>
        </>
      )} */}
      {feederPoolApy.value && feederPoolApy.value.rewards.base > 1000 && <div>While liquidity is low, this APY is highly volatile</div>}
    </StatsContainer>
  )
}

const Container = styled(Card)`
  position: relative;

  h2 > div {
    display: flex;
    align-items: center;

    > *:first-child {
      margin-right: 0.5rem;
    }
  }

  > div {
    width: 100%;
    z-index: 1;
  }

  > :last-child > a * {
    display: inline;
  }
`

export const HeaderCardV2: FC<Props> = ({ poolAddress, className, color }) => {
  const feederPool = useFeederPool(poolAddress) as FeederPoolState

  useTokenSubscription(feederPool.address)
  useTokenSubscription(feederPool.fasset.address)

  const massetName = useSelectedMassetName()
  const history = useHistory()

  const gradientColor = color ?? assetColorMapping[feederPool.title]

  const handleClick = (): void => {
    history.push(`/${massetName}/pools/${poolAddress}`)
  }

  return feederPool ? (
    <Container
      gradientColor={gradientColor}
      className={className}
      title={
        <div>
          <TokenPair symbols={[feederPool.masset.token.symbol, feederPool.fasset.token.symbol]} isLarge={true} />
          {feederPool.title}
        </div>
      }
    >
      {/* <PoolStats address={poolAddress} /> */}
    </Container>
  ) : (
    <Skeleton height={200} />
  )
}
