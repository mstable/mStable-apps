import { FeederPoolState, PoolType, useDataState } from '@apps/data-provider'
import React, { useMemo } from 'react'
import { PoolRow } from './PoolRow'
import { Card, DashTable, Title } from './Styled'
import { sortPoolsByDepositedDesc } from './utils'

const headerTitles = ['', 'APY(%)', 'Deposited', 'TVL'].map(t => ({ title: t }))

const isValidPool = (fp: FeederPoolState): boolean => ![PoolType.Hidden, PoolType.Deprecated].includes(fp.poolType)

export const Pools = () => {
  const dataState = useDataState()

  const pools = useMemo(
    () =>
      Object.values(dataState)
        .reduce((acc, curr) => [...acc, ...Object.values(curr.feederPools).filter(isValidPool)], [])
        .sort(sortPoolsByDepositedDesc),
    [dataState],
  )

  return (
    <div>
      <Title>Pools</Title>
      <Card>
        <DashTable headerTitles={headerTitles}>
          {pools.map((feederPool: FeederPoolState) => (
            <PoolRow key={feederPool.address} feederPool={feederPool} />
          ))}
        </DashTable>
      </Card>
    </div>
  )
}
