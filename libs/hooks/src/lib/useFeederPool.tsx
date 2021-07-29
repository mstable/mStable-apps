import { FeederPoolState } from '@apps/data-provider'

import { useSelectedMassetState } from './useSelectedMassetState'

export const useFeederPool = (address: string): FeederPoolState | undefined => {
  const massetState = useSelectedMassetState()
  return massetState?.feederPools[address]
}
