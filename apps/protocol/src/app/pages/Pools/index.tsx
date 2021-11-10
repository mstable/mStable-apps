import type { FC, ReactElement } from 'react'
import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import Skeleton from 'react-loading-skeleton'

import { FeederPoolState, MassetState } from '@apps/data-provider'
import { useSelectedMassetConfig, MassetConfig, MASSET_CONFIG } from '@apps/masset-provider'
import { ChainIds, useNetwork } from '@apps/base/context/network'
import { ViewportWidth } from '@apps/theme'
import { useSelectedMassetState } from '@apps/masset-hooks'

import { ProtocolPageHeader as PageHeader } from '../ProtocolPageHeader'
import { Card } from './cards/Card'
import { OnboardingCard } from './cards/OnboardingCard'
import { PoolType } from './types'
import { PoolCard } from './cards/PoolCard'
import { useHistory } from 'react-router-dom'

interface CustomAssetCardProps {
  isCustomAssetCard: boolean
  key: string
  title: string
  url: string
  color?: string
  component: ReactElement
}

const DEFAULT_ITEM_COUNT = 10

const EmptyCard = styled(Card)`
  min-height: 6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed ${({ theme }) => theme.color.defaultBorder};
`

const LoadCard = styled(Card)`
  align-items: center;
  justify-content: center;

  h3 {
    font-size: 1.25rem;
    color: ${({ theme }) => theme.color.bodyAccent};
    font-weight: 600;
    text-align: center;
    flex: 1;
  }
`

const Cards = styled.div`
  display: flex;
  flex-direction: column;

  > * {
    flex: 1;
    margin-bottom: 1rem;
  }

  @media (min-width: ${ViewportWidth.m}) {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;

    > * {
      flex: 0;
      margin-bottom: 1.25rem;
      flex-basis: calc(50% - 0.75rem);
    }
  }
`

const Row = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;

  h2 {
    font-size: 1.25rem;
    font-weight: 600;
  }

  > div {
    margin-top: 1rem;

    button:not(:last-child) {
      margin-right: 1rem;
    }
  }

  @media (min-width: ${ViewportWidth.m}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    > div {
      margin-top: 0;
    }
  }
`

const Section = styled.div``

const Container = styled.div`
  > ${Section}:not(:last-child) {
    padding-bottom: 1rem;
    margin-bottom: 1rem;
  }
`

const Title: Record<PoolType, string> = {
  [PoolType.User]: 'Your Pools',
  [PoolType.Active]: 'Active Pools',
  [PoolType.Deprecated]: 'Deprecated Pools',
}

const sections = [PoolType.User, PoolType.Active, PoolType.Deprecated]

const CustomContent = styled.div`
  font-size: 1rem;
  max-width: 30ch;
  text-align: left;
  line-height: 1.5rem;
`

const CustomCard = styled(Card)`
  > div {
    width: 100%;
    z-index: 1;
  }
`

const customEarnCard = (massetConfig: MassetConfig): CustomAssetCardProps => ({
  isCustomAssetCard: true,
  key: 'earn',
  title: 'Earn Pools',
  url: `https://earn.mstable.org/#/${massetConfig.massetName}/earn`,
  color: '#afa4db',
  component: <CustomContent>Earn pools are available here</CustomContent>,
})

const customPoolCard = (massetConfig: MassetConfig): CustomAssetCardProps => {
  const reversedMasset = massetConfig.massetName === 'musd' ? 'mbtc' : 'musd'
  const formattedReverse = MASSET_CONFIG[reversedMasset].formattedName
  return {
    isCustomAssetCard: true,
    key: 'mpool',
    title: `${formattedReverse} Pools`,
    url: `/${massetConfig.massetName === 'musd' ? 'mbtc' : 'musd'}/pools`,
    component: <CustomContent>More pools available for {formattedReverse}</CustomContent>,
  }
}

const customNoPoolsCard = (massetConfig: MassetConfig, protocolName: string): CustomAssetCardProps => ({
  isCustomAssetCard: true,
  key: 'noPools',
  title: 'No Pools Available',
  url: '/',
  component: (
    <CustomContent>
      There are no pools available for {massetConfig.formattedName} on {protocolName} at this time
    </CustomContent>
  ),
})

