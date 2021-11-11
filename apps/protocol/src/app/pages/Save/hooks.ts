import { createRewardsEarnedContext, createStakingRewardsContext, createExchangeContext, createToggleContext } from '@apps/hooks'

export const [useOnboarding, OnboardingProvider] = createToggleContext(false)
export const [useStakingRewards, StakingRewardsProvider, stakingRewardsCtx] = createStakingRewardsContext()
export const [useRewardsEarned, RewardsEarnedProvider] = createRewardsEarnedContext(stakingRewardsCtx)
export const [useExchangeState, ExchangeStateProvider] = createExchangeContext()
