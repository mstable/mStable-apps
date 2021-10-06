import { useMemo } from 'react'
import { getUnixTime } from 'date-fns'
import { DocumentNode, gql } from '@apollo/client'

export const useBlockTimestampsDocument = (dates: Date[]): DocumentNode =>
  useMemo(
    () => gql`query BlockTimestamps {
      ${dates
        .map(ts => {
          const unixTs = getUnixTime(ts)
          return `t${unixTs}: blocks(first: 1, orderBy: timestamp, orderDirection: asc, where: {timestamp_gt: ${unixTs}, timestamp_lt: ${
            unixTs + 60000
          } }) { number }`
        })
        .join('\n')}
  }`,
    [dates],
  )
