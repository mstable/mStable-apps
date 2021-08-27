import { BaseProvider as Provider } from '@ethersproject/providers'
import { useEffect } from 'react'

import { useProvider } from '@apps/base/context/account'
import { useFetchState } from '@apps/hooks'

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
  }, [provider, callbacks, state])

  return state
}

export const useResolveENSName = (ensName: string) => {
  const provider = useProvider()
  const [state, callbacks] = useFetchState<string | null>()

  useEffect(() => {
    if (!provider) return
    callbacks.fetching()
    provider.resolveName(ensName).then(callbacks.value).catch(callbacks.error)
  }, [ensName, provider, callbacks])

  return state
}
