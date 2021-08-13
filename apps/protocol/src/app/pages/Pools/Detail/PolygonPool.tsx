import React, { useMemo, useState } from 'react'
import type { FC } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import Skeleton from 'react-loading-skeleton'

import type { FeederPoolState } from '@apps/data-provider'
import { ViewportWidth } from '@apps/base/theme'
import { TabCard } from '@apps/components/core'
import { ReactComponent as EarnIcon } from '@apps/components/icons/circle/earn.svg'
import { useFeederPool } from '@apps/hooks'

import { useSelectedMassetPrice } from '../../../hooks/useSelectedMassetPrice'
import { RewardStreamsProvider } from '../../../context/RewardStreamsProvider'
import { PageHeader } from '../../PageHeader'
import { AssetCard, CardType } from '../cards/AssetCard'
import { assetColorMapping } from '../constants'
import { FeederPoolProvider, useSelectedFeederPoolState } from '../FeederPoolProvider'

import { Deposit } from './Deposit'
import { Withdraw } from './Withdraw'
import { FraxStakingProvider } from '../../../context/FraxStakingProvider'
import { FraxStake } from './Frax/FraxStake'
import { PoolOverview } from './PoolOverview'

const Inner = styled.div`
  max-width: 36rem;
  width: 100%;

  > * {
  }

  > div:first-child {
    margin-bottom: 1rem;
  }
`

const Exchange = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 42rem;
`

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  > div:not(:first-child):not(:last-child) {
    margin-bottom: 1.25rem;
  }
`

const PoolDetailContent: FC = () => {
  const { address, title, liquidity, vault } = useSelectedFeederPoolState() as FeederPoolState
  const massetPrice = useSelectedMassetPrice()

  const color = assetColorMapping[title]
  const isLowLiquidity = massetPrice ? liquidity.simple * (massetPrice.value ?? 0) < 100000 : false

  const tabs = useMemo(
    () => ({
      Deposit: {
        title: 'Deposit',
        component: <Deposit isLowLiquidity={isLowLiquidity} />,
      },
      Withdraw: {
        title: 'Withdraw',
        component: <Withdraw isLowLiquidity={isLowLiquidity} />,
      },
      Stake: {
        title: 'Stake',
        component: <FraxStake />,
      },
    }),
    [isLowLiquidity],
  )

  const [activeTab, setActiveTab] = useState<string>('Deposit')

  return (
    <RewardStreamsProvider vault={vault}>
      <Container>
        <PageHeader title="Pools" subtitle={title} icon={<EarnIcon />} massetSwitcher />
        <Inner>
          <AssetCard type={CardType.largeSimple} poolAddress={address} color={color} />
          <PoolOverview />
          <Exchange>
            <TabCard tabs={tabs} active={activeTab} onClick={setActiveTab} />
          </Exchange>
        </Inner>
      </Container>
    </RewardStreamsProvider>
  )
}

export const PolygonPool: FC = () => {
  const { poolAddress } = useParams<{
    poolAddress: string
  }>()
  const feederPool = useFeederPool(poolAddress)
  return feederPool ? (
    <FeederPoolProvider poolAddress={poolAddress}>
      <FraxStakingProvider>
        <PoolDetailContent />
      </FraxStakingProvider>
    </FeederPoolProvider>
  ) : (
    <Skeleton height={300} />
  )
}
