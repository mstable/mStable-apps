import { MassetState, useDataState } from '@apps/data-provider'
import React, { useMemo } from 'react'
import { RewardStreamsProvider } from '../../context/RewardStreamsProvider'
import { useSelectedSaveVersion } from '../../context/SelectedSaveVersionProvider'
import { Card, DashTable, Title } from './Styled'
import { sortVaultsByDepositedDesc } from './utils'
import { VaultRow } from './VaultRow'

const headerTitles = ['', 'APY(%)', 'Deposited', 'TVL'].map(t => ({ title: t }))

export const Vaults = () => {
  const dataState = useDataState()
  const [selectedSaveVersion] = useSelectedSaveVersion()

  const vaults = useMemo(
    () =>
      Object.values(dataState)
        .reduce((acc, curr) => [...acc, curr], [])
        .sort(sortVaultsByDepositedDesc(selectedSaveVersion)),
    [dataState, selectedSaveVersion],
  )

  return (
    <div>
      <Title>Vaults</Title>
      <Card>
        <DashTable headerTitles={headerTitles}>
          {vaults.map((massetState: MassetState) => {
            const {
              address,
              savingsContracts: { v2: { boostedSavingsVault } = {} },
            } = massetState

            return (
              <RewardStreamsProvider key={address} vault={boostedSavingsVault}>
                <VaultRow massetState={massetState} />
              </RewardStreamsProvider>
            )
          })}
        </DashTable>
      </Card>
    </div>
  )
}
