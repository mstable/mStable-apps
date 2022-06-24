import { createContext, useContext, useMemo, useState } from 'react'

import { subDays, subHours } from 'date-fns'
import { useInterval } from 'react-use'

import { useBlockTimesForDates } from '../hooks'
import { useIsIdle, useProvider } from './AccountProvider'
import { useNetwork } from './NetworkProvider'

import type { FC } from 'react'

export type MaybeBlockNumber = number | undefined

interface BlockNumbers {
  blockNow?: number
  block24h?: number
  block7d?: number
}

interface State {
  [chainId: number]: number | undefined
}

const ctx = createContext<BlockNumbers>(null as never)

const date7d = subDays(Date.now(), 7)
const date24h = subHours(Date.now(), 24)

export const BlockProvider: FC = ({ children }) => {
  const [blockNow, setBlockNow] = useState<State>({})
  const { chainId, blockTime } = useNetwork()

  const provider = useProvider()
  const idle = useIsIdle()

  const blockTimes = useBlockTimesForDates([date7d, date24h])

  useInterval(() => {
    if (!idle) {
      // Only set the new block number when the user is active
      // getBlockNumber apparently returns a string
      provider?.getBlockNumber().then(latest => {
        const value = latest ? parseInt(latest as unknown as string, 10) : undefined
        setBlockNow({ ...blockNow, [chainId]: value })
      })
    }
  }, blockTime)

  const value = useMemo(() => {
    return {
      blockNow: blockNow[chainId],
      block7d: blockTimes[0]?.number ? parseInt(blockTimes[0]?.number as unknown as string) : undefined,
      block24h: blockTimes[1]?.number ? parseInt(blockTimes[1]?.number as unknown as string) : undefined,
    }
  }, [blockNow, blockTimes, chainId])

  return <ctx.Provider value={value}>{children}</ctx.Provider>
}

export const useBlockNow = (): MaybeBlockNumber => useContext(ctx).blockNow

export const useBlockNumbers = (): BlockNumbers => useContext(ctx)
