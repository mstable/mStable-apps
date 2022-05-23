import { useMemo } from 'react'

import { useSelectedFeederPoolState } from '../pages/Pools/FeederPoolProvider'

import type { InputRatios } from '@apps/types'

export const useFPInputRatios = (): InputRatios => {
  const feederPool = useSelectedFeederPoolState()
  return useMemo(
    () => ({
      [feederPool.fasset.address]: feederPool.fasset.ratio,
      [feederPool.masset.address]: feederPool.masset.ratio,
    }),
    [feederPool.fasset.address, feederPool.fasset.ratio, feederPool.masset.address, feederPool.masset.ratio],
  )
}
