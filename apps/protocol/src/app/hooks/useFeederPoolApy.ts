import { useNetworkAddresses } from '@apps/base/context/network'
import { useFetchPriceCtx } from '@apps/base/context/prices'
import { calculateBoost, getPriceCoeff, MAX_BOOST, useVMTABalance } from '@apps/boost'
import { useSelectedMassetState } from '@apps/masset-hooks'
import { calculateApy } from '@apps/quick-maths'

import { useFraxStakingState } from '../context/FraxStakingProvider'
import { useSelectedMassetPrice } from './useSelectedMassetPrice'

import type { MaticMainnet } from '@apps/base/context/network'
import type { BoostedCombinedAPY, FetchState, MassetName } from '@apps/types'

const useFeederPoolApyVault = (poolAddress: string, mAssetName?: MassetName) => {
  const massetState = useSelectedMassetState(mAssetName)
  const massetPrice = useSelectedMassetPrice(mAssetName)
  const { fetchPrices } = useFetchPriceCtx()
  const vMTABalance = useVMTABalance()

  const pool = massetState?.feederPools[poolAddress]
  const vault = pool?.vault

  const tokenPrices = fetchPrices([vault?.rewardsToken.address, vault?.platformRewardsToken?.address])
  const rewardsTokenPrice = tokenPrices[vault?.rewardsToken.address]
  const platformTokenPrice = tokenPrices[vault?.platformRewardsToken?.address]

  if (!pool || !vault || !massetPrice.value || !rewardsTokenPrice) return { fetching: true }

  let rewardRateSimple = parseInt(vault.rewardRate.toString()) / 1e18

  if (rewardRateSimple.toString() === '0') return { fetching: true }

  // Rewards are empty if the last time the rewardsRate was updated longer than 7 days
  const minLastRewardReceivedTime = Date.now() / 1000 - 7 * 24 * 3600
  if (vault.rewardAddedTransactions[0] && Number(vault.rewardAddedTransactions[0].timestamp) < minLastRewardReceivedTime) {
    rewardRateSimple = 0
  }

  const platformRewardRateSimple = vault.platformRewardRate ? parseInt(vault.platformRewardRate.toString()) / 1e18 : undefined

  const stakingTokenPrice = pool.price.simple * massetPrice.value

  const baseRewards = calculateApy(stakingTokenPrice, rewardsTokenPrice, rewardRateSimple, vault.totalSupply) as number
  const platformRewards = calculateApy(stakingTokenPrice, platformTokenPrice, platformRewardRateSimple, vault.totalRaw)

  const maxBoost = MAX_BOOST * baseRewards

  let userBoost = baseRewards

  const priceCoeff = getPriceCoeff(vault)
  if (vault.account && vMTABalance && priceCoeff) {
    const boost = calculateBoost(priceCoeff, vault.account.rawBalance, vMTABalance)

    if (boost) {
      const boostedRewardRate = rewardRateSimple * boost
      userBoost = calculateApy(stakingTokenPrice, rewardsTokenPrice, boostedRewardRate, vault.totalSupply) as number
    }
  }

  const rewards = { base: baseRewards, userBoost, maxBoost }

  return {
    value: { rewards, platformRewards, base: pool.dailyApy },
  }
}

const useFeederPoolApyFrax = (poolAddress: string, mAssetName?: MassetName): FetchState<BoostedCombinedAPY> => {
  const massetState = useSelectedMassetState(mAssetName)
  const feederPool = massetState?.feederPools[poolAddress]

  const { rewards } = useFraxStakingState()

  if (!feederPool || !rewards.value) return { fetching: true }

  return {
    value: { rewards: rewards.value, base: feederPool.dailyApy },
  }
}

export const useFeederPoolApy = (poolAddress: string, mAssetName?: MassetName): FetchState<BoostedCombinedAPY> => {
  const networkAddresses = useNetworkAddresses()
  const feederPoolApyFrax = useFeederPoolApyFrax(poolAddress, mAssetName)
  const feederPoolApyVault = useFeederPoolApyVault(poolAddress, mAssetName)
  if (poolAddress && (networkAddresses as MaticMainnet['addresses']).FRAX?.feederPool === poolAddress) {
    return feederPoolApyFrax
  }

  return feederPoolApyVault
}
