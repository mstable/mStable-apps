import React, { FC, ReactElement } from 'react'
import styled from 'styled-components'
import { Color, ViewportWidth } from '@apps/theme'
import { UnstyledButton } from './Button'

const TabsContainer = styled.div`
  display: flex;
  margin: 0 0 1.25rem;
  align-items: left;
  box-shadow: inset 0 -2px 0 0 ${({ theme }) => theme.color.defaultBorder};
`

const TabBtn = styled(UnstyledButton)<{ active: boolean }>`
  cursor: pointer;
  background: transparent;
  color: ${({ active, theme }) => (active ? theme.color.primary : Color.grey)};
  padding: 0.5rem 1rem;
  font-weight: 600;
  font-size: 1.125rem;
  border-bottom: 2px ${({ active, theme }) => (active ? theme.color.primary : 'transparent')} solid;
  transition: border-bottom-color 0.2s ease;

  &:hover {
    border-bottom-color: ${({ active, theme }) => (active ? theme.color.primary : theme.color.primaryTransparent)};
  }
`

export const TabsLeftAlign: FC<{
  tabs: Record<string, { title: string; component?: ReactElement }>
  active: string
  onClick: (key: string) => void
  className?: string
}> = ({ tabs, children, active, onClick, className }) => {
  return (
    <div className={className}>
      <TabsContainer>
        {Object.keys(tabs)
          .filter(key => !!tabs[key].component)
          .map(_key => (
            <TabBtn
              key={_key}
              active={active === _key}
              onClick={() => {
                onClick(_key)
              }}
            >
              {tabs[_key].title}
            </TabBtn>
          ))}
      </TabsContainer>
      <div>
        {children && children}
        {active && tabs[active]?.component}
      </div>
    </div>
  )
}
