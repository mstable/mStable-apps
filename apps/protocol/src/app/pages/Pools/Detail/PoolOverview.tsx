import React, { FC, ReactElement, useCallback, useState } from 'react'

import {
  CountUp,
  DifferentialCountup,
  TransitionCard,
  Tooltip,
  CardContainer as Container,
  CardButton as Button,
} from '@apps/components/core'

import { useRewardStreams } from '../../../context/RewardStreamsProvider'
import { UserBoost } from '../../../components/rewards/UserBoost'
import { useSelectedMassetPrice } from '../../../hooks/useSelectedMassetPrice'
import { useFeederPoolApy } from '../../../hooks/useFeederPoolApy'
import { useSelectedFeederPoolState } from '../FeederPoolProvider'
import { Position } from './Position'
import { UserRewards } from './UserRewards'
import { LiquidityMessage } from './LiquidityMessage'

enum Selection {
  Stake = 'stake',
  Boost = 'boost',
  Rewards = 'rewards',
}

const { Stake, Boost, Rewards } = Selection

const UserVaultBoost: FC = () => {
  const feederPool = useSelectedFeederPoolState()
  const apy = useFeederPoolApy(feederPool.address)
  return <UserBoost vault={feederPool.vault} apy={apy} />
}

const components: Record<string, ReactElement> = {
  [Stake]: <Position />,
  [Boost]: <UserVaultBoost />,
  [Rewards]: <UserRewards />,
}

export const PoolOverview: FC = () => {
  const [selection, setSelection] = useState<Selection | undefined>()

  const feederPool = useSelectedFeederPoolState()
  const rewardStreams = useRewardStreams()
  const apy = useFeederPoolApy(feederPool.address)
  const massetPrice = useSelectedMassetPrice()

  const { vault, token, price } = feederPool

  const fpTokenPrice = price.simple * (massetPrice.value ?? 1)
  const userAmount = token.balance?.simple ?? 0
  const userStakedAmount = vault.account?.rawBalance.simple ?? 0
  const totalUserBalance = (userStakedAmount + userAmount) * fpTokenPrice
  const totalLocked = rewardStreams?.amounts.locked ?? 0
  const totalEarned =
    (rewardStreams?.amounts.earned.unlocked ?? 0) + (rewardStreams?.amounts.previewLocked ?? 0) + (rewardStreams?.amounts.locked ?? 0)

  const showLiquidityMessage = totalEarned === 0 && totalLocked === 0

  const handleSelection = useCallback((newValue?: Selection) => setSelection(selection === newValue ? undefined : newValue), [selection])

  return showLiquidityMessage ? (
    <LiquidityMessage />
  ) : (
    <TransitionCard components={components} selection={selection}>
      <Container>
        <Button active={selection === Stake} onClick={() => handleSelection(Stake)}>
          <h3>Balance</h3>
          <CountUp end={totalUserBalance} prefix="$" />
        </Button>
        <Button active={selection === Boost} onClick={() => handleSelection(Boost)}>
          <h3>Rewards APY</h3>
          {apy.value?.rewards.userBoost ? (
            <DifferentialCountup prev={apy.value.rewards.base} end={apy.value.rewards.userBoost} suffix="%" />
          ) : (
            <CountUp end={apy.value?.rewards.base ?? 0} suffix="%" />
          )}
        </Button>
        <Button active={selection === Rewards} onClick={() => handleSelection(Rewards)}>
          <h3>Rewards</h3>
          <div>
            <CountUp end={totalEarned} suffix={` ${vault.rewardsToken.symbol}`} />
            <Tooltip tip={`${vault.rewardsToken.symbol} rewards unlock over time`} />
          </div>
        </Button>
        {apy.value?.platformRewards && (
          <Button active={false} disabled>
            <h3>Platform APY</h3>
            <div>
              <CountUp end={apy.value.platformRewards} suffix="%" />
              <Tooltip tip={`${vault.platformRewardsToken?.symbol} rewards are claimed immediately`} />
            </div>
          </Button>
        )}
        {apy.value?.base && (
          <Button active={false} disabled>
            <h3>Base APY</h3>
            <div>
              <CountUp end={apy.value.base} suffix="%" />
              <Tooltip tip="Base APY represents the increase in the value of the pool token over time" />
            </div>
          </Button>
        )}
      </Container>
    </TransitionCard>
  )
}
