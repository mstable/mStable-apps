/* eslint-disable @nrwl/nx/enforce-module-boundaries */

import { BigDecimal } from '@apps/bigdecimal'
import { BoostedSavingsVaultState } from '@apps/data-provider'

export const MIN_BOOST = 1
export const MAX_BOOST = 3
export const BOOST_COEFF = 0.9
export const EXPONENT = 3 / 4
export const MAX_VMTA = 600000

// 0.98 + c * min(voting_weight, f) / scaledBalance^b
export const calculateVMTAForMaxBoost = (stakingBalance: BigDecimal, priceCoeff?: number): number => {
  if (!priceCoeff) return 0

  const scaledBalance = stakingBalance.simple * priceCoeff
  const x = MAX_BOOST - MIN_BOOST * 0.98
  const y = scaledBalance ** EXPONENT
  const unbounded = (x * y) / BOOST_COEFF

  return Math.min(unbounded, MAX_VMTA) * 12
}

// min(m, max(d, 0.98 + c * min(vMTA, f) / USD^b))
export const calculateBoost = (priceCoeff?: number, stakingBalance?: BigDecimal, vMTABalance?: BigDecimal): number => {
  if (!priceCoeff) return 1

  const scaledMTABalance = (vMTABalance?.simple ?? 0) / 12
  const scaledBalance = (stakingBalance?.simple ?? 0) * priceCoeff

  return Math.min(MAX_BOOST, Math.max(MIN_BOOST, 0.98 + (BOOST_COEFF * Math.min(scaledMTABalance, MAX_VMTA)) / scaledBalance ** EXPONENT))
}

export const getPriceCoeff = (vault: BoostedSavingsVaultState): number | undefined => {
  // if (vault.priceCoeff) return vault.priceCoeff / 1e18

  switch (vault.address) {
    // All USD
    case '0xb3114e33fc6ff5f3c452980ccbe7cf1de1fc822b': // ropsten
    case '0xd124b55f70d374f58455c8aedf308e52cf2a6207': // musd/busd
    case '0xadeedd3e5768f7882572ad91065f93ba88343c99': // musd/gusd
    case '0x0997dddc038c8a958a3a3d00425c16f8eca87deb': // alusd/gusd
    case '0xd24099eb4cd604198071958655e4f2d263a5539b': // mUSD/FEI
      return 1

    // All BTC
    case '0x760ea8cfdcc4e78d8b9ca3088ecd460246dc0731': // mbtc/tbtc
    case '0x97e2a2f97a2e9a4cfb462a49ab7c8d205abb9ed9': // mbtc/tbtcv2
    case '0xf65d53aa6e2e4a5f4f026e73cb3e22c22d75e35c': // mbtc/hbtc
      return 48000

    // NonPeggedFeederPool
    case '0xf93e0dde0f7c48108abbd880db7697a86169f13b': // musd/rai
      return 2

    // All imAssets
    case '0xf38522f63f40f9dd81abafd2b8efc2ec958a3016': // imbtc vault
      return 4800
    case '0x78befca7de27d07dc6e71da295cc2946681a6c7b': // imusd vault
      return 0.1

    default:
      return undefined
  }
}
