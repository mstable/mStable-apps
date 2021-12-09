import React, { FC } from 'react'
import styled from 'styled-components'

import { DialMetadata } from './types'

const NetworkLabel = styled.div`
  color: ${({ theme }) => theme.color.bodyAccent};
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  background: ${({ theme }) => theme.color.background[0]};
  border-radius: 0.5rem;
  padding: 0 0.5rem;
  font-size: 0.875rem;
`

const Title = styled.h3<{ fill?: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;

  &:before {
    content: '';
    display: block;
    width: 1rem;
    height: 1rem;
    margin-top: -2px;
    border-radius: 100%;
    background-color: ${({ fill }) => fill ?? '#ccc'};
  }
`

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 1.5rem;
`

export const DialTitle: FC<{ dialMetadata?: DialMetadata; className?: string }> = ({ dialMetadata, className }) => (
  <Container className={className}>
    <Title fill={dialMetadata?.color}>{dialMetadata?.title}</Title>
    <NetworkLabel>{dialMetadata?.network}</NetworkLabel>
  </Container>
)
