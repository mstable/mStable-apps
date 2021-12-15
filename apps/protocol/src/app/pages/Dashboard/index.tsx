import { useAccount } from '@apps/base/context/account'
import { useDataState } from '@apps/data-provider'
import React, { FC, useEffect, useLayoutEffect } from 'react'
import Skeleton from 'react-loading-skeleton'
import { ProtocolPageHeader as PageHeader } from '../ProtocolPageHeader'
import { Overview } from './Overview'
import { Pools } from './Pools'
import { RewardsProvider, useReset } from './RewardsContext'
import { VStack } from './Styled'
import { TotalTvl } from './TotalTvl'
import { Vaults } from './Vaults'

const DashboardContent: FC = () => {
  const address = useAccount()
  const reset = useReset()

  useEffect(() => {
    reset()
  }, [address, reset])

  return (
    <VStack spacing={3}>
      <TotalTvl />
      <Overview />
      <Vaults />
      <Pools />
    </VStack>
  )
}

export const Dashboard: FC = () => {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])
  const dataState = useDataState()

  return (
    <div>
      <PageHeader title="mDashboard" />
      {dataState ? (
        <RewardsProvider>
          <DashboardContent />
        </RewardsProvider>
      ) : (
        <Skeleton height={500} />
      )}
    </div>
  )
}
