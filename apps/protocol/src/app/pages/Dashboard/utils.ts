import { ChainIds, getNetwork } from '@apps/base/context/network'
import { useFetchPriceCtx } from '@apps/base/context/prices'
import { BigDecimal } from '@apps/bigdecimal'
import { PoolType } from '@apps/data-provider'

import type { FeederPoolState, MassetState } from '@apps/data-provider'
import type { StakingRewardsExtended } from '@apps/masset-hooks'

import type { StakeData } from '../../context/FraxStakingProvider'

const {
  addresses: { WBTC, MTA },
} = getNetwork(ChainIds.EthereumMainnet)

export const useWBTCPrice = () => {
  const { fetchPrice } = useFetchPriceCtx()
  return fetchPrice(WBTC)
}
export const useMTAPrice = () => {
  const { fetchPrice } = useFetchPriceCtx()
  return fetchPrice(MTA)
}

export const getFraxRewards = (accountData?: StakeData) => {
  if (!accountData) return
  return accountData?.earned?.find(v => v?.symbol === 'MTA')?.amount?.simple ?? 0
}

export const getFraxDeposited = (accountData?: StakeData) => {
  if (!accountData) return
  const pool = accountData?.poolBalance?.simple || 0
  const vault = accountData?.lockedStakes?.reduce((a, b) => a + b?.liquidity?.simple, 0) || 0
  const total = pool + vault
  return {
    pool,
    vault,
    total,
  }
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

export const getSaveDeposited = (
  massetState: MassetState,
  mAssetPrice = 1,
  stakingRewards?: StakingRewardsExtended,
): { total: BigDecimal; save: BigDecimal; vault: BigDecimal } => {
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

  const vault = (() => {
    const polygonVault = stakingRewards?.stakedBalance?.mulTruncate(saveExchangeRate?.exact ?? BigDecimal.ONE.exact)

    const ethVault = (boostedSavingsVault?.account?.rawBalance ?? BigDecimal.ZERO)
      .mulTruncate(saveExchangeRate?.exact ?? BigDecimal.ONE.exact)
      .mulTruncate(BigDecimal.fromSimple(mAssetPrice).exact)

    return polygonVault ?? ethVault
  })()

  const total = save.add(vault)

  return {
    total,
    save,
    vault,
  }
}

export const filterByDeposited = (state: {
  massetState?: MassetState
  feederState?: FeederPoolState
  fraxState?: StakeData
  polygonRewards?: StakingRewardsExtended
}) => {
  const { massetState, feederState, fraxState, polygonRewards } = state
  if (massetState) return getSaveDeposited(massetState, 1, polygonRewards).total.simple > 0
  if (feederState) {
    const pools = getPoolDeposited(feederState)
    if (fraxState) {
      const frax = getFraxDeposited(fraxState)
      return pools.total + frax.total > 0
    }
    return pools.total > 0
  }
  return true
}

export const sortSaveByDepositedDesc = () => (a: MassetState, b: MassetState) =>
  getSaveDeposited(a).total.simple > getSaveDeposited(b).total.simple ? -1 : 1

export const isValidFeederPool = (fp: FeederPoolState): boolean => ![PoolType.Hidden].includes(fp.poolType)
