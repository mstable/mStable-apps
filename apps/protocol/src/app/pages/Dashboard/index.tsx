import { useSelectedMassetState } from '@apps/masset-hooks'
import React, { FC, useLayoutEffect } from 'react'
import Skeleton from 'react-loading-skeleton'
import { ProtocolPageHeader as PageHeader } from '../ProtocolPageHeader'
import { Overview } from './Overview'
import { Pools } from './Pools'
import { VStack } from './Styled'
import { TotalTvl } from './TotalTvl'
import { Vaults } from './Vaults'

const DashboardContent: FC = () => (
  <VStack spacing={3}>
    <TotalTvl />
    <Overview />
    <Vaults />
    <Pools />
  </VStack>
)

export const Dashboard: FC = () => {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])
  const massetState = useSelectedMassetState()

  return (
    <div>
      <PageHeader title="mDashboard" />
      {massetState ? <DashboardContent /> : <Skeleton height={500} />}
    </div>
  )
}
