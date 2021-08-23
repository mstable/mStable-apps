import React, { FC } from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import styled, { keyframes } from 'styled-components'

import { TabsOfTruth, createTabsContext } from '@apps/components/core'

import { ClaimForm } from './ClaimForm'
import { ClaimGraph } from './ClaimGraph'
import { StakeForm } from './StakeForm'
import { StakeGraph } from './StakeGraph'
import { WithdrawForm } from './WithdrawForm'
import { WithdrawGraph } from './WithdrawGraph'

enum Tabs {
  Stake,
  Claim,
  Withdraw,
}

const stakeTabs: { id: Tabs; title: string; Form: FC; Graph: FC }[] = [
  { id: Tabs.Stake, title: 'Stake', Form: StakeForm, Graph: StakeGraph },
  { id: Tabs.Claim, title: 'Claim', Form: ClaimForm, Graph: ClaimGraph },
  { id: Tabs.Withdraw, title: 'Withdraw', Form: WithdrawForm, Graph: WithdrawGraph },
]

const [useTabs, TabsProvider] = createTabsContext(stakeTabs)

const slide = keyframes`
  0% {
    filter: blur(0);
    opacity: 1;
  }
  100% {
    filter: blur(2px);
    opacity: 0;
  }
`

const StyledTransitionGroup = styled(TransitionGroup)`
  overflow: hidden;
  min-height: 20rem;
  position: relative;
  > * {
    position: absolute;
    top: 0;
    left: 0;
  }
`

const FormTransition = styled.div`
  &.entering {
    > * {
      animation: ${slide} 0.25s ease-in reverse;
    }
  }
  &.exiting {
    > * {
      animation: ${slide} 0.25s ease-out;
    }
  }
  &.exited {
    > * {
      opacity: 0;
      filter: blur(2px);
    }
  }
`

const FormsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  background: ${({ theme }) => theme.color.background};
  border: 1px ${({ theme }) => theme.color.lightGrey} solid;
  border-radius: 1rem;

  > :first-child {
    padding: 1.5rem;
  }

  > :last-child {
    min-height: 20rem;
    min-width: 24rem;
    max-width: 28rem;
    padding: 0.75rem;
    background: ${({ theme }) => theme.color.lighterGrey};
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 0.75rem;
  }
`

const Content: FC = () => {
  const [{ tabs, activeTabIndex }, setActiveIndex] = useTabs()
  const { Graph, Form } = stakeTabs[activeTabIndex]
  return (
    <FormsContainer>
      <Graph />
      <div>
        <TabsOfTruth tabs={tabs} activeTabIndex={activeTabIndex} setActiveIndex={setActiveIndex} />
        <StyledTransitionGroup>
          <CSSTransition key={activeTabIndex} timeout={200}>
            {className => (
              <FormTransition className={className}>
                <Form />
              </FormTransition>
            )}
          </CSSTransition>
        </StyledTransitionGroup>
      </div>
    </FormsContainer>
  )
}

export const StakeForms: FC = () => (
  <TabsProvider>
    <Content />
  </TabsProvider>
)
