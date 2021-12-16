import React, { FC } from 'react'
import { useToggle } from 'react-use'
import styled from 'styled-components'

import { useURLQuery } from '@apps/hooks'
import { TabsOfTruth, createTabsContext, ThemedSkeleton } from '@apps/dumb-components'
import { ViewportWidth } from '@apps/theme'

import { useStakingStatus } from '../../context/StakingStatus'
import { useStakedTokenQuery } from '../../context/StakedToken'

import { ClaimForm } from './ClaimForm'
import { ClaimGraph } from './ClaimGraph'
import { StakeSelection } from './StakeSelection'
import { StakeForm } from './StakeForm'
import { StakeGraph } from './StakeGraph'
import { StakeMigration } from './StakeMigration'
import { WithdrawForm } from './WithdrawForm'
import { WithdrawGraph } from './WithdrawGraph'
import { Link } from 'react-router-dom'

enum Tabs {
  Stake,
  Claim,
  Withdraw,
}

const stakeTabs: {
  id: Tabs
  title: string
  link?: { title: string; href: string }
  heading: string
  subheading: string
  Form: FC
  Graph: FC
}[] = [
  {
    id: Tabs.Stake,
    title: 'Stake',
    heading: 'Voting Power',
    subheading: 'Your vMTA balance will increase the longer you stake',
    link: { title: 'See quests', href: '/quests' },
    Form: StakeForm,
    Graph: StakeGraph,
  },
  {
    id: Tabs.Claim,
    title: 'Claim',
    heading: 'MTA Rewards',
    subheading: 'Your vMTA balance will increase the longer you stake',
    link: { title: 'See quests', href: '/quests' },
    Form: ClaimForm,
    Graph: ClaimGraph,
  },
  {
    id: Tabs.Withdraw,
    title: 'Withdraw',
    heading: 'Withdrawal Fee',
    subheading: 'Your withdrawal fee decreases the longer you have staked',
    Form: WithdrawForm,
    Graph: WithdrawGraph,
  },
]

const [useTabs, TabsProvider] = createTabsContext(stakeTabs)

const GraphContainer = styled.div`
  flex: 1;

  h2 {
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 2rem;
    color: ${({ theme }) => theme.color.body};
  }

  h4 {
    font-size: 0.75rem;
    line-height: 1.5rem;
    font-weight: 400;
    color: ${({ theme }) => theme.color.bodyTransparent};
  }
`

const FormContainer = styled.div`
  min-height: 20rem;
  padding: 0.75rem;
  background: ${({ theme }) => theme.color.background[1]};
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  @media (min-width: ${ViewportWidth.m}) {
    min-width: 24rem;
    width: 24rem;
  }
`

const Empty = styled.div`
  border: 1px ${({ theme }) => theme.color.defaultBorder} solid;
  border-radius: 1rem;
  height: 24rem;

  * {
    width: 100%;
    height: 100%;
    border-radius: 1rem;
  }
`

const FormsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: ${({ theme }) => theme.color.background[0]};
  border: 1px ${({ theme }) => theme.color.defaultBorder} solid;
  border-radius: 1rem;

  > :first-child {
    padding: 1.5rem;
  }

  @media (min-width: ${ViewportWidth.m}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
`

const Content: FC = () => {
  const [{ tabs, activeTabIndex }, setActiveIndex] = useTabs()
  const { data, loading } = useStakedTokenQuery()
  const urlQuery = useURLQuery()
  const [skipMigration, setSkipMigration] = useToggle(false)
  const balanceV2Simple =
    data?.stakedToken?.accounts?.[0]?.balance?.rawBD?.simple + parseFloat(data?.stakedToken?.accounts?.[0]?.balance?.cooldownUnits) / 1e18
  const { hasWithdrawnV1Balance, hasSelectedStakeOption, lockedV1 } = useStakingStatus()
  const migrateSlug = urlQuery.get('migrate') === 'true' // ?migrate=true

  const { balance: balanceV1 } = lockedV1?.value ?? {}
  const userNeedsMigration = (!!balanceV1?.simple && !balanceV2Simple) || hasWithdrawnV1Balance

  const { Graph, Form, heading, subheading, link } = stakeTabs[activeTabIndex]

  if (loading)
    return (
      <Empty>
        <ThemedSkeleton />
      </Empty>
    )

  return (userNeedsMigration || migrateSlug) && !skipMigration ? (
    <StakeMigration onSkip={setSkipMigration} />
  ) : !hasSelectedStakeOption && !balanceV2Simple ? (
    <StakeSelection />
  ) : (
    <FormsContainer>
      <GraphContainer>
        <h2>{heading}</h2>
        <h4>
          {subheading} {link && <Link to={link.href}>{link.title}</Link>}
        </h4>
        <Graph />
      </GraphContainer>
      <FormContainer>
        <TabsOfTruth tabs={tabs} activeTabIndex={activeTabIndex} setActiveIndex={setActiveIndex} />
        <Form />
      </FormContainer>
    </FormsContainer>
  )
}

export const StakeForms: FC = () => (
  <TabsProvider>
    <Content />
  </TabsProvider>
)
