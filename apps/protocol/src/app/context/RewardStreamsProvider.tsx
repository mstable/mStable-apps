import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'

import { BoostedVault__factory } from '@apps/artifacts/typechain'
import { useAccount, useSigner } from '@apps/base/context/account'
import { SCALE } from '@apps/types'
import { getUnixTime } from 'date-fns'
import { BigNumber } from 'ethers'
import { useInterval } from 'react-use'

import type { BoostedVault } from '@apps/artifacts/typechain'
import type { BoostedVaultAccountState, BoostedVaultState } from '@apps/data-provider'
import type { FC } from 'react'

type RewardEntry = BoostedVaultAccountState['rewardEntries'][number]

export enum StreamType {
  Earned,
  Unlocked,
  Locked,
  LockedPreview,
}

export interface Stream {
  start: number
  finish: number
  index?: number
  amount: Partial<Record<StreamType, number>>
}

type ChartData = { t: number; [amount: number]: number | undefined }[]

export interface RewardStreams {
  currentTime: number
  claimRange: [number, number]
  amounts: {
    earned: {
      total: number
      unlocked: number
      locked: number
    }
    total: number
    locked: number
    unlocked: number
    previewLocked: number
    platform: number
  }
  nextUnlock?: number
  chartData: ChartData
  previewStream: Stream
  lockedStreams: Stream[]
}

const nowUnix = getUnixTime(Date.now())

const STREAM_TYPES = Object.values(StreamType).filter(v => (typeof v as unknown) === 'number')
const ZERO_AMOUNTS = Object.fromEntries(STREAM_TYPES.map(type => [type, 0]))

const getEntryAmount = ({ finish, start, rate }: { finish: number; start: number; rate: BigNumber }): number =>
  parseInt(BigNumber.from(finish).sub(start).mul(rate).toString()) / 1e18

const getRewardPerToken = (
  currentTime: number,
  { lastUpdateTime, periodFinish, rewardRate, rewardPerTokenStored, totalSupply }: BoostedVaultState,
): BigNumber => {
  const lastApplicableTime = Math.min(periodFinish, currentTime)
  const timeDelta = lastApplicableTime - lastUpdateTime

  if (timeDelta === 0) {
    return rewardPerTokenStored
  }

  // New reward units to distribute = rewardRate * timeSinceLastUpdate
  const rewardUnitsToDistribute = rewardRate.mul(timeDelta)

  // If there is no StakingToken liquidity, avoid div(0)
  // If there is nothing to distribute, short circuit
  if (totalSupply.exact.eq(0) || rewardUnitsToDistribute.eq(0)) {
    return rewardPerTokenStored
  }

  // New reward units per token = (rewardUnitsToDistribute * 1e18) / totalTokens
  const unitsToDistributePerToken = rewardUnitsToDistribute.mul(SCALE).div(totalSupply.exact)

  // Return summed rate
  return rewardPerTokenStored.add(unitsToDistributePerToken)
}

const calculateEarned = (
  currentTime: number,
  boostedSavingsVault: BoostedVaultState,
): { total: number; unlocked: number; locked: number } => {
  const rewardPerToken = getRewardPerToken(currentTime, boostedSavingsVault)
  const {
    unlockPercentage,
    account: { boostedBalance, rewardPerTokenPaid, rewards },
  } = boostedSavingsVault as BoostedVaultState & {
    account: BoostedVaultAccountState
  }

  // Current rate per token - rate user previously received
  const userRewardDelta = rewardPerToken.sub(rewardPerTokenPaid)

  if (userRewardDelta.eq(0)) {
    // Short circuit if there is nothing new to distribute
    return { total: 0, unlocked: 0, locked: 0 }
  }

  const unlockPercentageSimple = parseInt(unlockPercentage.toString()) / 1e18
  const rewardsSimple = parseInt(rewards.toString()) / 1e18

  // New reward = staked tokens * difference in rate
  const newReward = boostedBalance.mulTruncate(userRewardDelta).simple

  const unlocked = Math.max(newReward * unlockPercentageSimple, 0) + rewardsSimple

  const locked = Math.max(newReward * (1 - unlockPercentageSimple), 0)

  const total = unlocked + locked

  return { total, unlocked, locked }
}

const ctx = createContext<RewardStreams | undefined>(undefined)

