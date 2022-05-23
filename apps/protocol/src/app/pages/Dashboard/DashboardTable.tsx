import { useMemo } from 'react'

import { useAccount } from '@apps/base/context/account'
import { useDataState } from '@apps/data-provider'
import styled from 'styled-components'

import { useFraxStakingState } from '../../context/FraxStakingProvider'
import { RewardStreamsProvider } from '../../context/RewardStreamsProvider'
import { useStakingRewards } from '../Save/hooks'
import { PoolRow } from './PoolRow'
import { SaveRow } from './SaveRow'
import { Card, DashTable } from './Styled'
import { DashboardFilter as DF } from './types'
import { filterByDeposited, isValidFeederPool, sortPoolsByDepositedDesc, sortSaveByDepositedDesc } from './utils'

import type { FeederPoolState, MassetState } from '@apps/data-provider'
import type { FC } from 'react'

const headerTitles = ['Asset', 'APY', 'Balance', 'TVL'].map(t => ({ title: t }))

const UserZeroState = styled.tr`
  height: 4.75rem;
  display: flex;
  align-items: center;
  padding: 0 1rem;
  justify-content: center;
  text-align: center;

  td {
    display: inherit !important;
  }
`

export const DashboardTable: FC<{ filter: DF }> = ({ filter }) => {
  const dataState = useDataState()
  const account = useAccount()
  const polygonRewards = useStakingRewards()
  const { subscribedData: fraxSubscribedData } = useFraxStakingState()
  const fraxState = fraxSubscribedData?.value?.accountData

  const filteredHeaderTitles = account ? headerTitles : headerTitles.filter(({ title }) => title !== 'Balance')

  const save = useMemo(() => Object.values(dataState).sort(sortSaveByDepositedDesc()), [dataState])

  const pools = useMemo(
    () =>
      Object.values(dataState)
        .reduce((acc, curr) => [...acc, ...Object.values(curr.feederPools).filter(isValidFeederPool)], [])
        .sort(sortPoolsByDepositedDesc),
    [dataState],
  )

  const isSaveFilter = filter === DF.Save || filter === DF.User
  const isPoolsFilter = filter === DF.Pools || filter === DF.User
  const isUserFilter = filter === DF.User

  const filteredSave = save.filter((massetState: MassetState) => filterByDeposited(isUserFilter && { massetState, polygonRewards }))
  const filteredPools = pools.filter((feederState: FeederPoolState) =>
    filterByDeposited(isUserFilter && { feederState, fraxState, polygonRewards }),
  )
  const showUserZeroState = isUserFilter && !filteredSave.length && !filteredPools.length

  return (
    <Card>
      <DashTable headerTitles={filteredHeaderTitles} width={48}>
        {showUserZeroState && (
          <UserZeroState>
            <td>No user deposits found.</td>
          </UserZeroState>
        )}
        {isSaveFilter &&
          filteredSave.map((massetState: MassetState) => {
            const { address, savingsContracts } = massetState
            const { v2: { boostedSavingsVault } = {} } = savingsContracts
            return (
              <RewardStreamsProvider key={address} vault={boostedSavingsVault}>
                <SaveRow massetState={massetState} showBalance={!!account} />
              </RewardStreamsProvider>
            )
          })}
        {isPoolsFilter &&
          filteredPools.map((feederState: FeederPoolState) => {
            const { address, vault } = feederState
            return (
              <RewardStreamsProvider key={address} vault={vault}>
                <PoolRow feederPool={feederState} showBalance={!!account} />
              </RewardStreamsProvider>
            )
          })}
      </DashTable>
    </Card>
  )
}
