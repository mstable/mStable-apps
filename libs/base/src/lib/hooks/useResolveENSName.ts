import { BaseProvider as Provider } from '@ethersproject/providers/lib/base-provider'
import { useEffect } from 'react'

import { useProvider } from '@apps/base/context/account'
import { FetchState, useFetchState } from '@apps/hooks'

import { useENSState, ActionType } from '../context/ENSProvider'

export const useResolveENSName = (ensName: string): FetchState<string> => {
  const provider = useProvider()
  const [state, dispatch] = useENSState()

  const maybeResolved = state[ensName]

  useEffect(() => {
    if (maybeResolved || !provider) return

    dispatch({ type: ActionType.Fetch, payload: { ensName } })
    provider
      .resolveName(ensName)
      .then(address => {
        dispatch({ type: ActionType.Value, payload: { ensName, address } })
      })
      .catch(error => {
        dispatch({ type: ActionType.Error, payload: { ensName, error } })
      })
  }, [maybeResolved, dispatch, ensName, provider])

  return state[ensName] ?? {}
}

export const resolveENSContentHash = async (ensName: string, provider: Provider): Promise<string | null> => {
  const resolver = await provider.getResolver(ensName)
  return resolver?.getContentHash()
}

// TODO cache me
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
