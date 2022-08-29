import { useDataState } from '@apps/data-provider'
import { useSelectedMassetName } from '@apps/masset-provider'
import { BigNumber } from 'ethers'

import type { MassetState } from '@apps/data-provider'
import type { MassetName } from '@apps/types'

export const useSelectedMassetState = (mAssetName?: MassetName): MassetState | undefined => {
  const selectedMassetName = useSelectedMassetName()
  const mAsset = useDataState()[mAssetName || selectedMassetName]
  const lastUpdateTime = mAsset?.savingsContracts.v2?.boostedSavingsVault?.lastUpdateTime
  // Rewards are empty if the last time the rewardsRate was updated longer than 7 days
  const minLastUpdateTime = Date.now() / 1000 - 7 * 24 * 3600
  if (lastUpdateTime && lastUpdateTime < minLastUpdateTime) {
    return {
      ...mAsset,
      savingsContracts: {
        ...mAsset.savingsContracts,
        v2: {
          ...mAsset.savingsContracts.v2,
          boostedSavingsVault: {
            ...mAsset.savingsContracts.v2.boostedSavingsVault,
            rewardRate: BigNumber.from(0),
          },
        },
      },
    }
  }
  return mAsset
}
