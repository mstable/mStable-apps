import { useSelectedMassetState } from '@apps/base/context/data'
import { useTokenSubscription } from '@apps/base/context/tokens'
import { useNetworkAddresses } from '@apps/base/context/network'
import { calculateApy, calculateBoost, getCoeffs, MAX_BOOST } from '@apps/quick-maths'
import { useFetchPriceCtx } from '@apps/base/context/prices'
import { BoostedCombinedAPY } from '@apps/types'

import { useSelectedMassetPrice } from './usePrice'
import { FetchState } from './useFetchState'

export const useFeederPoolApy = (poolAddress: string): FetchState<BoostedCombinedAPY> => {
  const massetState = useSelectedMassetState()
  const massetPrice = useSelectedMassetPrice()
  const useFetchPrice = useFetchPriceCtx()
  const networkAddresses = useNetworkAddresses()
  const vMta = useTokenSubscription(networkAddresses?.vMTA)

  const pool = massetState?.feederPools[poolAddress]
  const vault = pool?.vault
  const rewardsTokenPrice = useFetchPrice(vault?.rewardsToken.address)
  const platformTokenPrice = useFetchPrice(vault?.platformRewardsToken?.address)

  if (!pool || !vault || !massetPrice || rewardsTokenPrice.fetching) return { fetching: true }

  const rewardRateSimple = parseInt(vault.rewardRate.toString()) / 1e18

  if (rewardRateSimple.toString() === '0') return { fetching: true }

  const platformRewardRateSimple = vault.platformRewardRate ? parseInt(vault.platformRewardRate.toString()) / 1e18 : undefined

  const stakingTokenPrice = pool.price.simple * massetPrice

  const base = calculateApy(stakingTokenPrice, rewardsTokenPrice.value, rewardRateSimple, vault.totalSupply) as number
  const basePlatform = calculateApy(stakingTokenPrice, platformTokenPrice.value, platformRewardRateSimple, vault.totalSupply)

  const maxBoost = MAX_BOOST * base

  let userBoost = base
  let userBoostPlatform = basePlatform

  const coeffs = getCoeffs(vault)
  if (vault.account && vMta && coeffs) {
    const boost = calculateBoost(...coeffs, vault.account.rawBalance, vMta.balance)

    if (boost) {
      const boostedRewardRate = rewardRateSimple * boost

      userBoost = calculateApy(stakingTokenPrice, rewardsTokenPrice.value, boostedRewardRate, vault.totalSupply) as number
    }
  }

  const rewards = { base, userBoost, maxBoost }
  let combined = rewards

  let platformRewards
  if (basePlatform) {
    platformRewards = { base: basePlatform, userBoost: basePlatform, maxBoost: basePlatform }
    combined = {
      userBoost: rewards.userBoost + platformRewards.base,
      maxBoost: rewards.maxBoost + platformRewards.base,
      base: rewards.base + platformRewards.base,
    }
  }

  return {
    value: { rewards, platformRewards, combined },
  }
}
