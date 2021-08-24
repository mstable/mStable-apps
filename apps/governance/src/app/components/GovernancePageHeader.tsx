import React, { FC } from 'react'
import styled from 'styled-components'
import { ViewportWidth } from '@apps/base/theme'

import { StakedTokenSwitcher } from './StakedTokenSwitcher'

interface Props {
  title: string
  icon?: JSX.Element
  subtitle?: string
  stakedTokenSwitcher?: boolean
}

const Icon = styled.div<{ inverted?: boolean }>`
  display: flex;
  margin-right: 0.5rem;

  img,
  svg {
    width: 2.5rem;
    height: 2.5rem;

    * {
      fill: ${({ theme }) => theme.color.body};
    }
  }

  img + div {
    display: none;
  }
`

const Container = styled.div<{
  messageVisible?: boolean
}>`
  display: flex;
  flex-direction: column;
  padding: 2rem 0;

  h2 {
    font-size: 2rem;
    font-weight: 600;
  }

  p {
    padding: 0.25rem 0 0;
    font-size: 1rem;
    line-height: 1.5rem;
    max-width: 65ch;
    color: ${({ theme }) => theme.color.bodyAccent};
  }

  > *:not(:last-child) {
    margin-bottom: 0.5rem;
  }

  @media (min-width: ${ViewportWidth.s}) {
    padding: 3rem 0;
  }
`

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
`

const ChildrenRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  flex-direction: column;
  align-items: center;

  @media (min-width: ${({ theme }) => theme.viewportWidth.s}) {
    flex-direction: row;
  }
`

export const GovernancePageHeader: FC<Props> = ({ children, title, subtitle, icon, stakedTokenSwitcher }) => {
  return (
    <div>
      <Container>
        <Row>
          {icon && <Icon inverted>{icon}</Icon>}
          <h2>{title}</h2>
          {stakedTokenSwitcher && <StakedTokenSwitcher />}
        </Row>
        {subtitle && <p>{subtitle}</p>}
        {children && <ChildrenRow>{children}</ChildrenRow>}
      </Container>
    </div>
  )
}
