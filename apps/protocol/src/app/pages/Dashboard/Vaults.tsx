import { MASSET_CONFIG } from '@apps/masset-provider'
import { MassetName } from '@apps/types'
import React from 'react'
import { Card, DashTable, Title } from './Styled'
import { VaultRow } from './VaultRow'

const headerTitles = ['', 'APY(%)', 'Deposited', 'TVL'].map(t => ({ title: t }))

export const Vaults = () => {
  return (
    <div>
      <Title>Vaults</Title>
      <Card>
        <DashTable headerTitles={headerTitles}>
          {Object.keys(MASSET_CONFIG).map((mAssetName: MassetName) => (
            <VaultRow key={mAssetName} mAssetName={mAssetName} />
          ))}
        </DashTable>
      </Card>
    </div>
  )
}
