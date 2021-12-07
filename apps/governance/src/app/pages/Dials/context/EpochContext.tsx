import { FC, useEffect } from 'react'
import { createStateContext } from 'react-use'

import { useApolloClients } from '@apps/base/context/apollo'
import { useEpochQuery } from '@apps/artifacts/graphql/emissions'

import { EpochDialVotes, Epoch } from '../types'
import { useHoveredDialId, useSelectedDialId } from './ViewOptionsContext'

const [useEpochData, EpochDataProvider] = createStateContext<Epoch | undefined>(undefined)

const [useEpochWeekNumber, EpochWeekNumberProvider] = createStateContext<number | undefined>(undefined)

const EpochUpdater: FC = () => {
  const clients = useApolloClients()
  const [weekNumber] = useEpochWeekNumber()
  const [, setEpochData] = useEpochData()
  const [, setHoveredDialId] = useHoveredDialId()
  const [, setSelectedDialId] = useSelectedDialId()

  // TODO pagination
  const skip = 0

  const epochQuery = useEpochQuery({
    variables: { weekNumber: weekNumber ?? 0, hasWeekNumber: !!weekNumber, skip },
    client: clients.emissions,
    pollInterval: 60e3,
  })

  useEffect(() => {
    if (!epochQuery.data || (!epochQuery.data.selectedEpoch?.[0] && !epochQuery.data.lastEpoch?.[0])) {
      setEpochData(undefined)
      return
    }

    const epoch = epochQuery.data.selectedEpoch?.[0] ?? epochQuery.data.lastEpoch?.[0]
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
                const weight = (preference.weight ?? 0) / 2
                const votesCast = parseInt(preference.voter.votesCast) / 1e18
                // if (preference.id.includes('0x91A0D548E3b233A2e850C5C7A42BE97d6E48f0d0'.toLowerCase()))
                //   console.log(preference.id, votesCast)
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
  }, [setEpochData, epochQuery.data])

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
