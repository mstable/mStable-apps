import React, { FC, useEffect, useLayoutEffect, useState } from 'react'
import { useAccount } from '@apps/base/context/account'
import { useDataState } from '@apps/data-provider'
import { InfoButton, TabsLeftAlign } from '@apps/dumb-components'
import Skeleton from 'react-loading-skeleton'
import styled from 'styled-components'
import { Overview } from './Overview'
import { PoolsTable } from './PoolsTable'
import { WalletTable } from './WalletTable'
import { RewardsProvider, useReset } from './RewardsContext'
import { Illustration } from './Illustration'
import { SaveTable } from './SaveTable'
import { ViewportWidth } from '@apps/theme'
import { useHistory } from 'react-router-dom'
import { useSelectedMasset } from '@apps/masset-provider'
import { ReactComponent as Logo } from '@apps/icons/mstable.svg'
import { NetworkSwitcher } from './NetworkSwitcher'
import { RewardsEarnedProvider, StakingRewardsProvider } from '../Save/hooks'
import { FraxStakingProvider } from '../../context/FraxStakingProvider'

enum Tabs {
  Save = 'Save',
  Pools = 'Pools',
  Wallet = 'Wallet',
}

const tabs = {
  [Tabs.Save]: {
    title: `Save`,
    component: <SaveTable />,
  },
  [Tabs.Pools]: {
    title: `Pools`,
    component: <PoolsTable />,
  },
  [Tabs.Wallet]: {
    title: `Wallet`,
    component: <WalletTable />,
  },
}

const DashboardContent: FC = () => {
  const address = useAccount()
  const reset = useReset()
  const [activeTab, setActiveTab] = useState<string>(Tabs.Save as string)

  useEffect(() => {
    reset()
  }, [address, reset, activeTab])

  const filteredTabs = Object.keys(tabs)
    .filter(key => (!address ? key !== 'Wallet' : true))
    .reduce((obj, key) => {
      obj[key] = tabs[key]
      return obj
    }, {})

  return (
    <TabsLeftAlign tabs={filteredTabs} active={activeTab} onClick={setActiveTab}>
      {activeTab !== 'Wallet' && <Overview tab={activeTab as 'Pools' | 'Save'} />}
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

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 1rem 0;

  svg {
    width: 12rem;
    fill: ${({ theme }) => theme.color.body};
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
  const [massetName] = useSelectedMasset()
  const history = useHistory()
  const dataState = useDataState()

  const handleButtonClick = (index: number) => {
    switch (index) {
      case 0:
        history.push(`${massetName}/save`)
        break
      default:
        window.open('https://staking.mstable.app/', '_blank')
    }
  }

  return (
    <Container>
      <LogoContainer>
        <Logo />
        <NetworkSwitcher />
      </LogoContainer>
      <UserCapture>
        <Illustration />
        <ActionCallouts>
          <InfoButton
            title="Deposit"
            content="Deposit your assets to Save and begin earning interest"
            icon="tokens"
            onClick={() => handleButtonClick(0)}
          />
          <InfoButton
            title="Staking"
            content="Stake MTA to participate in Governance and boost your rewards on Vault deposits"
            onClick={() => handleButtonClick(1)}
          />
        </ActionCallouts>
      </UserCapture>
      {/* TODO: Tidy this */}
      {dataState ? (
        <StakingRewardsProvider stakingTokenAddress={dataState?.musd?.savingsContracts?.v2?.token?.address}>
          <RewardsEarnedProvider>
            <RewardsProvider>
              <FraxStakingProvider>
                <DashboardContent />
              </FraxStakingProvider>
            </RewardsProvider>
          </RewardsEarnedProvider>
        </StakingRewardsProvider>
      ) : (
        <Skeleton height={500} />
      )}
    </Container>
  )
}
