import { useMemo } from 'react'
import { useQuery } from '@apollo/client'

import { useApolloClients } from '@apps/base/context/apollo'
import { getKeyTimestamp } from '@apps/formatters'
import { useBlockTimestampsDocument } from '@apps/hooks'

interface BlockTime {
  timestamp: number
  number: number
}

export const useBlockTimesForDates = (dates: Date[]): BlockTime[] => {
  const { blocks: client } = useApolloClients()
  const blocksDoc = useBlockTimestampsDocument(dates)

  const query = useQuery<{
    [timestamp: string]: [] | [{ number: number }]
  }>(blocksDoc, { fetchPolicy: 'cache-first', client })

  return useMemo(() => {
    const filtered = Object.entries(query.data ?? {}).filter(([, value]) => !!value[0]?.number) as [string, [{ number: number }]][]

    return filtered
      .map(([key, [{ number }]]) => ({
        timestamp: getKeyTimestamp(key),
        number,
      }))
      .sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1))
  }, [query.data])
}
