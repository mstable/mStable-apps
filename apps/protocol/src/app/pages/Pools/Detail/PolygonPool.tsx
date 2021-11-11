import React, { useMemo, useState } from 'react'
import type { FC } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import Skeleton from 'react-loading-skeleton'

import type { FeederPoolState } from '@apps/data-provider'
import { TabCard } from '@apps/components/core'
import { useFeederPool } from '@apps/hooks'

import { useSelectedMassetPrice } from '../../../hooks/useSelectedMassetPrice'
import { RewardStreamsProvider } from '../../../context/RewardStreamsProvider'
import { ProtocolPageHeader as PageHeader } from '../../ProtocolPageHeader'
import { FeederPoolProvider, useSelectedFeederPoolState } from '../FeederPoolProvider'

import { Deposit } from './Deposit'
import { Withdraw } from './Withdraw'
import { FraxStakingProvider } from '../../../context/FraxStakingProvider'
import { FraxStake } from './Frax/FraxStake'
import { FraxPoolDetailCard } from './Frax/FraxPoolDetailCard'

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
        <PageHeader title="Pools" subtitle={title} massetSwitcher />
        <Inner>
          <FraxPoolDetailCard poolAddress={address} />
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
