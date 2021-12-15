import { ChainIds, getNetwork } from '@apps/base/context/network'
import { useFetchPriceCtx } from '@apps/base/context/prices'
import { BigDecimal } from '@apps/bigdecimal'
import { FeederPoolState, MassetState } from '@apps/data-provider'
import { SaveVersion } from '../../context/SelectedSaveVersionProvider'

const {
  addresses: { WBTC },
} = getNetwork(ChainIds.EthereumMainnet)

export const useWBTCPrice = () => {
  const { fetchPrice } = useFetchPriceCtx()

  return fetchPrice(WBTC)
}

export const getPoolDeposited = ({ token, vault, price }: FeederPoolState, mAssetPrice = 1) => {
  const fpTokenPrice = (price?.simple || 1) * mAssetPrice
  const userAmount = token?.balance?.simple ?? 0
  const userStakedAmount = vault?.account?.rawBalance?.simple ?? 0

  return (userStakedAmount + userAmount) * fpTokenPrice
}

export const sortPoolsByDepositedDesc = (a: FeederPoolState, b: FeederPoolState): number =>
  getPoolDeposited(a) > getPoolDeposited(b) ? -1 : 1

export const getVaultDeposited = (selectedSaveVersion: SaveVersion, massetState: MassetState, mAssetPrice = 1): BigDecimal => {
  const {
    savingsContracts: {
      v1: { savingsBalance: saveV1Balance } = {},
      v2: { boostedSavingsVault, token: saveToken, latestExchangeRate: { rate: saveExchangeRate } = {} },
    },
  } = massetState

  return (
    selectedSaveVersion === 1
      ? saveV1Balance?.balance ?? BigDecimal.ZERO
      : (boostedSavingsVault?.account?.rawBalance ?? BigDecimal.ZERO)
          .add(saveToken?.balance ?? BigDecimal.ZERO)
          .mulTruncate(saveExchangeRate?.exact ?? BigDecimal.ONE.exact) ?? BigDecimal.ZERO
  ).mulTruncate(BigDecimal.fromSimple(mAssetPrice).exact)
}

export const sortVaultsByDepositedDesc = (selectedSaveVersion: SaveVersion) => (a: MassetState, b: MassetState) =>
  getVaultDeposited(selectedSaveVersion, a).simple > getVaultDeposited(selectedSaveVersion, b).simple ? -1 : 1
