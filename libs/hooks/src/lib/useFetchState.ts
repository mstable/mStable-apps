import { useMemo, useState } from 'react'

import { FetchState } from '@apps/types'

interface FetchStateCallbacks<T> {
  value(value?: T): void
  error(error: string): void
  fetching(): void
}

export const useFetchState = <T>(initialState: FetchState<T> = {}): [FetchState<T>, FetchStateCallbacks<T>] => {
  const [fetching, setFetching] = useState<FetchState<T>['fetching']>(initialState.fetching)
  const [value, setValue] = useState<FetchState<T>['value']>(initialState.value)
  const [error, setError] = useState<FetchState<T>['error']>(initialState.error)

  const callbacks = useMemo<FetchStateCallbacks<T>>(
    () => ({
      value: value => {
        setValue(value)
        setFetching(false)
        setError(undefined)
      },
      error: error => {
        console.error(error)
        setError(error)
        setFetching(false)
      },
      fetching: () => {
        // retain value
        setFetching(true)
        setError(undefined)
      },
    }),
    [],
  )

  return [useMemo(() => ({ fetching, value, error }), [fetching, value, error]), callbacks]
}
