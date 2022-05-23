import { useEffect } from 'react'

import { API_ENDPOINT } from '@apps/base/utils'
import { useFetchState } from '@apps/hooks'

import type { FetchState } from '@apps/types'

// eslint-disable-next-line @typescript-eslint/naming-convention
interface stkBPTAPY {
  stkBPTAPY?: number
}

export const useBPTBalApy = (): FetchState<number> => {
  const [state, setState] = useFetchState<number>()

  useEffect(() => {
    setState.fetching()
    fetch(`${API_ENDPOINT}/stk-bpt-apy`)
      .then(resp => resp.json())
      .catch(setState.error)
      .then((json: stkBPTAPY) => {
        setState.value(json.stkBPTAPY ?? 0)
      })
      .catch(setState.error)
  }, [setState])

  return state
}
