import { useSelectedMassetState } from '@apps/base/context/data'
import { useTokenSubscription } from '@apps/base/context/tokens'
import { useNetworkAddresses } from '@apps/base/context/network'
import { calculateApy, calculateBoost, getCoeffs, MAX_BOOST } from '@apps/quick-maths'

import { useMtaPrice, useSelectedMassetPrice } from './usePrice'
import { FetchState } from './useFetchState'

export const useFeederPoolApy = (poolAddress: string): FetchState<{ base: number; maxBoost: number; userBoost: number }> => {
  const massetState = useSelectedMassetState()
  const massetPrice = useSelectedMassetPrice()
  const mtaPrice = useMtaPrice()
  const networkAddresses = useNetworkAddresses()
  const vMta = useTokenSubscription(networkAddresses?.vMTA)

  if (!massetState?.feederPools[poolAddress] || !massetPrice || !mtaPrice) return { fetching: true }

  const {
    price,
    vault: { rewardRate, totalSupply, account },
  } = massetState.feederPools[poolAddress]
  const rewardRateSimple = parseInt(rewardRate.toString()) / 1e18

  const stakingTokenPrice = price.simple * massetPrice

  const base = calculateApy(stakingTokenPrice, mtaPrice, rewardRateSimple, totalSupply) as number

  const maxBoost = MAX_BOOST * base

  let userBoost = base

  const { vault } = massetState.feederPools[poolAddress]
  const coeffs = getCoeffs(vault)
  if (account && vMta && coeffs) {
    const boost = calculateBoost(...coeffs, account.rawBalance, vMta.balance)

    if (boost) {
      const boostedRewardRate = rewardRateSimple * boost

      userBoost = calculateApy(stakingTokenPrice, mtaPrice, boostedRewardRate, totalSupply) as number
    }
  }

  return {
    value: { base, userBoost, maxBoost },
  }
}
