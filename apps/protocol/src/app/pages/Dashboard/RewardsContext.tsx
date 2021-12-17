import { createContext, Dispatch, FC, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { RewardStreams } from '../../context/RewardStreamsProvider'

type TotalRewards = { total: number; unlocked: number }

type UpsertStream = (id: string, stream: RewardStreams) => void

interface RewardsContext {
  totalRewards: TotalRewards
  upsertStream: UpsertStream
  deleteStream: Dispatch<string>
  reset: Dispatch<void>
}

const ctx = createContext<RewardsContext>(null)

export const RewardsProvider: FC = ({ children }) => {
  const [streams, setStreams] = useState<Record<string, RewardStreams>>({})

  const upsertStream = useCallback(
    (id: string, stream) => {
      if (stream && !streams[id]) {
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
          const { earned, total, unlocked } = amounts

          return {
            total: acc.total + total || 0,
            unlocked: unlocked + earned?.unlocked || 0,
          }
        },
        {
          total: 0,
          unlocked: 0,
        },
      ),
    [streams],
  )

  return <ctx.Provider value={{ totalRewards, upsertStream, deleteStream, reset }}>{children}</ctx.Provider>
}

export const useTotalRewards = (): TotalRewards => useContext(ctx).totalRewards

export const useUpsertStream = (): UpsertStream => useContext(ctx).upsertStream

export const useReset = (): Dispatch<void> => useContext(ctx).reset
