import { ChainIds, getNetwork } from '@apps/base/context/network'
import { useFetchPriceCtx } from '@apps/base/context/prices'
import { BigDecimal } from '@apps/bigdecimal'
import { FeederPoolState, MassetState } from '@apps/data-provider'

const {
  addresses: { WBTC },
} = getNetwork(ChainIds.EthereumMainnet)

export const useWBTCPrice = () => {
  const { fetchPrice } = useFetchPriceCtx()

  return fetchPrice(WBTC)
}

export const getPoolDeposited = ({ token, vault: _vault, price }: FeederPoolState, mAssetPrice = 1) => {
  const fpTokenPrice = (price?.simple || 1) * mAssetPrice
  const pool = (token?.balance?.simple ?? 0) * fpTokenPrice
  const vault = (_vault?.account?.rawBalance?.simple ?? 0) * fpTokenPrice
  const total = pool + vault

  return {
    total,
    pool,
    vault,
  }
}

export const sortPoolsByDepositedDesc = (a: FeederPoolState, b: FeederPoolState): number =>
  getPoolDeposited(a) > getPoolDeposited(b) ? -1 : 1

export const getSaveDeposited = (massetState: MassetState, mAssetPrice = 1): { total: BigDecimal; save: BigDecimal; vault: BigDecimal } => {
  const {
    savingsContracts: {
      v2: { boostedSavingsVault, token: saveToken, latestExchangeRate: { rate: saveExchangeRate } = {} },
    },
  } = massetState

  if (!massetState)
    return {
      total: BigDecimal.ZERO,
      save: BigDecimal.ZERO,
      vault: BigDecimal.ZERO,
    }

  const save = (saveToken?.balance ?? BigDecimal.ZERO)
    .mulTruncate(saveExchangeRate?.exact ?? BigDecimal.ONE.exact)
    .mulTruncate(BigDecimal.fromSimple(mAssetPrice).exact)

  const vault = (boostedSavingsVault?.account?.rawBalance ?? BigDecimal.ZERO)
    .mulTruncate(saveExchangeRate?.exact ?? BigDecimal.ONE.exact)
    .mulTruncate(BigDecimal.fromSimple(mAssetPrice).exact)

  const total = save.add(vault)

  return {
    total,
    save,
    vault,
  }
}

export const sortSaveByDepositedDesc = () => (a: MassetState, b: MassetState) =>
  getSaveDeposited(a).total.simple > getSaveDeposited(b).total.simple ? -1 : 1
