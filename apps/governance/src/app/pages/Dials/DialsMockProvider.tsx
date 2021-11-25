import React, { FC, createContext, useMemo, useContext } from 'react'

interface State {
  dials: {
    key: string
    title: string
    value: number
    userValue: number
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
      userValue: 40,
      key: 'p-imusd',
    },
    {
      title: 'MTA Stakers',
      value: 25,
      userValue: 30,
      key: 'stk-mta',
    },
    {
      title: 'mBPT Stakers',
      value: 10,
      userValue: 15,
      key: 'stk-bpt',
    },
    {
      title: 'OlympusPro Bonds',
      value: 5,
      userValue: 5,
      key: 'olympus-bonds',
    },
    {
      title: 'RAI Pool',
      value: 10,
      userValue: 10,
      key: 'f-rai',
    },
    {
      title: 'alUSD Pool',
      value: 10,
      userValue: 10,
      key: 'f-alusd',
    },
    {
      title: 'FEI Pool',
      value: 10,
      userValue: 10,
      key: 'f-fei',
    },
  ],
  userDials: {
    'p-imusd': 40,
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
  return <stateCtx.Provider value={useMemo(() => MOCK_DATA, [])}>{children}</stateCtx.Provider>
}
