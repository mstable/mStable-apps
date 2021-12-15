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
