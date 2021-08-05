import React, { FC } from 'react'
import { useChainIdCtx, ChainIds } from '@apps/base/context/network'

import { EthereumPools } from './EthereumPools'
import { PolygonPools } from './PolygonPools'

export const PoolDetail: FC = () => {
  const [chainId] = useChainIdCtx()
  return chainId === ChainIds.EthereumMainnet ? <EthereumPools /> : <PolygonPools />
}
