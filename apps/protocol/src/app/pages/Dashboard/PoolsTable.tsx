import React, { useMemo } from 'react'
import { FeederPoolState, PoolType, useDataState } from '@apps/data-provider'
import { RewardStreamsProvider } from '../../context/RewardStreamsProvider'
import { PoolRow } from './PoolRow'
import { Card, DashTable } from './Styled'
import { sortPoolsByDepositedDesc } from './utils'
import { useAccount } from '@apps/base/context/account'

const headerTitles = ['Asset', 'APY', 'Balance', 'TVL'].map(t => ({ title: t }))

const isValidPool = (fp: FeederPoolState): boolean => ![PoolType.Hidden, PoolType.Deprecated].includes(fp.poolType)

export const PoolsTable = () => {
  const dataState = useDataState()
  const account = useAccount()

  const filteredHeaderTitles = !!account ? headerTitles : headerTitles.filter(({ title }) => title !== 'Balance')

  const pools = useMemo(
    () =>
      Object.values(dataState)
        .reduce((acc, curr) => [...acc, ...Object.values(curr.feederPools).filter(isValidPool)], [])
        .sort(sortPoolsByDepositedDesc),
    [dataState],
  )

  return (
    <div>
      <Card>
        <DashTable headerTitles={filteredHeaderTitles} width={48}>
          {pools.map((feederPool: FeederPoolState) => {
            const { address, vault } = feederPool
            return (
              <RewardStreamsProvider key={address} vault={vault}>
                <PoolRow feederPool={feederPool} showBalance={!!account} />
              </RewardStreamsProvider>
            )
          })}
        </DashTable>
      </Card>
    </div>
  )
}
