import React, { FC, useMemo } from 'react'
import styled from 'styled-components'

import { Table, TableCell, TableRow } from '@apps/dumb-components'

import { useEpochData } from './context/EpochContext'
import { useSelectedDialId } from './context/ViewOptionsContext'
import { MiniDelegateeProfile } from './DialDelegatee'

const useDialPreferencesData = (): [string, number, number][] => {
  const [epochData] = useEpochData()
  const [selectedDialId] = useSelectedDialId()
  const selectedDial = epochData?.dialVotes[selectedDialId]

  return useMemo(() => {
    if (!selectedDial) return []

    const totalVotes = Object.values(selectedDial.preferences).reduce((prev, preference) => prev + preference.votesCast, 0)

    const entries: [string, number, number][] = Object.entries(selectedDial.preferences).map(([voterAddress, preference]) => [
      voterAddress,
      (preference.votesCast / totalVotes) * 100,
      preference.weight,
    ])

    return entries.sort((a, b) => b[1] - a[1])
  }, [selectedDial])
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

const TABLE_CELL_WIDTHS = [40, 30, 30]
const HEADER_TITLES = ['User', 'Vote share', 'Weight'].map(title => ({ title }))

export const DialPreferencesTable: FC = () => {
  const dialPreferencesData = useDialPreferencesData()

  return (
    <Table headerTitles={HEADER_TITLES} widths={TABLE_CELL_WIDTHS}>
      {dialPreferencesData.map(([voterAddress, voteShare, weight]) => (
        <TableRow key={voterAddress}>
          <TableCell width={TABLE_CELL_WIDTHS[0]}>
            <StyledMiniDelegateeProfile address={voterAddress} />
          </TableCell>
          <TableCell width={TABLE_CELL_WIDTHS[1]}>
            <span>{voteShare.toFixed(2)}%</span>
          </TableCell>
          <TableCell width={TABLE_CELL_WIDTHS[1]}>
            <span>{weight}%</span>
          </TableCell>
        </TableRow>
      ))}
    </Table>
  )
}
