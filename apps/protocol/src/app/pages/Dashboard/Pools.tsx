import { FeederPoolState, PoolType } from '@apps/data-provider'
import { useSelectedMassetState } from '@apps/masset-hooks'
import { MASSET_CONFIG } from '@apps/masset-provider'
import { MassetName } from '@apps/types'
import React, { FC, useMemo } from 'react'
import { PoolRow } from './PoolRow'
import { Card, DashTable, Title } from './Styled'

const headerTitles = ['', 'APY(%)', 'Deposited', 'TVL'].map(t => ({ title: t }))

const isUserPool = (fp: FeederPoolState): boolean => ![PoolType.Hidden, PoolType.Deprecated].includes(fp.poolType)

const MAssetPools: FC<{ mAssetName: MassetName }> = ({ mAssetName }) => {
  const { feederPools } = useSelectedMassetState(mAssetName)

  const pools = useMemo(() => Object.values(feederPools).filter(isUserPool), [feederPools])

  return (
    <>
      {pools.map(({ address }) => (
        <PoolRow key={address} address={address} mAssetName={mAssetName} />
      ))}
    </>
  )
}

export const Pools = () => {
  return (
    <div>
      <Title>Pools</Title>
      <Card>
        <DashTable headerTitles={headerTitles}>
          {Object.keys(MASSET_CONFIG).map((mAssetName: MassetName) => (
            <MAssetPools key={mAssetName} mAssetName={mAssetName} />
          ))}
        </DashTable>
      </Card>
    </div>
  )
}
