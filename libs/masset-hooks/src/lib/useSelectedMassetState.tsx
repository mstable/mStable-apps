import { MassetState, useDataState } from '@apps/data-provider'
import { useSelectedMassetName } from '@apps/masset-provider'
import { MassetName } from '@apps/types'

export const useSelectedMassetState = (mAssetName?: MassetName): MassetState | undefined => {
  const selectedMassetName = useSelectedMassetName()
  return useDataState()[mAssetName || selectedMassetName]
}
