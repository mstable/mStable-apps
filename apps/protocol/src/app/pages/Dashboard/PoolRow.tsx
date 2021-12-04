import { TokenPair } from '@apps/base/components/core'
import { BigDecimal } from '@apps/bigdecimal'
import { FeederPoolState } from '@apps/data-provider'
import { CountUp, CountUpUSD } from '@apps/dumb-components'
import { toK } from '@apps/formatters'
import { useFeederPool } from '@apps/masset-hooks'
import React, { FC, useEffect } from 'react'
import Skeleton from 'react-loading-skeleton'
import { MassetName } from '@apps/types'
import { useFeederPoolApy } from '../../hooks/useFeederPoolApy'
import { useSelectedMassetPrice } from '../../hooks/useSelectedMassetPrice'
import { useSetDeposit } from './BalanceProvider'
import { DashNameTableCell, DashTableCell, DashTableRow } from './Styled'

export const PoolRow: FC<{ address: string; mAssetName: MassetName }> = ({ address, mAssetName, ...rest }) => {
  const feederPool = useFeederPool(address, mAssetName) as FeederPoolState
  const feederPoolApy = useFeederPoolApy(address, mAssetName)
  const massetPrice = useSelectedMassetPrice(mAssetName)
  const setDeposit = useSetDeposit()

  const { vault, token, price } = feederPool

  const fpTokenPrice = price.simple * (massetPrice.value ?? 1)
  const userAmount = token.balance?.simple ?? 0
  const userStakedAmount = vault?.account?.rawBalance.simple ?? 0
  const totalUserBalance = (userStakedAmount + userAmount) * fpTokenPrice
  const tvlPrice = massetPrice.value ? massetPrice.value * feederPool.price.simple : undefined

  useEffect(() => {
    if (totalUserBalance > 0) {
      setDeposit(`${feederPool.title}-${address}`, BigDecimal.fromSimple(totalUserBalance))
    }
  }, [address, feederPool.title, setDeposit, totalUserBalance])

  if (!feederPool) return <Skeleton height={200} />

  return (
    <DashTableRow {...rest}>
      <DashNameTableCell>
        <TokenPair symbols={[feederPool.masset.token.symbol, feederPool.fasset.token.symbol]} isLarge={false} />
        {feederPool.title}
      </DashNameTableCell>
      <DashTableCell>
        {totalUserBalance > 0 ? (
          <CountUp end={feederPoolApy.value.rewards.maxBoost} suffix="%" />
        ) : feederPoolApy.value ? (
          <>
            <CountUp end={feederPoolApy.value?.rewards.base ?? 0} />
            &nbsp;-&nbsp;
            <CountUp end={feederPoolApy.value?.rewards.maxBoost ?? 0} suffix="%" />
          </>
        ) : null}
      </DashTableCell>
      <DashTableCell>
        <CountUp end={totalUserBalance} prefix="$" />
      </DashTableCell>
      <DashTableCell>
        <CountUpUSD end={feederPool.liquidity.simple} price={tvlPrice} formattingFn={toK} />
      </DashTableCell>
    </DashTableRow>
  )
}
