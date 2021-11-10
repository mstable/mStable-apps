import { createExchangeContext } from '@apps/hooks'
import { createRewardsEarnedContext, createStakingRewardsContext } from '@apps/masset-hooks'
import { createToggleContext } from '@apps/context-utils'

export const [useOnboarding, OnboardingProvider] = createToggleContext(false)
export const [useStakingRewards, StakingRewardsProvider, stakingRewardsCtx] = createStakingRewardsContext()
export const [useRewardsEarned, RewardsEarnedProvider] = createRewardsEarnedContext(stakingRewardsCtx)
export const [useExchangeState, ExchangeStateProvider] = createExchangeContext()
