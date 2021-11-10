/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { useMemo } from 'react'

import type { BoostedSavingsVaultState } from '@apps/data-provider'

import { calculateBoost, getPriceCoeff } from './boost'
import { useVMTABalance } from './useVMTABalance'

export const useCalculateUserBoost = (vault?: BoostedSavingsVaultState): number => {
  const vMTABalance = useVMTABalance()
  const rawBalance = vault?.account?.rawBalance

  const boost = useMemo<number>(() => {
    if (!vault) return 1

    const priceCoeff = getPriceCoeff(vault)

    return calculateBoost(priceCoeff, rawBalance, vMTABalance)
  }, [rawBalance, vMTABalance, vault])

  // Fallback to 1x multiplier
  return boost ?? 1
}
