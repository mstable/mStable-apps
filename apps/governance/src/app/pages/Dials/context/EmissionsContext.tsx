import { FC, useEffect } from 'react'
import { createStateContext } from 'react-use'

import { EmissionsController, EmissionsController__factory } from '@apps/artifacts/typechain'
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

  const accountQuery = useAccountQuery({
    variables: { id: account as string },
    skip: !account,
    client: clients.staking,
    pollInterval: 60e3,
  })

  // Known issue: if the user has a delegatee in multiple staked tokens, this will only select one
  const delegatee = accountQuery.data?.account?.stakedTokenAccounts.find(sta => !!sta.delegatee)?.delegatee

  const delegateeOrAccount = delegatee?.id ?? account
  const emissionsQuery = useEmissionsQuery({
    variables: { account: delegateeOrAccount ?? '', hasAccount: !!delegateeOrAccount },
    client: clients.emissions,
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

    const totalVotes = parseInt(controller.lastEpoch.totalVotes) / 1e18
    const lastEpoch: EmissionsData['lastEpoch'] = {
      totalVotes,
      emission: parseInt(controller.lastEpoch.emission) / 1e18,
      dialVotes: Object.fromEntries(
        // User preferences could be loaded here if needed
        controller.lastEpoch.dialVotes.map(dialVote => {
          const votes = parseInt(dialVote.votes) / 1e18
          const voteShare = parseFloat(((votes / totalVotes) * 100).toFixed(2))
          return [dialVote.dial.dialId, { votes, voteShare, preferences: {} }]
        }),
      ),
      weekNumber: controller.lastEpoch.weekNumber,
    }

    let user: EmissionsUser = {
      address: account,
      isDelegatee: false,
      lastSourcePoke: 0,
      votePower: accountQuery.data?.account?.totalVotesAllBD,
      dialPreferences: {},
    }
    const [voter] = controller.voters ?? []
    if (voter) {
      user = {
        address: voter.address,
        isDelegatee: voter.address !== account,
        lastSourcePoke: voter.lastSourcePoke,
        votePower: accountQuery.data?.account?.totalVotesAllBD,
        dialPreferences: Object.fromEntries(voter.preferences.map(({ dial: { dialId }, weight }) => [dialId, weight / 2])),
      }
    } else if (delegatee) {
      // If the delegatee hasn't voted yet, there won't be a voter, but we can still show a user
      user = {
        address: delegatee.id,
        isDelegatee: true,
        lastSourcePoke: 0,
        votePower: delegatee.totalVotesAllBD,
        dialPreferences: {},
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
  }, [setEmissionsData, emissionsQuery.data, accountQuery.data, account, delegatee])

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
