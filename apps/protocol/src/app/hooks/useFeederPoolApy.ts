import { useTokenSubscription } from '@apps/base/context/tokens'
import { useNetworkAddresses } from '@apps/base/context/network'
import { calculateApy, calculateBoost, getCoeffs, MAX_BOOST } from '@apps/quick-maths'
import { useFetchPriceCtx } from '@apps/base/context/prices'
import { BoostedCombinedAPY } from '@apps/types'
import { FetchState, useSelectedMassetState } from '@apps/hooks'

import { useSelectedMassetPrice } from './useSelectedMassetPrice'

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

  if (!pool || !vault || !massetPrice.value || rewardsTokenPrice.fetching) return { fetching: true }

  const rewardRateSimple = parseInt(vault.rewardRate.toString()) / 1e18

  if (rewardRateSimple.toString() === '0') return { fetching: true }

  const platformRewardRateSimple = vault.platformRewardRate ? parseInt(vault.platformRewardRate.toString()) / 1e18 : undefined

  const stakingTokenPrice = pool.price.simple * massetPrice.value

  const baseRewards = calculateApy(stakingTokenPrice, rewardsTokenPrice.value, rewardRateSimple, vault.totalSupply) as number
  const platformRewards = calculateApy(stakingTokenPrice, platformTokenPrice.value, platformRewardRateSimple, vault.totalRaw)

  const maxBoost = MAX_BOOST * baseRewards

  let userBoost = baseRewards

  const coeffs = getCoeffs(vault)
  if (vault.account && vMta && coeffs) {
    const boost = calculateBoost(...coeffs, vault.account.rawBalance, vMta.balance)

    if (boost) {
      const boostedRewardRate = rewardRateSimple * boost

      userBoost = calculateApy(stakingTokenPrice, rewardsTokenPrice.value, boostedRewardRate, vault.totalSupply) as number
    }
  }

  const rewards = { base: baseRewards, userBoost, maxBoost }

  return {
    value: { rewards, platformRewards, base: pool.dailyApy },
  }
}
