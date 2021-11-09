import { useEffect, Reducer } from 'react'
import { createReducerContext } from 'react-use'
import { BaseProvider as Provider } from '@ethersproject/providers'

import { useFetchState } from '@apps/hooks'
import { FetchState } from '@apps/types'

import { useProvider } from './AccountProvider'

export const resolveENSContentHash = async (ensName: string, provider: Provider): Promise<string | null> => {
  const resolver = await provider.getResolver(ensName)
  return resolver?.getContentHash()
}

export const useResolveENSContentHash = (ensName: string) => {
  const provider = useProvider()
  const [state, callbacks] = useFetchState<string | null>()

  useEffect(() => {
    if (!provider || state.fetching) return
    callbacks.fetching()
    resolveENSContentHash(ensName, provider).then(callbacks.value).catch(callbacks.error)
  }, [provider, callbacks, state, ensName])

  return state
}

interface State {
  [ensName: string]: FetchState<string>
}

export enum ActionType {
  Error,
  Value,
  Fetch,
}

type Action =
  | { type: ActionType.Error; payload: { ensName: string; error: string } }
  | { type: ActionType.Value; payload: { ensName: string; address: string } }
  | { type: ActionType.Fetch; payload: { ensName: string } }

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case ActionType.Error:
      return { ...state, [action.payload.ensName]: { ...state[action.payload.ensName], error: action.payload.error } }
    case ActionType.Value:
      return { ...state, [action.payload.ensName]: { value: action.payload.address } }
    case ActionType.Fetch:
      return { ...state, [action.payload.ensName]: { ...state[action.payload.ensName], fetching: true } }
    default:
      return state
  }
}

const initialState = JSON.parse(localStorage.getItem('ENSCache') ?? '{}')

export const [useENSState, ENSProvider] = createReducerContext(reducer, initialState)
