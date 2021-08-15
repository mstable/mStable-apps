import { FC, createContext, useState, useContext } from 'react'

import { providerFactory } from '@apps/hooks'

export interface State {
  hasWithdrawnV1Balance: boolean
  hasSelectedStakeOption: boolean
}

interface Dispatch {
  setSelectedOption: () => void
  setWithdrewV1Balance: () => void
}

const initialState: State = {
  hasWithdrawnV1Balance: false,
  hasSelectedStakeOption: false,
}

const dispatchContext = createContext<Dispatch>(null as never)
const stateContext = createContext<State>(null as never)

export const StakingStatusProvider: FC = ({ children }) => {
  const [state, setState] = useState<State>(initialState)

  return providerFactory(
    dispatchContext,
    {
      value: {
        setSelectedOption: () => {
          setState({ ...state, hasSelectedStakeOption: true })
        },
        setWithdrewV1Balance: () => {
          setState({ ...state, hasWithdrawnV1Balance: true })
        },
      },
    },
    providerFactory(stateContext, { value: state }, children),
  )
}

export const useStakingStatus = (): State => useContext(stateContext)

export const useStakingStatusDispatch = (): Dispatch => useContext(dispatchContext)
