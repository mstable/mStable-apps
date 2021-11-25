import React, { FC } from 'react'
import styled from 'styled-components'

interface Props {
  className?: string
  subtitle?: string
  title?: string
  highlight?: boolean
  dashed?: boolean
}

const Container = styled.div<{ highlight: boolean; dashed: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  border: 1px
    ${({ dashed, theme, highlight }) =>
      `${dashed ? 'dashed' : 'solid'} ${
        dashed ? theme.color.dashedBorder : highlight ? theme.color.yellowBorder : theme.color.defaultBorder
      }`};
  border-radius: 1rem;
  padding: 1rem;
  color: ${({ theme, highlight }) => (highlight ? theme.color.offYellow : theme.color.bodyAccent)};

  h4 {
    font-size: 0.875rem;
    font-weight: ${({ highlight }) => (highlight ? 600 : 400)};
  }

  h3 {
    color: ${({ theme }) => theme.color.body};
    font-weight: 500;
    font-size: 1.25rem;
  }

  p {
    line-height: 1.4em;
    font-size: 0.875rem;
  }

  button {
    height: 2.5rem;
  }
`

export const InfoBox: FC<Props> = ({ className, title, subtitle, highlight = false, dashed = true, children }) => (
  <Container className={className} highlight={highlight} dashed={dashed}>
    {subtitle && <h4>{subtitle}</h4>}
    {title && <h3>{title}</h3>}
    {children}
  </Container>
)
