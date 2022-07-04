import { Slider, Table, TableCell, TableRow, ThemedSkeleton, Tooltip } from '@apps/dumb-components'
import { createMemo } from 'react-use'
import styled from 'styled-components'

import { ALL_POSSIBLE_DIAL_IDS } from './constants'
import { useEmissionsData } from './context/EmissionsContext'
import { useEpochData, useEpochWeekNumber } from './context/EpochContext'
import { useUserDialPreferences } from './context/UserDialsContext'
import { useSystemView } from './context/ViewOptionsContext'
import { DialTitle } from './DialTitle'

import type { FC } from 'react'

import type { EmissionsData, UserDialPreferences } from './types'

export const useScaleUserDialPreferences = createMemo(
  ({
    current,
    changes,
  }: {
    current: UserDialPreferences
    changes: UserDialPreferences
  }): { scaled: UserDialPreferences; pending: UserDialPreferences } => {
    // Combine changes and current dial preferences
    const pending = Object.fromEntries(
      ALL_POSSIBLE_DIAL_IDS.filter(dialId => changes[dialId] ?? current[dialId]).map(dialId => [
        dialId,
        changes[dialId] ?? current[dialId] ?? 0,
      ]),
    )

    // Since weights might not total 100, get a multiplier to scale them
    const totalWeight = Object.values(pending).reduce((a, b) => a + b, 0)
    const weightMultiplier = totalWeight > 0 ? 100 / totalWeight : 1

    const dialIds = Object.keys(pending)
    const scaledWeights = dialIds.map(dialId => pending[dialId] * weightMultiplier)

    let scaled = Object.fromEntries(dialIds.map((dialId, idx) => [dialId, scaledWeights[idx]]))

    if (totalWeight === 0) return { pending, scaled }

    // The remainder gets added to the highest value
    const remainder = 100 - scaledWeights.reduce((prev, weight) => prev + weight, 0)
    if (remainder > 0) {
      const maxValue = Math.max(...scaledWeights)

      scaled = Object.fromEntries(
        dialIds.map((dialId, idx) => {
          const weight = scaledWeights[idx]
          return [dialId, weight === maxValue ? weight + remainder : weight]
        }),
      )
    }

    return { scaled, pending }
  },
)

const StyledSlider = styled(Slider)`
  height: 1rem;
`

const StyledSkeleton = styled(ThemedSkeleton)`
  width: 100%;
  border-radius: 1rem;
  > div {
    width: 100%;
    line-height: 0;
  }
`

const StyledLoadingRow = styled(TableRow)`
  width: 100%;
  padding: 0;
  > * {
    padding: 0;
    width: 100%;
  }
`
const LoadingRow: FC = () => (
  <StyledLoadingRow>
    <TableCell>
      <StyledSkeleton height={100} />
    </TableCell>
  </StyledLoadingRow>
)

const TABLE_CELL_WIDTHS = [30, 10, 10, 35]
const DEFAULT_HEADER_TITLES = ['Dial', '', 'User weight', ''].map(title => ({ title }))
const SYSTEM_VIEW_HEADER_TITLES = ['Dial', '', 'System weight', ''].map(title => ({ title }))

const roundUserWeight = (weight: number): number => {
  const [whole, decimal] = weight.toFixed(1).split('.')
  return parseFloat(`${whole}.${parseInt(decimal) >= 5 ? '5' : '0'}`)
}

const StyledTableRow = styled(TableRow)<{ disabled: boolean }>`
  background-color: ${({ disabled, theme }) => (disabled ? theme.color.backgroundTransparent : theme.color.background)};
`

const DisabledLabel = styled.span<{ warning?: boolean }>`
  text-transform: uppercase;
  font-size: 0.75rem;
  font-weight: bold;
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  color: ${({ theme, warning }) => (warning ? theme.color.red : theme.color.bodyAccent)};
  padding: 0.25rem 0.5rem;
`

const NumericCell = styled(TableCell)`
  font-family: 'DM Mono', monospace !important;
  text-align: right;
`

const sortDisabledLast = (emissionsData: EmissionsData) => (a, b) => {
  try {
    const dialA = emissionsData.dials[parseInt(a[0])]
    const dialB = emissionsData.dials[parseInt(b[0])]

    return dialA.disabled && !dialB.disabled ? 1 : !dialA.disabled && dialB.disabled ? -1 : 0
  } catch {
    return 0
  }
}

export const DialTable: FC = () => {
  const [emissionsData] = useEmissionsData()
  const [epochData] = useEpochData()
  const [isSystemView] = useSystemView()
  const [epochWeekNumber = emissionsData?.lastEpochWeekNumber] = useEpochWeekNumber()
  const [userDialPreferences, dispatchUserDialPreferences] = useUserDialPreferences()
  const scaledUserDialPreferences = useScaleUserDialPreferences(userDialPreferences)

  const isDelegating = emissionsData?.user?.isDelegatee
  const isPreviousEpoch = epochWeekNumber !== emissionsData?.lastEpochWeekNumber

  return (
    <Table headerTitles={isSystemView ? SYSTEM_VIEW_HEADER_TITLES : DEFAULT_HEADER_TITLES} widths={TABLE_CELL_WIDTHS}>
      {!(epochData && epochData.dialVotes && emissionsData) ? (
        <LoadingRow />
      ) : (
        Object.entries(epochData.dialVotes)
          .sort(sortDisabledLast(emissionsData))
          .map(([dialId_, { voteShare }]) => {
            const dialId = parseInt(dialId_)

            const dial = emissionsData.dials[dialId]

            if (!dial) return <LoadingRow key={dialId} />

            const warning = !isPreviousEpoch && dial.disabled && roundUserWeight(scaledUserDialPreferences.scaled[dialId] ?? 0) > 0

            return (
              <StyledTableRow key={dialId} disabled={dial.disabled}>
                <TableCell width={TABLE_CELL_WIDTHS[0]}>
                  <Tooltip tip={dial.metadata?.description} hideIcon>
                    <DialTitle isRow={false} dialMetadata={dial?.metadata} dialId={dialId} />
                  </Tooltip>
                </TableCell>
                <TableCell width={TABLE_CELL_WIDTHS[1]}>
                  {dial.disabled && <DisabledLabel warning={warning}>Disabled</DisabledLabel>}
                </TableCell>
                <NumericCell width={TABLE_CELL_WIDTHS[2]}>
                  {isSystemView && voteShare && dial.cap && voteShare > dial.cap ? (
                    <Tooltip tip={`This dial is capped at ${dial.cap.toFixed(1)}% maximum`}>{dial.cap.toFixed(1)}%</Tooltip>
                  ) : isSystemView ? (
                    `${voteShare.toFixed(1)}%`
                  ) : (
                    `${roundUserWeight(scaledUserDialPreferences.scaled[dialId] ?? 0).toFixed(1)}%`
                  )}
                </NumericCell>
                <TableCell width={TABLE_CELL_WIDTHS[3]}>
                  <StyledSlider
                    intervals={0}
                    min={0}
                    max={100}
                    step={1}
                    value={isSystemView ? voteShare : scaledUserDialPreferences.pending[dialId] ?? 0}
                    disabled={isSystemView || isDelegating || isPreviousEpoch || dial.disabled}
                    onChange={value => {
                      dispatchUserDialPreferences({ type: 'SET_DIAL', payload: { dialId, value } })
                    }}
                  />
                </TableCell>
              </StyledTableRow>
            )
          })
      )}
    </Table>
  )
}
