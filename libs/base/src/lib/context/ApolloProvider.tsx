import { createContext, useCallback, useContext, useEffect, useState } from 'react'

import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { RetryLink } from '@apollo/client/link/retry'
import { createNetworkStatusNotifier, initialState, reducer } from '@jameslefrere/react-apollo-network-status'
import ApolloLinkTimeout from 'apollo-link-timeout'
import { CachePersistor, LocalStorageWrapper } from 'apollo3-cache-persist'
import Skeleton from 'react-loading-skeleton'
import { usePrevious } from 'react-use'

import { caches } from './apolloCaches'
import { useNetwork } from './NetworkProvider'
import { useAddErrorNotification } from './NotificationsProvider'

import type { NormalizedCacheObject, Operation } from '@apollo/client'
import type { NetworkStatus, NetworkStatusAction } from '@jameslefrere/react-apollo-network-status'
import type { FC } from 'react'

import type { AllGqlEndpoints } from './NetworkProvider'

type ApolloClients = Record<AllGqlEndpoints, ApolloClient<NormalizedCacheObject>>

const apolloClientsCtx = createContext<ApolloClients>(null as never)

// For networks without a given endpoint, use a dummy client; no data will be found
const dummyClient = new ApolloClient<NormalizedCacheObject>({ cache: new InMemoryCache() })

const { link: networkStatusLink, useApolloNetworkStatusReducer } = createNetworkStatusNotifier()

export const useApolloClients = () => useContext(apolloClientsCtx)

export const ApolloProvider: FC = ({ children }) => {
  const addErrorNotification = useAddErrorNotification()
  const network = useNetwork()
  const prevNetworkId = usePrevious(network.chainId)
  const [clients, setClients] = useState<ApolloClients | null>()

  const handleError = useCallback(
    (message: string, error?: unknown): void => {
      console.error(message, error)

      // Not significant at the moment; falls back to the hosted service
      if (message.includes('Exhausted list of indexers')) return

      let sanitizedError: string = message
      let body: string | undefined
      if (message.includes('Failed to query subgraph deployment')) {
        sanitizedError = `Subgraph: ${message.split(': ')[1] ?? message}`
      }

      if ((error as { operation?: Operation })?.operation?.operationName) {
        body = `Subgraph: ${(error as { operation: Operation }).operation.operationName}`
      }

      addErrorNotification(sanitizedError, body)
    },
    [addErrorNotification],
  )

  const errorLink = onError(error => {
    const { networkError, graphQLErrors } = error
    if (graphQLErrors && Array.isArray(graphQLErrors)) {
      graphQLErrors.forEach(({ message }) => {
        handleError(message, error)
      })
    }

    if (networkError) {
      handleError(networkError.message, error)
    }
  })

  const retryIf = (error: { statusCode: number }) => {
    const doNotRetryCodes = [500, 400]
    return !!error && !doNotRetryCodes.includes(error.statusCode)
  }

  useEffect(() => {
    const updateClientCache = async () => {
      if (network.chainId === prevNetworkId) return

      let res = {}
      for (const key in caches) {
        if (!Object.keys(network.gqlEndpoints).includes(key)) {
          res = { ...res, [key]: dummyClient }
          continue
        }

        const cache = caches[key as keyof ApolloClients] as never
        const persistor = new CachePersistor({
          cache,
          storage: new LocalStorageWrapper(window.localStorage),
          key: `${network.chainId}-${key}`,
        })

        await persistor.restore()

        const endpoint = network.gqlEndpoints[key as keyof typeof network['gqlEndpoints']][0]
        const timeoutLink = new ApolloLinkTimeout(30000)
        const endpointNameLink = new ApolloLink((operation, forward) => {
          operation.extensions.endpointName = key
          return forward(operation)
        })
        const httpLink = new HttpLink({ uri: endpoint })
        const retryLink = new RetryLink({ delay: { initial: 1e3, max: 5e3, jitter: true }, attempts: { max: 1, retryIf } })
        const link = ApolloLink.from([endpointNameLink, networkStatusLink, retryLink, timeoutLink, errorLink, httpLink])

        res = {
          ...res,
          [key]: new ApolloClient<NormalizedCacheObject>({
            cache: cache,
            link,
            defaultOptions: {
              watchQuery: {
                fetchPolicy: 'cache-and-network',
                errorPolicy: 'all',
              },
              query: {
                fetchPolicy: 'cache-first',
                errorPolicy: 'all',
              },
            },
          }),
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setClients(res as any)
    }

    updateClientCache()
  }, [errorLink, network.chainId, network.gqlEndpoints, prevNetworkId])

  return clients ? <apolloClientsCtx.Provider value={clients}>{children}</apolloClientsCtx.Provider> : <Skeleton />
}

type NetworkStatusState = Partial<Record<AllGqlEndpoints, NetworkStatus>>

const networkStatusReducer = (state: NetworkStatusState, action: NetworkStatusAction): NetworkStatusState => ({
  ...state,
  [action.payload.operation.extensions.endpointName]: reducer(
    state[action.payload.operation.extensions.endpointName as keyof NetworkStatusState] ?? initialState,
    action,
  ),
})

export const useNetworkStatus = () => useApolloNetworkStatusReducer(networkStatusReducer, {})
