import React, { FC, useEffect, useLayoutEffect, useState } from 'react'
import { useAccount } from '@apps/base/context/account'
import { useDataState } from '@apps/data-provider'
import { InfoButton, TabsLeftAlign } from '@apps/dumb-components'
import Skeleton from 'react-loading-skeleton'
import styled from 'styled-components'
import { Overview } from './Overview'
import { Pools } from './Pools'
import { RewardsProvider, useReset } from './RewardsContext'
import { Illustration } from './Illustration'
import { TotalTvl } from './TotalTvl'
import { Vaults } from './Vaults'
import { ViewportWidth } from '@apps/theme'

enum Tabs {
  Save = 'Save',
  Pools = 'Pools',
}

const tabs = {
  [Tabs.Save]: {
    title: `Save`,
    component: <Vaults />,
  },
  [Tabs.Pools]: {
    title: `Pools`,
    component: <Pools />,
  },
}

const DashboardContent: FC = () => {
  const address = useAccount()
  const reset = useReset()
  const [activeTab, setActiveTab] = useState<string>(Tabs.Save as string)

  useEffect(() => {
    reset()
  }, [address, reset])

  return (
    <TabsLeftAlign tabs={tabs} active={activeTab} onClick={setActiveTab}>
      <Overview />
    </TabsLeftAlign>
  )
}

const UserCapture = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 1rem;
  flex-direction: column;

  > * {
    margin-bottom: 0.5rem;
  }

  @media (min-width: ${ViewportWidth.m}) {
    flex-direction: row;

    > * {
      margin-bottom: 0;
    }

    > div:first-child {
      flex-basis: calc(65% - 0.75rem);
    }
    > div:last-child {
      flex-basis: calc(35% - 0.75rem);
    }
  }
`

const ActionCallouts = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  > *:not(:last-child) {
    margin-bottom: 0.5rem;
  }
`

const Container = styled.div`
  margin-top: 2rem;

  > *:not(:last-child) {
    margin-bottom: 1.25rem;
  }
`

export const Dashboard: FC = () => {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])
  const dataState = useDataState()

  return (
    <Container>
      <TotalTvl />
      <UserCapture>
        <Illustration />
        <ActionCallouts>
          <InfoButton title="Deposit" content="Deposit your assets and begin earning interest" onClick={() => {}} />
          <InfoButton
            title="Earn MTA"
            content="Stake MTA to participate in Governance and boost your rewards on Vault deposits"
            onClick={() => {}}
          />
        </ActionCallouts>
      </UserCapture>
      {dataState ? (
        <RewardsProvider>
          <DashboardContent />
        </RewardsProvider>
      ) : (
        <Skeleton height={500} />
      )}
    </Container>
  )
}
