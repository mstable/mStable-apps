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

export const DashTableRow = styled(TableRow)``

export const DashTableCell = styled(TableCell)`
  display: flex;
  align-items: center;
  width: 25%;
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

  span {
    margin-top: 1px;
    color: ${({ theme, active }) => active && theme.color.green};
  }

  div:last-child {
    margin-left: 0.25rem;
    height: 1.25rem;
    width: 1.25rem;
    min-width: inherit;
    min-height: inherit;
  }
`