export const RewardStreamsProvider: FC<{
  refreshInterval?: number
  vault?: BoostedVaultState
}> = ({ children, refreshInterval = 15e3, vault }) => {
  const [currentTime, setCurrentTime] = useState<number>(nowUnix)
  const account = useAccount()
  const signer = useSigner()
  const [claimRange, setClaimRange] = useState<[number, number] | undefined>(undefined)
  const vaultContract = useRef<BoostedVault>()

  useEffect(() => {
    if (!signer || !account || !vault) return

    if (!vaultContract.current) {
      vaultContract.current = BoostedVault__factory.connect(vault.address, signer)
    }

    vaultContract.current
      .unclaimedRewards(account)
      .catch(error => {
        console.error(error)
      })
      .then(result => {
        if (result) {
          const { first, last } = result
          setClaimRange([first.toNumber(), last.toNumber()])
        } else {
          setClaimRange([0, 0])
        }
      })
  }, [signer, vault, account, setClaimRange])

  useInterval(() => {
    setCurrentTime(getUnixTime(Date.now()))
  }, refreshInterval)

  const rewardStreams = useMemo(() => {
    if (vault?.account) {
      const {
        lockupDuration,
        account: { rewardEntries, lastClaim, lastAction },
        account,
      } = vault

      const [unlockedStreams, lockedStreams] = rewardEntries
        // Remove fully claimed entries
        .filter(entry => (lastClaim ? entry.finish > lastClaim : true))
        // Split entries based on start/finish and now;
        // this helps to visualise it
        .reduce<[RewardEntry[], RewardEntry[]]>(
          ([_unlocked, _locked], entry) => {
            const { start, finish, index } = entry

            if (start <= currentTime && finish >= currentTime) {
              // Unlocked portion and locked portion
              return [
                [
                  ..._unlocked,
                  {
                    ...entry,
                    start,
                    finish: currentTime,
                    index,
                  },
                ],
                [
                  ..._locked,
                  {
                    ...entry,
                    start: currentTime,
                    finish,
                  },
                ],
              ]
            }

            if (start <= currentTime) {
              // Unlocked
              return [[..._unlocked, entry], _locked]
            }
            // Locked
            return [_unlocked, [..._locked, entry]]
          },
          [[], []],
        )
        .map<Stream[]>(entries =>
          entries.map(entry => {
            const { start, finish, index } = entry
            const amount = getEntryAmount(entry)

            const type = start >= currentTime ? StreamType.Locked : StreamType.Unlocked

            return {
              amount: { [type]: amount },
              start,
              finish,
              index,
            }
          }),
        )

      const unlocked = unlockedStreams.reduce((prev, stream) => prev + (stream.amount[StreamType.Unlocked] ?? 0), 0)
      const locked = lockedStreams.reduce((prev, stream) => prev + (stream.amount[StreamType.Locked] ?? 0), 0)
      const earned = calculateEarned(currentTime, vault)

      const earnedStream: Stream = {
        amount: {
          [StreamType.Earned]: earned.unlocked,
        },
        start: lastClaim > 0 ? Math.min(lastClaim, lastAction) : lastAction,
        finish: currentTime,
        index: 0,
      }

      const previewLocked = earned.locked ?? 0
      const previewStream: Stream = {
        amount: {
          [StreamType.LockedPreview]: previewLocked,
        },
        start: lastAction + lockupDuration,
        finish: currentTime + lockupDuration,
      }

      const total = earned.unlocked + previewLocked + locked + unlocked

      // TODO Unclaimed and earned can overlap (but not immediately)
      //   amount: {
      //     [StreamType.Unclaimed]: unclaimed,
      //     [StreamType.Earned]: earned.total,
      //     [StreamType.Unlocked]: unlocked,
      //   },
      //   start: unlockedStreams[0]?.start
      //     ? Math.min(earnedStream.start, unlockedStreams[0].start)
      //     : earnedStream.start,
      //   finish: currentTime,

      const chartData: ChartData = [earnedStream, ...unlockedStreams, ...lockedStreams, previewStream]
        .filter(stream => stream.start > 0)
        .flatMap(({ start, finish, amount }) => [
          {
            ...ZERO_AMOUNTS,
            t: start,
          },
          {
            ...ZERO_AMOUNTS,
            ...amount,
            t: finish,
          },
          {
            ...ZERO_AMOUNTS,
            t: finish + 1,
          },
        ])

      if (!claimRange) {
        return
      }

      const platform = parseInt((account?.platformRewards ?? 0).toString()) / 1e18

      const amounts = {
        earned,
        locked,
        previewLocked,
        unlocked,
        total,
        platform,
      }

      return {
        amounts,
        chartData,
        claimRange: claimRange,
        currentTime,
        nextUnlock: lockedStreams[0]?.start,
        previewStream,
        lockedStreams: [...lockedStreams, previewStream],
      } as RewardStreams
    }
  }, [currentTime, vault, claimRange])

  return <ctx.Provider value={rewardStreams}>{children}</ctx.Provider>
}

export const useRewardStreams = (): RewardStreams | undefined => useContext(ctx)
