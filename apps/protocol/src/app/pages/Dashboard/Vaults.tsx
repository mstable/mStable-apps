import React, { useMemo } from 'react'
import { useAccount } from '@apps/base/context/account'
import { MassetState, useDataState } from '@apps/data-provider'
import { RewardStreamsProvider } from '../../context/RewardStreamsProvider'
import { useSelectedSaveVersion } from '../../context/SelectedSaveVersionProvider'
import { Card, DashTable } from './Styled'
import { sortVaultsByDepositedDesc } from './utils'
import { VaultRow } from './VaultRow'

const headerTitles = ['Asset', 'APY', 'Balance', 'TVL'].map(t => ({ title: t }))

export const Vaults = () => {
  const dataState = useDataState()
  const [selectedSaveVersion] = useSelectedSaveVersion()
  const account = useAccount()

  const filteredHeaderTitles = !!account ? headerTitles : headerTitles.filter(({ title }) => title !== 'Balance')

  const vaults = useMemo(
    () => Object.values(dataState).sort(sortVaultsByDepositedDesc(selectedSaveVersion)),
    [dataState, selectedSaveVersion],
  )

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
                <VaultRow massetState={massetState} showBalance={!!account} />
              </RewardStreamsProvider>
            )
          })}
        </DashTable>
      </Card>
    </div>
  )
}
