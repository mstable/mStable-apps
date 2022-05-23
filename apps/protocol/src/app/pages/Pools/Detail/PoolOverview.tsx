import { useCallback, useLayoutEffect, useMemo, useState } from 'react'

import { CardButton as Button, CardContainer as Card, CountUp, DifferentialCountup, Tooltip, TransitionCard } from '@apps/dumb-components'
import styled from 'styled-components'

import { PokeBoost } from '../../../components/PokeBoost'
import { UserBoost } from '../../../components/rewards/UserBoost'
import { useRewardStreams } from '../../../context/RewardStreamsProvider'
import { useFeederPoolApy } from '../../../hooks/useFeederPoolApy'
import { useSelectedMassetPrice } from '../../../hooks/useSelectedMassetPrice'
import { useSelectedFeederPoolState } from '../FeederPoolProvider'
import { LiquidityMessage } from './LiquidityMessage'
import { Position } from './Position'
import { UserRewards } from './UserRewards'

import type { FC, ReactElement } from 'react'

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

const Container = styled.div`
  > div {
    margin-bottom: 1.25rem;
  }
`

export const PoolOverview: FC = () => {
  const [selection, setSelection] = useState<Selection | undefined>()
  const feederPool = useSelectedFeederPoolState()
  const rewardStreams = useRewardStreams()
  const apy = useFeederPoolApy(feederPool.address)
  const massetPrice = useSelectedMassetPrice()

  const { vault, token, price } = feederPool

  const fpTokenPrice = price.simple * (massetPrice.value ?? 1)
  const userAmount = token.balance?.simple ?? 0
  const userStakedAmount = vault?.account?.rawBalance.simple ?? 0
  const totalUserBalance = (userStakedAmount + userAmount) * fpTokenPrice
  const totalLocked = rewardStreams?.amounts.locked ?? 0

  const totalEarned = useMemo(() => {
    const { amounts } = rewardStreams ?? {}
    if (!amounts) return 0
    const { earned, previewLocked, locked, unlocked } = amounts
    return earned?.unlocked + previewLocked + locked + unlocked
  }, [rewardStreams])

  const showLiquidityMessage = totalEarned === 0 && totalLocked === 0

  const handleSelection = useCallback((newValue?: Selection) => setSelection(selection === newValue ? undefined : newValue), [selection])

  useLayoutEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  return showLiquidityMessage ? (
    <LiquidityMessage />
  ) : (
    <Container>
      <TransitionCard components={components} selection={selection}>
        <Card>
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
            <h3>{vault?.rewardsToken.symbol} Rewards</h3>
            <div>
              <CountUp end={totalEarned} suffix={` ${vault?.rewardsToken.symbol}`} />
              <Tooltip tip={`${vault?.rewardsToken.symbol} rewards unlock over time`} />
            </div>
          </Button>
          {!!rewardStreams.amounts.platform && (
            <Button active={false} disabled>
              <h3>{vault?.platformRewardsToken?.symbol} Rewards</h3>
              <div>
                <CountUp end={rewardStreams.amounts.platform} suffix={` ${vault?.platformRewardsToken?.symbol}`} />
                <Tooltip tip={`${vault?.platformRewardsToken?.symbol} rewards can be claimed immediately`} />
              </div>
            </Button>
          )}
        </Card>
      </TransitionCard>
      <PokeBoost apy={apy} vault={vault} />
    </Container>
  )
}
