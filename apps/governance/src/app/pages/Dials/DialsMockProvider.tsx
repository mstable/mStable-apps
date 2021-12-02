import React, { FC, createContext, useMemo, useContext } from 'react'
import { useEmissionsLazyQuery, useEmissionsQuery } from '@apps/artifacts/graphql/emissions'
import { useApolloClients } from '@apps/base/context/apollo'
import { useAccount } from '@apps/base/context/account'

interface State {
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

const MOCK_DATA = {
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
  emission: 100000,
  currentEpoch: 1637768286000,
}

const stateCtx = createContext<State>(MOCK_DATA)

export const useMockDialsState = (): State => useContext(stateCtx)

export const DialsMockProvider: FC = ({ children }) => {
  const clients = useApolloClients()
  const account = useAccount()

  const emissions = useMemo<Parameters<typeof useEmissionsLazyQuery>[0]>(() => {
    return {
      // variables: { userId: account ?? '', hasUser: !!account },
      client: clients.emissions,
      pollInterval: 60e3,
    }
  }, [clients])

  const { data } = useEmissionsQuery(emissions)

  console.log(data)

  return <stateCtx.Provider value={useMemo(() => MOCK_DATA, [])}>{children}</stateCtx.Provider>
}
