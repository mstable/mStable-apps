import { MaticMainnet, useNetworkAddresses } from '@apps/base/context/network'
import { useFetchPriceCtx } from '@apps/base/context/prices'
import { calculateApy } from '@apps/quick-maths'
import { useSelectedMassetState, calculateBoost, getPriceCoeff, MAX_BOOST, useVMTABalance } from '@apps/base/hooks'
import { BoostedCombinedAPY, FetchState } from '@apps/types'

import { useFraxStakingState } from '../context/FraxStakingProvider'
import { useSelectedMassetPrice } from './useSelectedMassetPrice'

const useFeederPoolApyVault = (poolAddress: string) => {
  const massetState = useSelectedMassetState()
  const massetPrice = useSelectedMassetPrice()
  const { fetchPrices } = useFetchPriceCtx()
  const vMTABalance = useVMTABalance()

  const pool = massetState?.feederPools[poolAddress]
  const vault = pool?.vault

  const tokenPrices = fetchPrices([vault?.rewardsToken.address, vault?.platformRewardsToken?.address])
  const rewardsTokenPrice = tokenPrices[vault?.rewardsToken.address]
  const platformTokenPrice = tokenPrices[vault?.platformRewardsToken?.address]

  if (!pool || !vault || !massetPrice.value || !rewardsTokenPrice) return { fetching: true }

  const rewardRateSimple = parseInt(vault.rewardRate.toString()) / 1e18

  if (rewardRateSimple.toString() === '0') return { fetching: true }

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
  const feederPoolApyFrax = useFeederPoolApyFrax(poolAddress)
  const feederPoolApyVault = useFeederPoolApyVault(poolAddress)
  if (poolAddress && (networkAddresses as MaticMainnet['addresses']).FRAX?.feederPool === poolAddress) {
    return feederPoolApyFrax
  }

  return feederPoolApyVault
}
