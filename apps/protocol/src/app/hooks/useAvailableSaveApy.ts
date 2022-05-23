import { useMemo } from 'react'

import { useBlockTimesForDates } from '@apps/base/hooks'
import { eachDayOfInterval, endOfDay, subDays } from 'date-fns'

import { useSelectedSavingsContractState } from '../context/SelectedSaveVersionProvider'
import { useDailyApysForBlockTimes } from './useDailyApysForBlockTimes'

import type { MassetName } from '@apps/types'

const now = new Date()
const timestampsForMonth = eachDayOfInterval({
  start: subDays(now, 29),
  end: subDays(now, 1),
})
  .map(endOfDay)
  .concat(now)

export const useAvailableSaveApy = (
  mAssetName?: MassetName,
): {
  value: number
  v1Apy: number
  days?: number
  type: 'live' | 'average' | 'inactive' | 'fetching' | 'bootstrapping'
} => {
  const v1Apy = 0
  const savingsContract = useSelectedSavingsContractState(mAssetName)
  const liveAPY = savingsContract?.dailyAPY

  const blockTimes = useBlockTimesForDates(timestampsForMonth)
  const dailyApys = useDailyApysForBlockTimes(savingsContract?.address, blockTimes)
  const current = savingsContract?.current
  const fetching = !savingsContract

  return useMemo(() => {
    let value = 0

    if (fetching) {
      return { value, v1Apy, type: 'fetching' }
    }

    if (!current) {
      return { value, v1Apy, type: 'inactive' }
    }

    const nonZeroApys = dailyApys.filter(v => v.dailyAPY > 0)

    // Not enough data to sample an average, or too many outliers
    const useLive = dailyApys.filter(v => v.dailyAPY === 0).length > 0 || dailyApys.filter(v => v.dailyAPY > 200).length > 1

    if (useLive) {
      value = liveAPY ?? value
    } else {
      value = nonZeroApys.reduce((prev, { dailyAPY }) => prev + dailyAPY, 0) / nonZeroApys.length
    }

    // It's possible to get misleading APYs during boostrapping
    if (value > 1000) {
      return { value: 0, v1Apy, type: 'bootstrapping' }
    }

    return { value, v1Apy, type: useLive ? 'live' : 'average', days: dailyApys.length }
  }, [fetching, current, dailyApys, v1Apy, liveAPY])
}
