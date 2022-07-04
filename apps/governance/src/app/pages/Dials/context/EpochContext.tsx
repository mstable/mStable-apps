import { useEffect, useMemo } from 'react'

import { useBlockTimestampQuery } from '@apps/artifacts/graphql/blocks'
import { useSelectedEpochQuery } from '@apps/artifacts/graphql/emissions'
import { useApolloClients } from '@apps/base/context/apollo'
import { createStateContext } from 'react-use'

import { useScaleUserDialPreferences } from '../DialTable'
import { useEmissionsData } from './EmissionsContext'
import { useUserDialPreferences } from './UserDialsContext'
import { useHoveredDialId, useSelectedDialId, useSystemView } from './ViewOptionsContext'

import type { FC } from 'react'

import type { Dial, Epoch, EpochDialVotes } from '../types'

const [useEpochData, EpochDataProvider] = createStateContext<Epoch | undefined>(undefined)

const [useEpochWeekNumber, EpochWeekNumberProvider] = createStateContext<number | undefined>(undefined)

const useBlockNumberForWeekNumber = (): number | undefined => {
  const clients = useApolloClients()
  const [weekNumber] = useEpochWeekNumber()

  // TODO revert
  // const distributionPeriod = 43200
  const distributionPeriod = 604800

  // Get the next week, i.e. the end of this epoch
  const start = (weekNumber + 1) * distributionPeriod

  const blockTimestampQuery = useBlockTimestampQuery({
    client: clients.blocks,
    variables: { start: start.toString(), end: (start + 1000).toString() },
    skip: !weekNumber,
  })

  const blockNumber = blockTimestampQuery.data?.blocks[0]?.number
  return blockNumber ? parseInt(blockNumber) : undefined
}

const EpochUpdater: FC = () => {
  const clients = useApolloClients()
  const [emissionsData] = useEmissionsData()
  const [weekNumber] = useEpochWeekNumber()
  const [, setEpochData] = useEpochData()
  const [, setHoveredDialId] = useHoveredDialId()
  const [, setSelectedDialId] = useSelectedDialId()

  // TODO pagination
  const skip = 0

  const blockNumber = useBlockNumberForWeekNumber()

  const selectedEpochQuery = useSelectedEpochQuery({
    variables: {
      weekNumber: weekNumber ?? 0,
      blockNumber: blockNumber ?? 0,
      isSelectedEpoch: !!weekNumber && !!blockNumber && weekNumber !== emissionsData?.lastEpochWeekNumber,
      skip,
    },
    client: clients.emissions,
    pollInterval: 60e3,
  })

  useEffect(() => {
    if (!selectedEpochQuery.data || (!selectedEpochQuery.data.selectedEpoch?.[0] && !selectedEpochQuery.data.lastEpoch?.[0])) {
      setEpochData(undefined)
      return
    }

    const epoch = selectedEpochQuery.data.selectedEpoch?.[0] ?? selectedEpochQuery.data.lastEpoch?.[0]
    if (!epoch) {
      setEpochData(undefined)
      return
    }

    const totalVotes = parseInt(epoch.totalVotes) / 1e18

    const dialVotes: EpochDialVotes = Object.fromEntries(
      epoch.dialVotes.map(({ votes: votes_, dial: { dialId, preferences } }) => {
        const votes = parseInt(votes_) / 1e18
        return [
          dialId,
          {
            dialId,
            votes,
            voteShare: parseFloat(((votes / totalVotes) * 100).toFixed(2)),
            preferences: Object.fromEntries(
              preferences.map(preference => {
                const weight = parseInt(preference.weight ?? '0') / 2
                const votesCast = parseInt(preference.voter.votesCast) / 1e18
                return [preference.voter.address, { weight, votesCast }]
              }),
            ),
          },
        ]
      }),
    )

    setEpochData({
      emission: parseInt(epoch.emission) / 1e18,
      weekNumber: epoch.weekNumber,
      totalVotes,
      dialVotes,
    })
  }, [setEpochData, selectedEpochQuery.data])

  useEffect(() => {
    setHoveredDialId(undefined)
    setSelectedDialId(undefined)
  }, [setHoveredDialId, setSelectedDialId, weekNumber])

  return null
}

const EpochContext: FC = ({ children }) => (
  <EpochWeekNumberProvider>
    <EpochDataProvider>
      {children}
      <EpochUpdater />
    </EpochDataProvider>
  </EpochWeekNumberProvider>
)

export { EpochContext, useEpochData, useEpochWeekNumber }

export const useDisabledDialsWithVotes = () => {
  const [epochData] = useEpochData()
  const [emissionsData] = useEmissionsData()
  const [epochWeekNumber = emissionsData?.lastEpochWeekNumber] = useEpochWeekNumber()
  const [isSystemView] = useSystemView()
  const [userDialPreferences] = useUserDialPreferences()
  const scaledUserDialPreferences = useScaleUserDialPreferences(userDialPreferences)

  return useMemo(() => {
    const disabledDials: Dial[] = []
    const isPreviousEpoch = epochWeekNumber !== emissionsData?.lastEpochWeekNumber

    if (epochData?.dialVotes && emissionsData?.dials) {
      for (const dialId in epochData.dialVotes) {
        const dial = emissionsData?.dials[dialId]
        if (!isPreviousEpoch && dial.disabled && !isSystemView && scaledUserDialPreferences.scaled[dialId] > 0) {
          disabledDials.push(dial)
        }
      }
    }

    return disabledDials
  }, [
    emissionsData?.dials,
    emissionsData?.lastEpochWeekNumber,
    epochData?.dialVotes,
    epochWeekNumber,
    isSystemView,
    scaledUserDialPreferences?.scaled,
  ])
}
