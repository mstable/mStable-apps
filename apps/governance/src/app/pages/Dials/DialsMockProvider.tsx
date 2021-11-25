import React, { FC, createContext, useMemo, useContext } from 'react'

interface State {
  dials: {
    title: string
    value: number
    key: string
  }[]
  emission: number
  currentEpoch: number
}

const MOCK_DATA = {
  dials: [
    {
      title: 'imUSD Vault',
      value: 30,
      key: 'p-imusd',
    },
    {
      title: 'MTA Stakers',
      value: 25,
      key: 'stk-mta',
    },
    {
      title: 'mBPT Stakers',
      value: 10,
      key: 'stk-bpt',
    },
    {
      title: 'OlympusPro Bonds',
      value: 5,
      key: 'olympus',
    },
    {
      title: 'RAI Pool',
      value: 10,
      key: 'f-rai',
    },
    {
      title: 'alUSD Pool',
      value: 10,
      key: 'f-alusd',
    },
    {
      title: 'FEI Pool',
      value: 10,
      key: 'f-fei',
    },
  ],
  emission: 100000,
  currentEpoch: 1637768286000,
}

const stateCtx = createContext<State>(MOCK_DATA)

export const useMockDialsState = (): State => useContext(stateCtx)

export const DialsMockProvider: FC = ({ children }) => {
  return <stateCtx.Provider value={useMemo(() => MOCK_DATA, [])}>{children}</stateCtx.Provider>
}
