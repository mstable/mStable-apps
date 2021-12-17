import React, { FC, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { TokenIcon, TokenPair } from '@apps/base/components/core'
import { FeederPoolState } from '@apps/data-provider'
import { CountUp, CountUpUSD, Tooltip } from '@apps/dumb-components'
import { toK } from '@apps/formatters'
import { MassetName } from '@apps/types'
import { useFeederPoolApy } from '../../hooks/useFeederPoolApy'
import { useSelectedMassetPrice } from '../../hooks/useSelectedMassetPrice'
import { useUpsertStream } from './RewardsContext'
import { DashNameTableCell, DashTableCell, DashTableRow, RewardsApy } from './Styled'
import { getPoolDeposited } from './utils'
import { useSetSelectedMassetName } from '@apps/masset-provider'
import { useRewardStreams } from '../../context/RewardStreamsProvider'
import { useTokenSubscription } from '@apps/base/context/tokens'

export const PoolRow: FC<{ feederPool: FeederPoolState; showBalance: boolean }> = ({ feederPool, showBalance, ...rest }) => {
  const history = useHistory()
  const setSelectedMassetName = useSetSelectedMassetName()
  const mAssetName = feederPool.masset.token.symbol.toLowerCase() as MassetName
  const platformRewardsToken = feederPool.vault?.platformRewardsToken
  const feederPoolApy = useFeederPoolApy(feederPool.address, mAssetName)
  const massetPrice = useSelectedMassetPrice(mAssetName)
  const deposits = useMemo(() => getPoolDeposited(feederPool, massetPrice.value), [feederPool, massetPrice.value])
  const tvlPrice = useMemo(
    () => (massetPrice.value ? massetPrice.value * feederPool.price.simple : undefined),
    [feederPool.price.simple, massetPrice.value],
  )
  const rewards = useRewardStreams()
  const upsertStream = useUpsertStream()

  useTokenSubscription(feederPool?.fasset?.address)

  const baseApy = feederPoolApy?.value?.base || 0
  const rewardsBaseApy = feederPoolApy?.value?.rewards?.base || 0
  const rewardsMaxApy = feederPoolApy?.value?.rewards?.maxBoost || 0
  const userBoostApy = feederPoolApy?.value?.rewards?.userBoost || 0
  const platformRewardsApy = feederPoolApy?.value?.platformRewards || 0

  const balanceToolTip = `
    Pool: $${deposits.pool.toFixed(2)}<br />
    Vault: $${deposits.vault.toFixed(2)}
  `
  const userBoostTip = `
    Pool: ${baseApy.toFixed(2)}%<br />
    Vault Rewards:<br /> 
    ${userBoostApy.toFixed(2)}% MTA
    ${(platformRewardsApy > 0 && `<br />${platformRewardsApy.toFixed(2)}% ${platformRewardsToken?.symbol}`) || ''}
  `
  const apyTip = `
    Pool: ${baseApy.toFixed(2)}%<br />
    Vault Rewards:<br /> 
    ${rewardsBaseApy.toFixed(2)}-${rewardsMaxApy.toFixed(2)}% MTA
    ${(platformRewardsApy > 0 && `<br />${platformRewardsApy.toFixed(2)}% ${platformRewardsToken?.symbol}`) || ''}
  `

  const handleRowClick = () => {
    setSelectedMassetName(mAssetName)

    history.push(`/${mAssetName}/pools/${feederPool.address}`)
  }

  useEffect(() => {
    upsertStream(`pool-${feederPool.address}`, rewards)
  }, [feederPool.address, rewards, rewards?.amounts?.unlocked, upsertStream])

  const hasRewards = ((rewards?.amounts?.earned?.unlocked ?? 0) + rewards?.amounts?.unlocked ?? 0) > 0

  return (
    <DashTableRow {...rest} onClick={handleRowClick} buttonTitle="Explore">
      <DashNameTableCell>
        <TokenPair symbols={[feederPool.masset.token.symbol, feederPool.fasset.token.symbol]} isLarge={false} />
        {feederPool.title}
      </DashNameTableCell>
      <DashTableCell hasRewards={hasRewards}>
        {deposits.total > 0 ? (
          <Tooltip hideIcon tip={userBoostTip}>
            <CountUp end={baseApy || 0} suffix="%" />
            <RewardsApy active>
              <CountUp end={userBoostApy} suffix="%" prefix="+" />
              <TokenIcon symbol="MTA" />
            </RewardsApy>
            {!!feederPoolApy?.value?.platformRewards && (
              <RewardsApy>
                <CountUp end={platformRewardsApy} suffix="%" prefix="+" />
                <TokenIcon symbol={platformRewardsToken?.symbol} />
              </RewardsApy>
            )}
          </Tooltip>
        ) : feederPoolApy.value ? (
          <Tooltip hideIcon tip={apyTip}>
            <CountUp end={baseApy} suffix="%" />
            <RewardsApy>
              <CountUp end={rewardsBaseApy} prefix="+" />
              &nbsp;-&nbsp;
              <CountUp end={rewardsMaxApy} suffix="%" />
              <TokenIcon symbol="MTA" />
            </RewardsApy>
            {!!feederPoolApy?.value?.platformRewards && (
              <RewardsApy>
                <CountUp end={platformRewardsApy} suffix="%" prefix="+" />
                <TokenIcon symbol={platformRewardsToken?.symbol} />
              </RewardsApy>
            )}
          </Tooltip>
        ) : null}
      </DashTableCell>
      {showBalance && (
        <DashTableCell>
          <Tooltip tip={balanceToolTip} hideIcon>
            <CountUp end={deposits.total} prefix="$" />
          </Tooltip>
        </DashTableCell>
      )}
      <DashTableCell>
        <CountUpUSD end={feederPool.liquidity.simple} price={tvlPrice} formattingFn={toK} />
      </DashTableCell>
    </DashTableRow>
  )
}
