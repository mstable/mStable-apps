import type { BigDecimal } from '@apps/bigdecimal'

const SECONDS_IN_DAY = 60 * 60 * 24

export const calculateApy = (
  stakingTokenPrice?: number,
  rewardsTokenPrice?: number,
  rewardRate?: number,
  totalSupply?: BigDecimal,
): number | undefined => {
  if (!(stakingTokenPrice && rewardsTokenPrice && rewardRate && totalSupply)) return 0

  const rewardPerDayPerToken = (rewardRate * SECONDS_IN_DAY * rewardsTokenPrice) / totalSupply.simple

  return (rewardPerDayPerToken / stakingTokenPrice) * 365 * 100
}
