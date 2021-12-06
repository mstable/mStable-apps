import { TokenPair } from '@apps/base/components/core'
import { FeederPoolState } from '@apps/data-provider'
import { CountUp, CountUpUSD } from '@apps/dumb-components'
import { toK } from '@apps/formatters'
import { MassetName } from '@apps/types'
import React, { FC, useMemo } from 'react'
import { useFeederPoolApy } from '../../hooks/useFeederPoolApy'
import { useSelectedMassetPrice } from '../../hooks/useSelectedMassetPrice'
import { useSubscribeRewardStream } from './RewardsContext'
import { DashNameTableCell, DashTableCell, DashTableRow } from './Styled'
import { getPoolDeposited } from './utils'

export const PoolRow: FC<{ feederPool: FeederPoolState }> = ({ feederPool, ...rest }) => {
  const mAssetName = feederPool.masset.token.symbol.toLowerCase() as MassetName
  const feederPoolApy = useFeederPoolApy(feederPool.address, mAssetName)
  const massetPrice = useSelectedMassetPrice(mAssetName)
  const deposited = useMemo(() => getPoolDeposited(feederPool, massetPrice.value), [feederPool, massetPrice.value])
  const tvlPrice = useMemo(
    () => (massetPrice.value ? massetPrice.value * feederPool.price.simple : undefined),
    [feederPool.price.simple, massetPrice.value],
  )
  useSubscribeRewardStream(`pool-${feederPool.address}`)

  return (
    <DashTableRow {...rest}>
      <DashNameTableCell>
        <TokenPair symbols={[feederPool.masset.token.symbol, feederPool.fasset.token.symbol]} isLarge={false} />
        {feederPool.title}
      </DashNameTableCell>
      <DashTableCell>
        {deposited > 0 ? (
          <CountUp end={feederPoolApy?.value?.rewards?.maxBoost || 0} suffix="%" />
        ) : feederPoolApy.value ? (
          <>
            <CountUp end={feederPoolApy?.value?.rewards?.base || 0} />
            &nbsp;-&nbsp;
            <CountUp end={feederPoolApy?.value?.rewards?.maxBoost || 0} suffix="%" />
          </>
        ) : null}
      </DashTableCell>
      <DashTableCell>
        <CountUp end={deposited} prefix="$" />
      </DashTableCell>
      <DashTableCell>
        <CountUpUSD end={feederPool.liquidity.simple} price={tvlPrice} formattingFn={toK} />
      </DashTableCell>
    </DashTableRow>
  )
}
