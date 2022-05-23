import { ChainIds, getNetwork } from '@apps/base/context/network'
import { useFetchPriceCtx } from '@apps/base/context/prices'
import { useSelectedMassetState } from '@apps/masset-hooks'

import type { FetchState, MassetName } from '@apps/types'

const {
  addresses: { WBTC },
} = getNetwork(ChainIds.EthereumMainnet)

export const useSelectedMassetPrice = (mAssetName?: MassetName): FetchState<number> => {
  const massetState = useSelectedMassetState(mAssetName)
  const { fetchPrice } = useFetchPriceCtx()
  const wbtcPrice = fetchPrice(WBTC)
  return massetState?.token?.symbol === 'mBTC' ? wbtcPrice : { value: 1 }
}
