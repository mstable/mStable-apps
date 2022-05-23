import styled from 'styled-components'

import type { FC } from 'react'

import type { DialMetadata } from './types'

const NetworkLabel = styled.div`
  color: ${({ theme }) => theme.color.bodyAccent};
  font-size: 0.875rem;
`

const Title = styled.h3`
  display: flex;
  align-items: center;
`

const Circle = styled.div<{ fill?: string }>`
  content: '';
  display: block;
  min-width: 1rem;
  height: 1rem;
  border-radius: 100%;
  background-color: ${({ fill }) => fill ?? '#ccc'};
`

const Container = styled.div<{ isRow: boolean }>`
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 0.5rem;
  min-height: 1.5rem;

  > div:last-child {
    display: flex;
    gap: ${({ isRow }) => (isRow ? '0.5rem' : '0')};
    flex-direction: ${({ isRow }) => (isRow ? 'row' : 'column')};
    margin-left: 0.5rem;

    h3 {
      margin-bottom: 0;
    }
  }
`

export const DialTitle: FC<{ dialMetadata?: DialMetadata; dialId: number; isRow?: boolean; className?: string }> = ({
  dialMetadata,
  dialId,
  className,
  isRow = true,
}) => (
  <Container isRow={isRow} className={className}>
    <Circle fill={dialMetadata?.color} />
    <div>
      <Title>{dialMetadata?.title ?? `Dial ${dialId}`}</Title>
      {dialMetadata?.network === 'Polygon' && <NetworkLabel>{dialMetadata?.network}</NetworkLabel>}
    </div>
  </Container>
)
