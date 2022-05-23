import { useLayoutEffect } from 'react'

import { ChainIds, useChainIdCtx } from '@apps/base/context/network'

import { EthereumSave } from './EthereumSave'
import { PolygonSave } from './PolygonSave'

import type { FC } from 'react'

export const Save: FC = () => {
  const [chainId] = useChainIdCtx()

  useLayoutEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  return chainId === ChainIds.EthereumMainnet ? <EthereumSave /> : <PolygonSave />
}
