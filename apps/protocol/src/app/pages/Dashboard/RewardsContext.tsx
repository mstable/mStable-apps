import { createContext, Dispatch, FC, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { RewardStreams, useRewardStreams } from '../../context/RewardStreamsProvider'

type TotalRewards = { pending: number; claimed: number; total: number }

type UpsertStream = (id: string, stream: RewardStreams) => void

interface RewardsContext {
  totalRewards: TotalRewards
  upsertStream: UpsertStream
  deleteStream: Dispatch<string>
  reset: Dispatch<void>
}

const ctx = createContext<RewardsContext>(null)

const isStreamEqual = (a: RewardStreams, b: RewardStreams): boolean => a?.amounts?.total === b?.amounts?.total

export const RewardsProvider: FC = ({ children }) => {
  const [streams, setStreams] = useState<Record<string, RewardStreams>>({})

  const upsertStream = useCallback(
    (id: string, stream: RewardStreams) => {
      if (stream && (!streams[id] || !isStreamEqual(streams[id], stream))) {
        setStreams({ ...streams, [id]: stream })
      }
    },
    [streams],
  )

  const deleteStream = useCallback(
    (id: string) => {
      if (streams[id]) {
        const { [id]: omitted, ...rest } = streams
        setStreams(rest)
      }
    },
    [streams],
  )

  const reset = useCallback(() => {
    setStreams({})
  }, [])

  const totalRewards = useMemo(
    () =>
      Object.values(streams).reduce(
        (acc, curr) => {
          const { amounts } = curr
          if (!amounts) return acc
          const { earned, locked, total } = amounts

          return {
            pending: acc.pending + locked || 0,
            claimed: acc.claimed + earned?.total || 0,
            total: acc.total + total || 0,
          }
        },
        {
          pending: 0,
          claimed: 0,
          total: 0,
        },
      ),
    [streams],
  )

  return <ctx.Provider value={{ totalRewards, upsertStream, deleteStream, reset }}>{children}</ctx.Provider>
}

export const useSubscribeRewardStream = (id: string) => {
  const rewards = useRewardStreams()
  const { upsertStream } = useContext(ctx)

  useEffect(() => {
    upsertStream(id, rewards)
  }, [id, rewards, upsertStream])
}

export const useTotalRewards = (): TotalRewards => useContext(ctx).totalRewards

export const useUpsertStream = (): UpsertStream => useContext(ctx).upsertStream

export const useReset = (): Dispatch<void> => useContext(ctx).reset
