import { useMemo } from 'react'
import { InputRatios } from '@apps/types'

import { useSelectedFeederPoolState } from '../pages/Pools/FeederPoolProvider'

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