const PoolsContent: FC = () => {
  const { feederPools, hasFeederPools } = useSelectedMassetState() as MassetState
  const history = useHistory()
  const network = useNetwork()
  const massetConfig = useSelectedMassetConfig()
  const isEthereum = network.chainId === ChainIds.EthereumMainnet
  const pools = useMemo(
    () =>
      Object.values(feederPools).reduce<{
        active: (FeederPoolState | CustomAssetCardProps)[]
        user: FeederPoolState[]
        deprecated: FeederPoolState[]
      }>(
        (prev, current) => {
          if (current.token.balance?.exact.gt(0) || current.vault?.account?.rawBalance.exact.gt(0)) {
            return { ...prev, user: [...prev.user, current] }
          }
          // TODO determine deprecated somehow
          return { ...prev, active: [current, ...prev.active] }
        },
        {
          user: [],
          active: hasFeederPools
            ? isEthereum
              ? [customEarnCard(massetConfig), customPoolCard(massetConfig)]
              : []
            : [customNoPoolsCard(massetConfig, network.protocolName)],
          deprecated: [],
        },
      ),
    [feederPools, hasFeederPools, isEthereum, network.protocolName, massetConfig],
  )

  const [numPoolsVisible, setNumPoolsVisible] = useState({
    [PoolType.User]: DEFAULT_ITEM_COUNT,
    [PoolType.Active]: DEFAULT_ITEM_COUNT,
    [PoolType.Deprecated]: DEFAULT_ITEM_COUNT,
  })

  const handleLoadMoreClick = useCallback(
    (type: PoolType) =>
      setNumPoolsVisible({
        ...numPoolsVisible,
        [type]: numPoolsVisible[type] + 3,
      }),
    [numPoolsVisible],
  )

  const handleCustomCardClick = (url: string) => (url.startsWith('/') ? history.push(url) : window.open(url, '_blank'))

  // Temp fix to make this a bit easier to read.
  const isPoolSectionVisible = (type: PoolType): boolean =>
    (type === PoolType.Deprecated && pools[type]?.length > 0) || type !== PoolType.Deprecated
  const isPoolHeadingVisible = (type: PoolType): boolean => type !== PoolType.Active || (type === PoolType.Active && !!pools[type].length)
  const isEmptyStateVisible = (type: PoolType): boolean => type === PoolType.User && pools[type]?.length === 0
  const isLoadMoreVisible = (type: PoolType): boolean => pools[type].length > numPoolsVisible[type]

  return (
    <>
      {sections.map(
        type =>
          isPoolSectionVisible(type) && (
            <Section key={type}>
              {isPoolHeadingVisible(type) && (
                <Row>
                  <h2>{Title[type]}</h2>
                </Row>
              )}
              <Cards>
                <OnboardingCard type={type} />
                {pools[type]
                  .filter((_, i) => i < numPoolsVisible[type])
                  .map(poolOrCard =>
                    (poolOrCard as CustomAssetCardProps).isCustomAssetCard ? (
                      <CustomCard
                        key={(poolOrCard as CustomAssetCardProps).key}
                        title={poolOrCard.title}
                        onClick={() => handleCustomCardClick((poolOrCard as CustomAssetCardProps).url)}
                        gradientColor={(poolOrCard as CustomAssetCardProps).color}
                        iconType={(poolOrCard as CustomAssetCardProps).url.startsWith('/') ? 'chevron' : 'external'}
                      >
                        {(poolOrCard as CustomAssetCardProps).component}
                      </CustomCard>
                    ) : (
                      <PoolCard
                        key={(poolOrCard as FeederPoolState).address}
                        poolAddress={(poolOrCard as FeederPoolState).address}
                        deprecated={type === PoolType.Deprecated}
                      />
                    ),
                  )}
                {isEmptyStateVisible(type) && (
                  <EmptyCard>
                    <p>No user pools found</p>
                  </EmptyCard>
                )}
                {isLoadMoreVisible(type) && (
                  <LoadCard onClick={() => handleLoadMoreClick(type)}>
                    <div>Load more</div>
                  </LoadCard>
                )}
              </Cards>
            </Section>
          ),
      )}
    </>
  )
}

export const Pools: FC = () => {
  const massetState = useSelectedMassetState()
  return (
    <Container>
      <PageHeader title="Pools" subtitle="Earn fees and ecosystem rewards" massetSwitcher />
      {massetState ? <PoolsContent /> : <Skeleton height={500} />}
    </Container>
  )
}
