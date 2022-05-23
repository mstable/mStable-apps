import { useMemo } from 'react'

import { Table, TableCell, TableRow } from '@apps/dumb-components'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { useActiveDial } from './context/ViewOptionsContext'
import { MiniDelegateeProfile } from './DialDelegatee'

import type { FC } from 'react'

const useDialPreferencesData = (): [string, number, number][] => {
  const activeDial = useActiveDial()

  return useMemo(() => {
    if (!activeDial) return []

    const entries: [string, number, number][] = Object.entries(activeDial.dialVotes.preferences).map(([voterAddress, preference]) => [
      voterAddress,
      preference.votesCast,
      preference.weight,
    ])

    return entries.sort((a, b) => b[1] - a[1])
  }, [activeDial])
}

const StyledMiniDelegateeProfile = styled(MiniDelegateeProfile)`
  > :first-child {
    > :first-child {
      align-items: center;
      justify-content: center;
      width: 1.5rem;
      height: 1.5rem;

      img,
      svg {
        width: 100%;
        height: auto;
      }
    }

    > :last-child {
      min-height: 1.5rem;
    }
  }
`

const StyledTable = styled(Table)`
  margin-top: 1rem;
`

const TABLE_CELL_WIDTHS = [50, 50]
const HEADER_TITLES = ['User', 'Weight'].map(title => ({ title }))

export const DialPreferencesTable: FC = () => {
  const dialPreferencesData = useDialPreferencesData()
  const history = useHistory()

  const handleRowClick = (id: string) => history.push(`/vote/${id}`)

  return dialPreferencesData.length ? (
    <StyledTable headerTitles={HEADER_TITLES} widths={TABLE_CELL_WIDTHS}>
      {dialPreferencesData.map(([voterAddress, , weight]) => (
        <TableRow key={voterAddress} onClick={() => handleRowClick(voterAddress)} buttonTitle="View profile">
          <TableCell width={TABLE_CELL_WIDTHS[0]}>
            <StyledMiniDelegateeProfile address={voterAddress} />
          </TableCell>
          <TableCell width={TABLE_CELL_WIDTHS[1]}>
            <span>{weight === 100 ? `🦍 ${weight}` : `${weight}`}%</span>
          </TableCell>
        </TableRow>
      ))}
    </StyledTable>
  ) : null
}
