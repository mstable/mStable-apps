import React, { createContext, useState, FC, Dispatch, SetStateAction, useMemo, useRef, useLayoutEffect } from 'react'
import { usePrevious } from 'react-use'
import { Transition } from 'react-transition-group'
import styled from 'styled-components'
import { providerFactory, createUseContextFn } from '@apps/hooks'

import { UnstyledButton } from './Button'

interface Tab {
  id: string | number
  title: string
}

interface State {
  activeTabIndex: number
  tabs: (Tab & { active: boolean })[]
}

export const createTabsContext = (tabs: Tab[], defaultActiveTabIndex: number = 0) => {
  const context = createContext<[State, Dispatch<SetStateAction<number>>]>([{ tabs, activeTabIndex: defaultActiveTabIndex }] as never)

  const TabsOfTruthProvider: FC = ({ children }) => {
    const [activeTabIndex, setActiveTabIndex] = useState<number>(defaultActiveTabIndex)
    return providerFactory(
      context,
      {
        value: useMemo<[State, Dispatch<SetStateAction<number>>]>(
          () => [{ activeTabIndex, tabs: tabs.map((t, index) => ({ ...t, active: index === activeTabIndex })) }, setActiveTabIndex],
          [activeTabIndex],
        ),
      },
      children,
    )
  }

  return [createUseContextFn(context), TabsOfTruthProvider, context] as const
}

const TabButton = styled(UnstyledButton)<{ active: boolean }>`
  flex: 1;
  font-size: 1rem;
  font-weight: ${({ active }) => (active ? 500 : 400)};
  height: 2.5rem;
  z-index: 1;
  transition: all 0.25s ease-in-out;
  color: ${({ theme, active }) => (active ? theme.color.white : theme.color.bodyAccent)};
  border-radius: 1rem;

  &:hover {
    font-weight: 500;
    transition: 0.5s ease-out font-weight;
  }
`

const ActiveTab = styled.div<{ pos: [number, number] }>`
  position: absolute;
  z-index: 0;
  top: 0;
  bottom: 0;
  border-radius: 1rem;
  background: ${({ theme }) => theme.color.blue};
  user-select: none;
  pointer-events: none;
  transition: all 0.25s ease-in-out;

  &.entering,
  &.exiting {
    box-shadow: 1px 0 1px 0 ${({ theme }) => theme.color.blue}, -1px 0 1px 0 ${({ theme }) => theme.color.blue};
  }

  ${({ pos: [x, w] }) =>
    `left: ${x}px;
    width: ${w}px;
    `}
`

const TabsContainer = styled.div`
  position: relative;
  background: ${({ theme }) => theme.color.background[0]};
  border: 1px ${({ theme }) => theme.color.background[2]} solid;
  border-radius: 1rem;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
`

export const TabsOfTruth: FC<
  State & {
    setActiveIndex(index: number): void
  }
> = ({ tabs, setActiveIndex, activeTabIndex }) => {
  const container = useRef<HTMLDivElement>(undefined as never)
  const prevActiveTabIndex = usePrevious(activeTabIndex)
  const [activePos, setActivePos] = useState<[number, number]>([0, 0])

  useLayoutEffect(() => {
    const { offsetWidth, offsetLeft } = container.current.childNodes.item(activeTabIndex + 1) as HTMLElement
    setActivePos([offsetLeft, offsetWidth])
  }, [activeTabIndex])

  return (
    <TabsContainer ref={container}>
      <Transition in={activeTabIndex !== prevActiveTabIndex} appear timeout={250} unmountOnExit={false}>
        {className => <ActiveTab pos={activePos} className={className} />}
      </Transition>
      {tabs.map(({ id, title, active }, index) => (
        <TabButton
          active={active}
          key={id}
          onClick={() => {
            setActiveIndex(index)
          }}
        >
          {title}
        </TabButton>
      ))}
    </TabsContainer>
  )
}
