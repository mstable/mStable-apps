import { useSelectedMassetState } from './useSelectedMassetState'

import type { FeederPoolState } from '@apps/data-provider'
import type { MassetName } from '@apps/types'

export const useFeederPool = (address: string, mAssetName?: MassetName): FeederPoolState | undefined => {
  const massetState = useSelectedMassetState(mAssetName)
  return massetState?.feederPools[address]
}
