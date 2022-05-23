import { ChainIds, useChainIdCtx } from '@apps/base/context/network'

import { EthereumPool } from './EthereumPool'
import { PolygonPool } from './PolygonPool'

import type { FC } from 'react'

export const PoolDetail: FC = () => {
  const [chainId] = useChainIdCtx()
  return chainId === ChainIds.EthereumMainnet ? <EthereumPool /> : <PolygonPool />
}
