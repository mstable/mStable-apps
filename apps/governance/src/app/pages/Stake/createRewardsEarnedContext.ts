import { useTokenSubscription } from '@apps/base/context/tokens'
import { Context, createContext, FC, useState } from 'react'
import { useInterval } from 'react-use'
import { BigNumber } from 'ethers'
import { getUnixTime } from 'date-fns'

import { BigDecimal } from '@apps/bigdecimal'
import { createUseContextFn, providerFactory } from '@apps/context-utils'
import { SCALE } from '@apps/types'

import { useStakedTokenQuery } from '../../context/StakedToken'

export interface RewardsEarned {
  canClaim?: boolean
  rewards: number
}

export const createRewardsEarnedContext = (): Readonly<[() => RewardsEarned, FC, Context<RewardsEarned>]> => {
  const context = createContext<RewardsEarned>(null as never)

  const RewardEarnedProvider: FC = ({ children }) => {
    const stakedTokenQuery = useStakedTokenQuery()
    const stakedTokenData = stakedTokenQuery.data?.stakedToken
    const stakedToken = useTokenSubscription(stakedTokenData?.id)
    const stakedTokenBalance = stakedToken?.balance

    const [value, setValue] = useState<RewardsEarned>({ rewards: 0 })

    useInterval(() => {
      if (!(stakedTokenBalance && stakedTokenData?.stakingRewards && stakedTokenData.accounts?.[0])) {
        return setValue({ rewards: 0 })
      }

      const {
        stakingRewards: { lastUpdateTime, periodFinish, rewardPerTokenStored: _rewardPerTokenStored, rewardRate, rewardsToken },
        token: {
          totalSupply: { bigDecimal: totalTokens },
        },
        accounts: [{ rewards: _rewards, rewardPerTokenPaid }],
      } = stakedTokenData

      // TODO as @client Apollo fields
      const rewardPerTokenStored = BigNumber.from(_rewardPerTokenStored)
      const rewards = BigNumber.from(_rewards)

      const rewardPerToken = (() => {
        if (totalTokens.exact.eq(0)) {
          // If there is no StakingToken liquidity, avoid div(0)
          return rewardPerTokenStored
        }

        const lastTimeRewardApplicable = Math.min(periodFinish, getUnixTime(Date.now()))

        const timeSinceLastUpdate = lastTimeRewardApplicable - lastUpdateTime

        // New reward units to distribute = rewardRate * timeSinceLastUpdate
        const rewardUnitsToDistribute = BigNumber.from(rewardRate).mul(timeSinceLastUpdate)

        // New reward units per token = (rewardUnitsToDistribute * 1e18) / totalTokens
        const unitsToDistributePerToken = rewardUnitsToDistribute.mul(SCALE).div(totalTokens.exact)

        return rewardPerTokenStored.add(unitsToDistributePerToken)
      })()

      // Current rate per token - rate user previously received
      const userRewardDelta = rewardPerToken.sub(rewardPerTokenPaid)

      if (userRewardDelta.eq(0)) {
        return { rewards: new BigDecimal(rewards).simple, canClaim: rewards.gt(0) }
      }

      // New reward = staked tokens * difference in rate
      const userNewReward = stakedTokenBalance.mulTruncate(userRewardDelta)

      // Add to previous rewards
      const summedRewards = rewards.add(userNewReward.exact)

      return setValue({
        canClaim: summedRewards.gt(0),
        rewards: new BigDecimal(summedRewards).simple,
      })
    }, 5e3)

    return providerFactory(context, { value }, children)
  }

  return [createUseContextFn(context), RewardEarnedProvider, context] as const
}
