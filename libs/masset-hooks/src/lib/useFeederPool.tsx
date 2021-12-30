import { FeederPoolState } from '@apps/data-provider'
import { MassetName } from '@apps/types'

import { useSelectedMassetState } from './useSelectedMassetState'

export const useFeederPool = (address: string, mAssetName?: MassetName): FeederPoolState | undefined => {
  const massetState = useSelectedMassetState(mAssetName)
  return massetState?.feederPools[address]
}
