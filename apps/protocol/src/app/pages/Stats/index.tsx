import { useLayoutEffect } from 'react'

import { CountUp, H2, H3, ThemedSkeleton } from '@apps/dumb-components'
import { useSelectedMassetState } from '@apps/masset-hooks'
import Skeleton from 'react-loading-skeleton'
import styled from 'styled-components'

import { AggregateChart } from '../../components/stats/AggregateChart'
import { DailyApys } from '../../components/stats/DailyApys'
import { SimpleMassetStats } from '../../components/stats/SimpleMassetStats'
import { VolumeChart } from '../../components/stats/VolumeChart'
import { ProtocolPageHeader as PageHeader } from '../ProtocolPageHeader'

import type { FC } from 'react'

const Section = styled.section`
  padding-bottom: 32px;
`

const TotalSupply: FC = () => {
  const massetState = useSelectedMassetState()
  const totalSupply = massetState?.token.totalSupply
  return (
    <div>
      <H3>Total supply</H3>
      {totalSupply ? (
        <CountUp suffix={` ${massetState?.token.symbol}`} end={totalSupply.simpleRounded} decimals={2} />
      ) : (
        <ThemedSkeleton height={50} />
      )}
    </div>
  )
}

const TotalSavings: FC = () => {
  const massetState = useSelectedMassetState()
  const savingsContract = massetState?.savingsContracts.v2
  const exchangeRate = savingsContract?.latestExchangeRate?.rate.simple
  const totalSavings = savingsContract?.totalSavings?.simple
  const value = exchangeRate && totalSavings ? exchangeRate * totalSavings : undefined
  return (
    <div>
      <H3>Total savings</H3>
      {value ? <CountUp suffix={` ${massetState?.token.symbol}`} end={value} decimals={2} /> : <div>No data available yet</div>}
    </div>
  )
}

const NiceBigNumbers = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;

  > * {
    margin-right: 16px;
    width: 100%;
  }

  > :last-child {
    margin-right: 0;
  }
`

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;

  > :first-child {
    padding-bottom: 0;
    padding-top: 0;
  }
`

const StatsContent: FC = () => (
  <>
    <Section id="save">
      <ToggleContainer>
        <H2>Save</H2>
      </ToggleContainer>
      <DailyApys />
    </Section>
    <Section id="volumes">
      <H2>Volumes</H2>
      <VolumeChart />
    </Section>
    <Section id="totals">
      <H2>Totals</H2>
      <NiceBigNumbers>
        <TotalSupply />
        <TotalSavings />
      </NiceBigNumbers>
      <AggregateChart />
    </Section>
    <Section id="basket">
      <H2>Basket share</H2>
      <SimpleMassetStats />
    </Section>
  </>
)

export const Stats: FC = () => {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])
  const massetState = useSelectedMassetState()

  return (
    <div>
      <PageHeader title="Stats" subtitle="Explore activity across mStable" massetSwitcher />
      {massetState ? <StatsContent /> : <Skeleton height={500} />}
    </div>
  )
}
