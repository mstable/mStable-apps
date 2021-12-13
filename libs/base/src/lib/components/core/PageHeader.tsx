import React, { FC } from 'react'
import styled from 'styled-components'

import { ViewportWidth } from '@apps/theme'
import { BackLink } from '@apps/dumb-components'

interface Props {
  title: string
  subtitle?: string
  switcher?: JSX.Element
  backTo?: string
  backTitle?: string
}

const StyledBackLink = styled(BackLink)`
  position: absolute;
  left: 0;
  top: 2rem;

  @media (min-width: ${({ theme }) => theme.viewportWidth.s}) {
    top: 2.5rem;
  }
`

const Row = styled.div<{ hasBackLink?: boolean }>`
  display: flex;
  align-items: center;

  margin-top: ${({ hasBackLink }) => hasBackLink && `2.5rem`};

  > *:first-child:not(:last-child) {
    margin-right: 1rem;
  }

  @media (min-width: ${({ theme }) => theme.viewportWidth.s}) {
    margin-top: ${({ hasBackLink }) => hasBackLink && `1rem`};
  }
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

const Container = styled.div<{
  messageVisible?: boolean
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 2rem 0;

  h2 {
    font-size: 1.75rem;
    font-weight: 500;
  }

  p {
    padding: 0.25rem 0 0;
    font-size: 0.875rem;
    text-align: center;
    line-height: 1.25rem;
    color: ${({ theme }) => theme.color.bodyAccent};
  }

  > *:not(:last-child) {
    margin-bottom: 0.5rem;
  }

  @media (min-width: ${ViewportWidth.s}) {
    padding: 2rem 0;
  }
`

export const PageHeader: FC<Props> = ({ children, title, subtitle, switcher, backTo, backTitle }) => {
  return (
    <Container>
      <StyledBackLink to={backTo} title={backTitle} />
      <Row hasBackLink={!!backTo}>
        <h2>{title}</h2>
        {switcher && switcher}
      </Row>
      <div>
        {subtitle && <p>{subtitle}</p>}
        {children && <ChildrenRow>{children}</ChildrenRow>}
      </div>
    </Container>
  )
}
