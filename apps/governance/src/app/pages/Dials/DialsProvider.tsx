import React, { FC, createContext, useMemo, useContext, useRef, useEffect } from 'react'
import { useEmissionsLazyQuery, useEmissionsQuery } from '@apps/artifacts/graphql/emissions'
import { useApolloClients } from '@apps/base/context/apollo'
import { useAccount, useSigner } from '@apps/base/context/account'
import { truncateAddress } from '@apps/formatters'
import { EmissionsController, EmissionsController__factory } from '@apps/artifacts/typechain'

interface State {
  data?: {
    dials: {
      key: string
      title: string
      value: number
      id: number
    }[]
    userDials: Record<string, number>
    emission: number
    currentEpoch: number
  }
}

const MOCK_DATA = {
  data: {
    dials: [
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
    currentEpoch: 1637768286000,
  },
}

const contractCtx = createContext<EmissionsController | undefined>(null as never)
const stateCtx = createContext<State>(MOCK_DATA)

export const useEmissionDialsContract = (): EmissionsController | undefined => useContext(contractCtx)
export const useEmissionDialsState = (): State => useContext(stateCtx)

const MAPPING = [
  { title: 'ABC', key: 'p-abc' },
  { title: 'DEF', key: 'mta' },
  { title: 'GHI', key: 'abc' },
]

export const DialsProvider: FC = ({ children }) => {
  const clients = useApolloClients()
  const account = useAccount()
  const signer = useSigner()

  const emissions = useMemo<Parameters<typeof useEmissionsLazyQuery>[0]>(() => {
    return {
      client: clients.emissions,
      variables: { userId: account ?? '' },
      pollInterval: 60e3,
    }
  }, [account, clients.emissions])

  const { data, loading } = useEmissionsQuery(emissions)

  const dialsContract = useRef<EmissionsController | undefined>(undefined)

  const controller = data?.emissionsControllers?.[0]

  const voters = data?.voters?.[0]

  const dials = controller?.dials?.map((v, i) => ({
    title: MAPPING[v.dialId]?.title ?? truncateAddress(v.recipient),
    value: (v.preferences?.[0]?.weight ?? 0) / 2,
    id: i,
    key: MAPPING[v.dialId]?.key,
  }))

  const userDials: Record<string, number> = voters?.preferences
    ?.map(v => ({ [MAPPING[v.dial.dialId].key]: (v.weight ?? 0) / 2 }))
    .reduce((a, b) => ({ ...a, ...b }))

  const finalData = useMemo(
    () =>
      !loading
        ? {
            ...MOCK_DATA,
            data: {
              ...MOCK_DATA.data,
              dials,
              userDials,
            },
          }
        : MOCK_DATA,
    [dials, userDials, loading],
  )

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
