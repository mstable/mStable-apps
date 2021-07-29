import { BoostedSavingsVaultState } from '@apps/data-provider'

import { useSelectedMassetState } from './useSelectedMassetState'

export const useSelectedBoostedSavingsVault = (): BoostedSavingsVaultState | undefined => {
  const masset = useSelectedMassetState()
  return masset?.savingsContracts?.v2?.boostedSavingsVault
}
