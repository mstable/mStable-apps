/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react'

import { useFetchState } from '@apps/hooks'
import { useEnsResolver, useProvider } from 'wagmi'

import { ActionType, useENSState } from '../context/ENSProvider'

import type { FetchState } from '@apps/types'

export const useResolveENSName = (ensName: string): FetchState<string> => {
  const provider = useProvider()
  const [state, dispatch] = useENSState()

  const maybeResolved = state[ensName]

  useEffect(() => {
    if (maybeResolved || !provider) return

    dispatch({ type: ActionType.Fetch, payload: { ensName } })
    provider
      .resolveName(ensName)
      .then((address: any) => {
        dispatch({ type: ActionType.Value, payload: { ensName, address } })
      })
      .catch((error: any) => {
        dispatch({ type: ActionType.Error, payload: { ensName, error } })
      })
  }, [maybeResolved, dispatch, ensName, provider])

  return state[ensName] ?? {}
}

// TODO cache me
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
