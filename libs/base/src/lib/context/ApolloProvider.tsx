import React, { createContext, FC, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { usePrevious } from 'react-use'
import { ApolloClient, ApolloLink, InMemoryCache, HttpLink, NormalizedCacheObject } from '@apollo/client'
import { RetryLink } from '@apollo/client/link/retry'
import { onError } from '@apollo/client/link/error'
import { persistCache } from 'apollo-cache-persist'
import ApolloLinkTimeout from 'apollo-link-timeout'

import { caches } from './apolloCaches'
import { useAddErrorNotification } from './NotificationsProvider'
import { useNetwork, AllGqlEndpoints } from './NetworkProvider'

type ApolloClients = Record<AllGqlEndpoints, ApolloClient<NormalizedCacheObject>>

const apolloClientsCtx = createContext<ApolloClients>(null as never)

// For networks without a given endpoint, use a dummy client; no data will be found
const dummyClient = new ApolloClient<NormalizedCacheObject>({ cache: new InMemoryCache() })

export const useApolloClients = () => useContext(apolloClientsCtx)

export const ApolloProvider: FC = ({ children }) => {
  const addErrorNotification = useAddErrorNotification()
  const [persisted, setPersisted] = useState(false)
  const network = useNetwork()
  const previousChainId = usePrevious(network.chainId)
  const networkChanged = previousChainId && network.chainId !== previousChainId

  // Serialized array of failed endpoints to be excluded from the client
  const [failedEndpoints, setFailedEndpoints] = useState<string>('')

  const handleError = useCallback(
    (message: string, error?: unknown): void => {
      console.error(message, error)

      // Not significant at the moment; falls back to the hosted service
      if (message.includes('Exhausted list of indexers')) return

      let sanitizedError: string = message
      if (message.includes('Failed to query subgraph deployment')) {
        sanitizedError = `The Graph: ${message.split(': ')[1] ?? message}`
      }
      addErrorNotification(sanitizedError)
    },
    [addErrorNotification],
  )

  useEffect(() => {
    Promise.all(
      Object.keys(caches).map(clientName =>
        persistCache({
          cache: caches[clientName as keyof ApolloClients] as never,
          storage: window.localStorage as never,
          key: `${network.chainId}-${clientName}`,
        }),
      ),
    )
      .catch(_error => {
        console.warn('Cache persist error', _error)
      })
      .finally(() => {
        setPersisted(true)
      })
  }, [setPersisted, network.chainId])

  const apollo = useMemo<{ ready: true; clients: ApolloClients } | { ready: false }>(() => {
    if (!persisted) return { ready: false }

    // const _failedEndpoints = failedEndpoints.split(',')

    const errorLink = onError(({ networkError, graphQLErrors, operation }) => {
      // const ctx = operation.getContext()

      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, ..._error }) => {
          // if (_failedEndpoints.includes(ctx.uri)) return

          handleError(message, _error)

          // On any GraphQL error, mark the endpoint as failed; this may be
          // excessive, but failed endpoints are merely deprioritised rather than
          // excluded completely.
          // _failedEndpoints.push(ctx.uri)
        })
      }

      if (networkError) {
        handleError(networkError.message)
      }
      // setFailedEndpoints(_failedEndpoints.join(','))
    })

    const retryIf = (error: { statusCode: number }) => {
      const doNotRetryCodes = [500, 400]
      return !!error && !doNotRetryCodes.includes(error.statusCode)
    }

    const clients = (Object.keys(caches) as AllGqlEndpoints[])
      .map<[AllGqlEndpoints, ApolloClient<NormalizedCacheObject>]>(name => {
        if (!Object.prototype.hasOwnProperty.call(network.gqlEndpoints, name)) {
          return [name, dummyClient]
        }

        const endpoints = network.gqlEndpoints[name as keyof typeof network['gqlEndpoints']]
        const preferred = endpoints.filter(endpoint => !failedEndpoints.split(',').includes(endpoint))[0]
        const fallback = endpoints[0] // There is always a fallback, even if it failed
        const endpoint = preferred ?? fallback
        const timeoutLink = new ApolloLinkTimeout(30000)

        const httpLink = new HttpLink({ uri: endpoint })
        const retryLink = new RetryLink({ delay: { initial: 1e3, max: 5e3, jitter: true }, attempts: { max: 1, retryIf } })
        const link = ApolloLink.from([errorLink, retryLink, timeoutLink, httpLink])
        const client = new ApolloClient<NormalizedCacheObject>({
          cache: caches[name],
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
        })

        return [name, client]
      })
      .reduce<ApolloClients>(
        (prev, [clientName, client]) => ({ ...prev, [clientName as keyof ApolloClients]: client }),
        {} as ApolloClients,
      )

    return { ready: true, clients }
  }, [persisted, failedEndpoints, handleError, network])

  useEffect(() => {
    // Reset caches that can have conflicting keyFields on network change
    // This prevents cached data from a previously selected network being used
    // on a newly-selected network
    if (networkChanged && (apollo as { clients: ApolloClients }).clients) {
      ;(apollo as { clients: ApolloClients }).clients.blocks.resetStore().catch(error => {
        console.error(error)
      })
    }
  }, [apollo, networkChanged])

  return apollo.ready ? <apolloClientsCtx.Provider value={apollo.clients}>{children}</apolloClientsCtx.Provider> : <Skeleton />
}
