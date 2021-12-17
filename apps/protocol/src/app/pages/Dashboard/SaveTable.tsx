import React, { useMemo } from 'react'
import { useAccount } from '@apps/base/context/account'
import { MassetState, useDataState } from '@apps/data-provider'
import { RewardStreamsProvider } from '../../context/RewardStreamsProvider'
import { Card, DashTable } from './Styled'
import { sortSaveByDepositedDesc } from './utils'
import { SaveRow } from './SaveRow'

const headerTitles = ['Asset', 'APY', 'Balance', 'TVL'].map(t => ({ title: t }))

export const SaveTable = () => {
  const dataState = useDataState()
  const account = useAccount()

  const filteredHeaderTitles = !!account ? headerTitles : headerTitles.filter(({ title }) => title !== 'Balance')

  const vaults = useMemo(() => Object.values(dataState).sort(sortSaveByDepositedDesc()), [dataState])

  return (
    <div>
      <Card>
        <DashTable headerTitles={filteredHeaderTitles} width={48}>
          {vaults.map((massetState: MassetState) => {
            const {
              address,
              savingsContracts: { v2: { boostedSavingsVault } = {} },
            } = massetState

            return (
              <RewardStreamsProvider key={address} vault={boostedSavingsVault}>
                <SaveRow massetState={massetState} showBalance={!!account} />
              </RewardStreamsProvider>
            )
          })}
        </DashTable>
      </Card>
    </div>
  )
}
