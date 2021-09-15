import { FC, createContext, useState, useContext } from 'react'

import { providerFactory } from '@apps/hooks'

export interface State {
  delegateSelection?: string
}

interface Dispatch {
  setDelegateSelection: (id: string) => void
}

const initialState: State = {}

const dispatchContext = createContext<Dispatch>(null as never)
const stateContext = createContext<State>(null as never)

export const ModalDataProvider: FC = ({ children }) => {
  const [state, setState] = useState<State>(initialState)

  return providerFactory(
    dispatchContext,
    {
      value: {
        setDelegateSelection: (delegateSelection: string) => {
          setState({ ...state, delegateSelection })
        },
      },
    },
    providerFactory(stateContext, { value: state }, children),
  )
}

export const useModalData = (): State => useContext(stateContext)

export const useModalDataDispatch = (): Dispatch => useContext(dispatchContext)
