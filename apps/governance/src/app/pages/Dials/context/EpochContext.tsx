import { FC, useEffect } from 'react'
import { createStateContext } from 'react-use'

import { useApolloClients } from '@apps/base/context/apollo'
import { useEpochQuery } from '@apps/artifacts/graphql/emissions'

import { EpochDialVotes, Epoch } from '../types'

const [useEpochData, EpochDataProvider] = createStateContext<Epoch | undefined>(undefined)

const [useEpochWeekNumber, EpochWeekNumberProvider] = createStateContext<number | undefined>(undefined)

const EpochUpdater: FC = () => {
  const clients = useApolloClients()
  const [weekNumber] = useEpochWeekNumber()
  const [, setEpochData] = useEpochData()

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

    const dialVotes: EpochDialVotes = Object.fromEntries(
      epoch.dialVotes.map(({ votes, dial: { dialId, preferences } }) => [
        dialId,
        {
          dialId,
          votes: parseInt(votes) / 1e18,
          preferences: Object.fromEntries(preferences.map(({ voter: { address: voter }, weight }) => [voter, (weight ?? 0) / 2])),
        },
      ]),
    )

    setEpochData({
      emission: parseInt(epoch.emission) / 1e18,
      weekNumber: epoch.weekNumber,
      dialVotes,
    })
  }, [setEpochData, epochQuery.data])

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
