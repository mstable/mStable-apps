import { BigDecimal } from '@apps/bigdecimal'
import { FeederPoolState, MassetState } from '@apps/data-provider'
import { SaveVersion } from '../../context/SelectedSaveVersionProvider'

export const getPoolDeposited = ({ token, vault }: FeederPoolState) => {
  const userAmount = token?.balance?.simple ?? 0
  const userStakedAmount = vault?.account?.rawBalance?.simple ?? 0

  return userAmount + userStakedAmount
}

export const sortPoolsByDepositedDesc = (a: FeederPoolState, b: FeederPoolState) => (getPoolDeposited(a) > getPoolDeposited(b) ? -1 : 1)

export const getVaultDeposited = (selectedSaveVersion: SaveVersion, massetState: MassetState): BigDecimal => {
  const {
    savingsContracts: {
      v1: { savingsBalance: saveV1Balance } = {},
      v2: { boostedSavingsVault, token: saveToken, latestExchangeRate: { rate: saveExchangeRate } = {} },
    },
  } = massetState

  return selectedSaveVersion === 1
    ? saveV1Balance.balance ?? BigDecimal.ZERO
    : (boostedSavingsVault?.account?.rawBalance ?? BigDecimal.ZERO)
        .add(saveToken?.balance ?? BigDecimal.ZERO)
        .mulTruncate(saveExchangeRate?.exact ?? BigDecimal.ONE.exact) ?? BigDecimal.ZERO
}

export const sortVaultsByDepositedDesc = (selectedSaveVersion: SaveVersion) => (a: MassetState, b: MassetState) =>
  getVaultDeposited(selectedSaveVersion, a).simple > getVaultDeposited(selectedSaveVersion, b).simple ? -1 : 1
