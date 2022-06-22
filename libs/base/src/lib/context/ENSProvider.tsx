/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react'

import { useFetchState } from '@apps/hooks'
import { createReducerContext } from 'react-use'
import { useEnsResolver } from 'wagmi'

import type { FetchState } from '@apps/types'
import type { Reducer } from 'react'

export const useResolveENSContentHash = (ensName: string) => {
  const { data: resolver } = useEnsResolver({
    name: ensName,
  })
  const [state, callbacks] = useFetchState<string | null>()

  useEffect(() => {
    const getHash = async () => {
      if (!resolver || state.fetching) return
      callbacks.fetching()
      try {
        const hash = await resolver?.getContentHash()
        callbacks.value(hash)
      } catch (error: any) {
        callbacks.error(error)
      }
    }

    getHash()
  }, [callbacks, resolver, state.fetching])

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
