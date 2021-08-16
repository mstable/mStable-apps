import React, { FC } from 'react'
import { useChainIdCtx, ChainIds } from '@apps/base/context/network'

import { EthereumPool } from './EthereumPool'
import { PolygonPool } from './PolygonPool'

export const PoolDetail: FC = () => {
  const [chainId] = useChainIdCtx()
  return chainId === ChainIds.EthereumMainnet ? <EthereumPool /> : <PolygonPool />
}
