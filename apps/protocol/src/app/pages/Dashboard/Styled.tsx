import { Table, TableCell, TableRow } from '@apps/dumb-components'
import styled from 'styled-components'

export const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 500;
  margin-bottom: 1rem;
  position: absolute;
`

export const Card = styled.div`
  display: flex;
`

export const Panel = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;

  > *:not(:last-child) {
    margin-bottom: 1rem;
  }
`

export const DashTable = styled(Table).attrs(() => ({ widths: [25, 25, 25, 25] }))`
  img {
    width: 2rem;
  }

  tr:not(:first-child):nth-child(even) {
    background: ${({ theme }) => theme.color.backgroundTransparent};
  }

  tr:not(:first-child):hover {
    background: ${({ theme }) => theme.color.background[1]};
  }
`

export const DashTableRow = styled(TableRow)`
  height: 76px;
`

export const DashTableCell = styled(TableCell)<{ hasRewards?: boolean }>`
  display: flex;
  align-items: center;
  width: 25%;
  padding: 0.75rem 1rem;
  position: relative;

  &:before {
    position: absolute;
    content: '';
    width: 0.5rem;
    height: 0.5rem;
    background: ${({ theme }) => theme.color.gold};
    right: -0.5rem;
    top: calc(50% - 0.25rem);
    display: ${({ hasRewards }) => (hasRewards ? 'inherit' : 'none')};
    border-radius: 0.25rem;
  }
`

export const DashNameTableCell = styled(DashTableCell)`
  font-weight: 600;

  > :first-child {
    margin-right: 0.5rem;
  }
`

export const RewardsApy = styled.div<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  font-size: 0.875rem;
  margin: 0.25rem 0;

  span {
    margin-top: 1px;
    color: ${({ theme, active }) => (active && theme.color.green) || theme.color.bodyAccent};
  }

  div:last-child {
    margin-left: 0.25rem;
    height: 1.25rem;
    width: 1.25rem;
    min-width: inherit;
    min-height: inherit;
  }
`

export const DeprecatedLabel = styled.span`
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: bold;
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  color: ${({ theme }) => theme.color.bodyAccent};
  padding: 0.25rem 0.5rem;
  align-self: center;
`
