import { MassetState, useDataState } from '@apps/data-provider'
import { useSelectedMassetName } from '@apps/masset-provider'

export const useSelectedMassetState = (): MassetState | undefined => {
  const masset = useSelectedMassetName()
  return useDataState()[masset]
}
