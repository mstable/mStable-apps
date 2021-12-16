import React, { FC, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { TokenIcon, TokenPair } from '@apps/base/components/core'
import { FeederPoolState } from '@apps/data-provider'
import { CountUp, CountUpUSD, Tooltip } from '@apps/dumb-components'
import { toK } from '@apps/formatters'
import { MassetName } from '@apps/types'
import { useFeederPoolApy } from '../../hooks/useFeederPoolApy'
import { useSelectedMassetPrice } from '../../hooks/useSelectedMassetPrice'
import { useSubscribeRewardStream } from './RewardsContext'
import { DashNameTableCell, DashTableCell, DashTableRow, RewardsApy } from './Styled'
import { getPoolDeposited } from './utils'
import { useSetSelectedMassetName } from '@apps/masset-provider'

export const PoolRow: FC<{ feederPool: FeederPoolState; showBalance: boolean }> = ({ feederPool, showBalance, ...rest }) => {
  const history = useHistory()
  const setSelectedMassetName = useSetSelectedMassetName()
  const mAssetName = feederPool.masset.token.symbol.toLowerCase() as MassetName
  const platformRewardsToken = feederPool.vault?.platformRewardsToken
  const feederPoolApy = useFeederPoolApy(feederPool.address, mAssetName)
  const massetPrice = useSelectedMassetPrice(mAssetName)
  const deposited = useMemo(() => getPoolDeposited(feederPool, massetPrice.value), [feederPool, massetPrice.value])
  const tvlPrice = useMemo(
    () => (massetPrice.value ? massetPrice.value * feederPool.price.simple : undefined),
    [feederPool.price.simple, massetPrice.value],
  )
  useSubscribeRewardStream(`pool-${feederPool.address}`)

  const baseApy = feederPoolApy?.value?.base || 0
  const rewardsBaseApy = feederPoolApy?.value?.rewards?.base || 0
  const rewardsMaxApy = feederPoolApy?.value?.rewards?.maxBoost || 0
  const userBoostApy = feederPoolApy?.value?.rewards?.userBoost || 0
  const platformRewardsApy = feederPoolApy?.value?.platformRewards || 0

  const userBoostTip = `Combined APY<br>Pool: ${baseApy.toFixed(2)}%<br>Vault Rewards: ${userBoostApy.toFixed(2)}%`

  const handleRowClick = () => {
    setSelectedMassetName(mAssetName)

    history.push(`/${mAssetName}/pools/${feederPool.address}`)
  }

  return (
    <DashTableRow {...rest} onClick={handleRowClick} buttonTitle="Explore">
      <DashNameTableCell>
        <TokenPair symbols={[feederPool.masset.token.symbol, feederPool.fasset.token.symbol]} isLarge={false} />
        {feederPool.title}
      </DashNameTableCell>
      <DashTableCell>
        {deposited > 0 ? (
          <Tooltip hideIcon tip={userBoostTip}>
            <CountUp end={baseApy || 0} suffix="%" />
            <RewardsApy active>
              <CountUp end={userBoostApy} suffix="%" />
              <TokenIcon symbol="MTA" />
            </RewardsApy>
          </Tooltip>
        ) : feederPoolApy.value ? (
          <div>
            <CountUp end={baseApy} suffix="%" />
            <RewardsApy>
              <CountUp end={rewardsBaseApy} />
              &nbsp;-&nbsp;
              <CountUp end={rewardsMaxApy} suffix="%" />
              <TokenIcon symbol="MTA" />
            </RewardsApy>
            {!!feederPoolApy?.value?.platformRewards && (
              <RewardsApy>
                <CountUp end={platformRewardsApy} />
                <TokenIcon symbol={platformRewardsToken?.symbol} />
              </RewardsApy>
            )}
          </div>
        ) : null}
      </DashTableCell>
      {showBalance && (
        <DashTableCell>
          <CountUp end={deposited} prefix="$" />
        </DashTableCell>
      )}
      <DashTableCell>
        <CountUpUSD end={feederPool.liquidity.simple} price={tvlPrice} formattingFn={toK} />
      </DashTableCell>
    </DashTableRow>
  )
}
