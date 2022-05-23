import { useMemo } from 'react'

import { useSelectedMassetState } from '@apps/masset-hooks'

import type { InputRatios } from '@apps/types'

export const useMassetInputRatios = (): InputRatios => {
  const massetState = useSelectedMassetState()
  return useMemo<InputRatios>(
    () => ({
      ...massetState.bassetRatios,
      ...Object.fromEntries(Object.values(massetState.feederPools).map(fp => [fp.fasset.address, fp.fasset.ratio])),
    }),
    [massetState],
  )
}
