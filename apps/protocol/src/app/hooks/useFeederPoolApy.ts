import { useEffectOnce } from 'react-use'
import { MaticMainnet, useNetworkAddresses } from '@apps/base/context/network'
import { useFetchPriceCtx } from '@apps/base/context/prices'
import { useTokenSubscription } from '@apps/base/context/tokens'
import { FetchState, useFetchState, useSelectedMassetState } from '@apps/hooks'
import { calculateApy, calculateBoost, getCoeffs, MAX_BOOST } from '@apps/quick-maths'
import { BoostedCombinedAPY } from '@apps/types'

import { useSelectedMassetPrice } from './useSelectedMassetPrice'

const useFeederPoolApyVault = (poolAddress: string) => {
  const networkAddresses = useNetworkAddresses()
  const massetState = useSelectedMassetState()
  const massetPrice = useSelectedMassetPrice()
  const useFetchPrice = useFetchPriceCtx()
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

const useFeederPoolApyFrax = (poolAddress: string): FetchState<BoostedCombinedAPY> => {
  const massetState = useSelectedMassetState()
  const feederPool = massetState?.feederPools[poolAddress]

  const [rewards, setRewards] = useFetchState<BoostedCombinedAPY['rewards']>()

  useEffectOnce(() => {
    setRewards.fetching()
    fetch('https://api.frax.finance/pools')
      .then(res => {
        res
          .json()
          .then((json: { identifier: string; pairLink: string; apy?: string; apy_max?: string }[]) => {
            const poolData = json.find(p => p.identifier === 'mStable FRAX/mUSD')
            if (poolData) {
              setRewards.value({
                base: parseFloat(poolData.apy ?? '0'),
                maxBoost: parseFloat(poolData.apy_max ?? '0'),
                userBoost: 0,
              })
            }
          })
          .catch(setRewards.error)
      })
      .catch(setRewards.error)
  })

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
