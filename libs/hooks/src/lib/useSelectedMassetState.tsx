import { MassetState, useDataState } from '@apps/base/context/data'
import { useSelectedMassetName } from '@apps/base/context/masset'

export const useSelectedMassetState = (): MassetState | undefined => {
  const masset = useSelectedMassetName()
  return useDataState()[masset]
}
