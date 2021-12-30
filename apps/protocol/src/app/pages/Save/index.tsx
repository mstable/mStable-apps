import React, { FC, useLayoutEffect } from 'react'
import { useChainIdCtx, ChainIds } from '@apps/base/context/network'

import { EthereumSave } from './EthereumSave'
import { PolygonSave } from './PolygonSave'

export const Save: FC = () => {
  const [chainId] = useChainIdCtx()

  useLayoutEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  return chainId === ChainIds.EthereumMainnet ? <EthereumSave /> : <PolygonSave />
}
