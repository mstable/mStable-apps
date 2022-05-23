import { BigDecimal } from '@apps/bigdecimal'
import { MASSETS } from '@apps/types'
import { createStateContext } from 'react-use'

import type { MassetName } from '@apps/types'
import type { Dispatch, SetStateAction } from 'react'

export interface MassetConfig {
  massetName: MassetName
  formattedName: string
  lowInputValue: BigDecimal
  hasV1Save?: boolean
  decimals: number
}

export const MASSET_CONFIG: Record<MassetName, MassetConfig> = Object.freeze({
  musd: {
    massetName: 'musd',
    formattedName: 'mUSD',
    lowInputValue: BigDecimal.ONE,
    hasV1Save: true,
    decimals: 18,
  },
  mbtc: {
    massetName: 'mbtc',
    formattedName: 'mBTC',
    lowInputValue: BigDecimal.fromSimple(1 / 58000), // rough approximation, just needs to be small,
    decimals: 18,
  },
})

const defaultValue: MassetName = (() => {
  const slugs = Object.keys(MASSETS)
  const slug = window.location.hash.split('/')[1]

  return slug && slugs.includes(slug) ? (slug as MassetName) : 'musd'
})()

const [useSelectedMassetNameCtx, SelectedMassetNameProvider] = createStateContext<MassetName>(defaultValue)

export const useSelectedMasset = (): [MassetName, Dispatch<SetStateAction<MassetName>>] => useSelectedMassetNameCtx()

export const useSelectedMassetName = (): MassetName => useSelectedMassetNameCtx()[0]

export const useSetSelectedMassetName = (): Dispatch<SetStateAction<MassetName>> => useSelectedMassetNameCtx()[1]

export const useSelectedMassetConfig = (): MassetConfig => {
  const masset = useSelectedMassetName()
  return MASSET_CONFIG[masset]
}

export const MassetProvider = SelectedMassetNameProvider
