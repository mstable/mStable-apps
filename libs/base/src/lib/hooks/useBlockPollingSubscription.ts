import { useEffect, useRef } from 'react'

import { useBlockNow } from '../context/BlockProvider'
import { useNetwork } from '../context/NetworkProvider'

import type { LazyQueryHookOptions, QueryTuple } from '@apollo/client'
import type { QueryResult } from '@apollo/react-common'

export const useBlockPollingSubscription = <TData, TVariables>(
  lazyQuery: (query: unknown, options?: LazyQueryHookOptions<TData, TVariables>) => QueryTuple<TData, TVariables>,
  baseOptions?: LazyQueryHookOptions<TData, TVariables>,
  skip?: boolean,
): QueryResult<TData, TVariables> => {
  const errorRef = useRef<unknown>()
  const network = useNetwork()
  const blockNumber = useBlockNow()
  const hasBlock = !!blockNumber

  // We're using a long-polling query because subscriptions don't seem to be
  // re-run when derived or nested fields change.
  // See https://github.com/graphprotocol/graph-node/issues/1398
  const [run, query] = lazyQuery({
    ...baseOptions,
    errorPolicy: 'all',
    onError: (error: unknown) => {
      errorRef.current = error
    },
  })

  // Long poll (15s interval) if the block number isn't available.
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (!skip && !hasBlock && !errorRef.current) {
      run()
      interval = setInterval(() => {
        run()
      }, network.blockTime)
    }

    return () => {
      clearInterval(interval)
    }
  }, [skip, hasBlock, run, network])

  // Run the query on every block when the block number is available.
  useEffect(() => {
    if (!skip && blockNumber) {
      run()
    }
  }, [skip, blockNumber, run, network])

  return query as never
}
