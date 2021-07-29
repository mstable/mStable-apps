import { BoostedSavingsVaultState } from '@apps/base/context/data'

import { useSelectedMassetState } from './useSelectedMassetState'

export const useSelectedBoostedSavingsVault = (): BoostedSavingsVaultState | undefined => {
  const masset = useSelectedMassetState()
  return masset?.savingsContracts?.v2?.boostedSavingsVault
}
