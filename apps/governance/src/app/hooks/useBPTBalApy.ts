import { useEffect } from 'react'

import { useFetchState } from '@apps/hooks'
import { FetchState } from '@apps/types'

interface stkBPTAPY {
  stkBPTAPY?: number
}

export const useBPTBalApy = (): FetchState<number> => {
  const [state, setState] = useFetchState<number>()

  useEffect(() => {
    setState.fetching()
    fetch('https://api.mstable.org/stk-bpt-apy')
      .then(resp => resp.json())
      .catch(setState.error)
      .then((json: stkBPTAPY) => {
        setState.value(json.stkBPTAPY ?? 0)
      })
      .catch(setState.error)
  }, [setState])

  return state
}
