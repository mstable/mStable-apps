import { FeederPoolState, PoolType, useDataState } from '@apps/data-provider'
import React, { useMemo } from 'react'
import { RewardStreamsProvider } from '../../context/RewardStreamsProvider'
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
          {pools.map((feederPool: FeederPoolState) => {
            const { address, vault } = feederPool

            return (
              <RewardStreamsProvider key={address} vault={vault}>
                <PoolRow feederPool={feederPool} />
              </RewardStreamsProvider>
            )
          })}
        </DashTable>
      </Card>
    </div>
  )
}
