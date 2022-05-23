import { useDataState } from '@apps/data-provider'
import { useSelectedMassetName } from '@apps/masset-provider'

import type { MassetState } from '@apps/data-provider'
import type { MassetName } from '@apps/types'

export const useSelectedMassetState = (mAssetName?: MassetName): MassetState | undefined => {
  const selectedMassetName = useSelectedMassetName()
  return useDataState()[mAssetName || selectedMassetName]
}
