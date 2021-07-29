import { FeederPoolState } from '@apps/base/context/data'

import { useSelectedMassetState } from './useSelectedMassetState'

export const useFeederPool = (address: string): FeederPoolState | undefined => {
  const massetState = useSelectedMassetState()
  return massetState?.feederPools[address]
}
