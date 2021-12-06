import { FC, useEffect } from 'react'
import { createStateContext } from 'react-use'

import { EmissionsController, EmissionsController__factory } from '@apps/artifacts/typechain'
import { BigDecimal } from '@apps/bigdecimal'
import { useAccount, useSigner } from '@apps/base/context/account'
import { useApolloClients } from '@apps/base/context/apollo'
import { useEmissionsQuery } from '@apps/artifacts/graphql/emissions'
import { useAccountQuery } from '@apps/artifacts/graphql/staking'

import { DIALS_METADATA } from '../constants'
import { Dial, EmissionsData, EmissionsUser } from '../types'

const [useEmissionsData, EmissionsDataProvider] = createStateContext<EmissionsData | undefined>(undefined)

const EmissionsDataUpdater: FC = () => {
  const clients = useApolloClients()
  const account = useAccount()
  const [, setEmissionsData] = useEmissionsData()

  const emissionsQuery = useEmissionsQuery({
    variables: { account: account ?? '', hasAccount: !!account },
    client: clients.emissions,
    pollInterval: 60e3,
  })

  const accountQuery = useAccountQuery({
    variables: { id: account as string },
    skip: !account,
    client: clients.staking,
    pollInterval: 60e3,
  })

  useEffect(() => {
    if (!emissionsQuery.data?.emissionsControllers[0]) {
      setEmissionsData(undefined)
      return
    }

    const [controller] = emissionsQuery.data.emissionsControllers

    const dials: EmissionsData['dials'] = Object.fromEntries(
      controller.dials.map<[number, Dial]>(dial => {
        const { dialId, recipient } = dial

        const votes = parseInt(controller.lastEpoch.dialVotes.find(dialVote => dialVote.dial.id === dial.id)?.votes ?? '0') / 1e18
        const balance = parseInt(dial.balance) / 1e18

        return [dialId, { dialId, votes, recipient, balance, metadata: DIALS_METADATA[dialId] }]
      }),
    )

    const lastEpoch: EmissionsData['lastEpoch'] = {
      emission: parseInt(controller.lastEpoch.emission) / 1e18,
      dialVotes: Object.fromEntries(
        // User preferences could be loaded here if needed
        controller.lastEpoch.dialVotes.map(dialVote => [dialVote.dial.dialId, { votes: parseInt(dialVote.votes) / 1e18, preferences: {} }]),
      ),
      weekNumber: controller.lastEpoch.weekNumber,
    }

    let user: EmissionsUser | undefined = undefined
    const [voter] = controller.voters ?? []
    if (voter) {
      user = {
        lastSourcePoke: voter.lastSourcePoke,
        votePower: BigDecimal.parse(accountQuery.data?.account?.totalVotesAll ?? '0'),
        dialPreferences: Object.fromEntries(voter.preferences.map(({ dial: { dialId }, weight }) => [dialId, weight / 2])),
      }
    }

    const emissionsData = {
      address: controller.id,
      dials,
      lastEpoch,
      startEpochWeekNumber: controller.startEpoch.weekNumber,
      lastEpochWeekNumber: controller.lastEpoch.weekNumber,
      user,
    }
    setEmissionsData(emissionsData)
  }, [setEmissionsData, emissionsQuery.data, accountQuery.data])

  return null
}

const [useEmissionsController, EmissionsControllerProvider] = createStateContext<EmissionsController | undefined>(undefined)

const EmissionsControllerUpdater: FC = () => {
  const signer = useSigner()

  const [, setEmissionsController] = useEmissionsController()
  const [emissionsData] = useEmissionsData()

  const address = emissionsData?.address
  useEffect(() => {
    setEmissionsController(address && signer ? EmissionsController__factory.connect(address, signer) : undefined)
  }, [signer, address, setEmissionsController])

  return null
}

const EmissionsContext: FC = ({ children }) => (
  <EmissionsDataProvider>
    <EmissionsControllerProvider>
      {children}
      <EmissionsControllerUpdater />
      <EmissionsDataUpdater />
    </EmissionsControllerProvider>
  </EmissionsDataProvider>
)

export { EmissionsContext, useEmissionsData, useEmissionsController }
