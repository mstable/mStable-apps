import { MaticMainnet, useNetworkAddresses } from '@apps/base/context/network'
import { useFetchPriceCtx } from '@apps/base/context/prices'
import { FetchState, useSelectedMassetState } from '@apps/hooks'
import { calculateApy, calculateBoost, getPriceCoeff, MAX_BOOST } from '@apps/quick-maths'
import { BoostedCombinedAPY } from '@apps/types'
import { useVMTABalance } from 'libs/hooks/src/lib/useVMTABalance'

import { useFraxStakingState } from '../context/FraxStakingProvider'
import { useSelectedMassetPrice } from './useSelectedMassetPrice'

const useFeederPoolApyVault = (poolAddress: string) => {
  const massetState = useSelectedMassetState()
  const massetPrice = useSelectedMassetPrice()
  const useFetchPrice = useFetchPriceCtx()
  const vMTABalance = useVMTABalance()

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

  const priceCoeff = getPriceCoeff(vault)
  if (vault.account && vMTABalance && priceCoeff) {
    const boost = calculateBoost(priceCoeff, vault.account.rawBalance, vMTABalance)

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

const useFeederPoolApyFrax = (poolAddress: string): FetchState<BoostedCombinedAPY> => {
  const massetState = useSelectedMassetState()
  const feederPool = massetState?.feederPools[poolAddress]

  const { rewards } = useFraxStakingState()

  if (!feederPool || !rewards.value) return { fetching: true }

  return {
    value: { rewards: rewards.value, base: feederPool.dailyApy },
  }
}

export const useFeederPoolApy = (poolAddress: string): FetchState<BoostedCombinedAPY> => {
  const networkAddresses = useNetworkAddresses()
  if (poolAddress && (networkAddresses as MaticMainnet['addresses']).FRAX?.feederPool === poolAddress) {
    return useFeederPoolApyFrax(poolAddress)
  }

  return useFeederPoolApyVault(poolAddress)
}
