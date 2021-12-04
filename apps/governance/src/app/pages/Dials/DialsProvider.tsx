import React, { FC, createContext, useMemo, useContext, useRef, useEffect } from 'react'
import { useEmissionsQuery } from '@apps/artifacts/graphql/emissions'
import { useApolloClients } from '@apps/base/context/apollo'
import { useAccount, useSigner } from '@apps/base/context/account'
import { truncateAddress } from '@apps/formatters'
import { EmissionsController, EmissionsController__factory } from '@apps/artifacts/typechain'
import { useAccountQuery } from '@apps/artifacts/graphql/staking'
import { BigDecimal } from '@apps/bigdecimal'
import { mapIdToDial } from './utils'

interface State {
  data?: {
    dials: Record<
      number,
      {
        key: string
        title: string
        value: number
        id: number
      }[]
    >
    userVotePower?: BigDecimal
    userDials: Record<string, number>
    emission: number
    currentEpochId: number
    epochs: Record<number, Record<number, number>>
  }
}

const MOCK_DATA = {
  data: {
    dials: {
      100: [
        {
          title: 'imUSD Vault',
          value: 30,
          id: 0,
          key: 'p-imusd',
        },
        {
          title: 'MTA Stakers',
          id: 1,
          value: 25,
          key: 'stk-mta',
        },
        {
          title: 'mBPT Stakers',
          id: 2,
          value: 10,
          key: 'stk-bpt',
        },
        {
          title: 'OlympusPro Bonds',
          id: 3,
          value: 5,
          key: 'olympus-bonds',
        },
        {
          title: 'RAI Pool',
          id: 4,
          value: 10,
          key: 'f-rai',
        },
        {
          title: 'alUSD Pool',
          id: 5,
          value: 10,
          key: 'f-alusd',
        },
        {
          title: 'FEI Pool',
          id: 6,
          value: 10,
          key: 'f-fei',
        },
      ],
    },
    userDials: {
      'p-imusd': 7,
      'stk-mta': 30,
      'stk-bpt': 15,
      'olympus-bonds': 5,
      'f-rai': 10,
      'f-alusd': 23,
      'f-fei': 10,
    },
    emission: 50000,
    currentEpochId: 12320,
    epochs: {
      12320: {
        0: 100,
      },
    },
  },
}

const contractCtx = createContext<EmissionsController | undefined>(null as never)
const stateCtx = createContext<State>(MOCK_DATA)

export const useEmissionDialsContract = (): EmissionsController | undefined => useContext(contractCtx)
export const useEmissionDialsState = (): State => useContext(stateCtx)

export const DialsProvider: FC = ({ children }) => {
  const clients = useApolloClients()
  const account = useAccount()
  const signer = useSigner()

  const options = useMemo<{
    emissions: Parameters<typeof useEmissionsQuery>[0]
    staking: Parameters<typeof useAccountQuery>[0]
  }>(() => {
    return {
      emissions: {
        client: clients.emissions,
        variables: { account: account ?? '', hasAccount: !!account },
        pollInterval: 60e3,
      },
      staking: {
        client: clients.staking,
        variables: { id: account ?? '', skip: !account },
        pollInterval: 60e3,
      },
    }
  }, [account, clients])

  const { data: stakingData } = useAccountQuery(options.staking)

  const { data: emissionsData } = useEmissionsQuery(options.emissions)

  const dialsContract = useRef<EmissionsController | undefined>(undefined)

  const controller = emissionsData?.emissionsControllers?.[0]

  const voters = emissionsData?.voters?.[0]

  const userVotePower = stakingData?.account?.totalVotesAllBD

  const finalData = useMemo(() => {
    if (!controller) {
      return {
        data: {
          dials: { 100: [] },
          userDials: {},
          emission: 0,
          currentEpochId: 0,
          epochs: [],
        },
      }
    }

    const epochs = controller.epochs
      ?.map(v => ({
        [v.weekNumber]: v.dialVotes?.map(x => ({ [x.dial.dialId]: parseFloat(x.votes) / 1e18 }))?.reduce((a, b) => ({ ...a, ...b })),
      }))
      .reduce((a, b) => ({ ...a, ...b }))

    const dials = Object.keys(epochs)
      .map(epochId => ({
        [epochId]: Object.keys(epochs[epochId]).map(dialId => ({
          title: mapIdToDial(parseInt(dialId))?.title,
          value: epochs[epochId][dialId] ?? 0,
          id: parseInt(dialId),
          key: mapIdToDial(parseInt(dialId))?.key,
        })),
      }))
      .reduce((a, b) => ({ ...a, ...b }))

    const userDials = Object.fromEntries(
      (voters?.preferences ?? []).map(({ dial, weight }) => [
        mapIdToDial(dial.dialId)?.key ?? truncateAddress(dial.recipient),
        (weight ?? 0) / 2,
      ]),
    )

    const emission = parseFloat(controller.epochs[0]?.emission)

    const currentEpochId = controller.epochs[controller.epochs.length - 1]?.weekNumber

    return {
      data: {
        dials,
        userDials,
        userVotePower,
        emission,
        currentEpochId,
        epochs,
      },
    }
  }, [controller, voters, userVotePower])

  useEffect(() => {
    if (!controller?.id) return
    dialsContract.current = EmissionsController__factory.connect(controller.id, signer)
  }, [signer, controller])

  return (
    <contractCtx.Provider value={dialsContract.current}>
      <stateCtx.Provider value={finalData}>{children}</stateCtx.Provider>
    </contractCtx.Provider>
  )
}
