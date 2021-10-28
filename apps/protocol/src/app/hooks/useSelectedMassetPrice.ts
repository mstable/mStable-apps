import { ChainIds, getNetwork } from '@apps/base/context/network'
import { useFetchPriceCtx } from '@apps/base/context/prices'
import { FetchState, useSelectedMassetState } from '@apps/hooks'

const {
  addresses: { WBTC },
} = getNetwork(ChainIds.EthereumMainnet)

export const useSelectedMassetPrice = (): FetchState<number> => {
  const massetState = useSelectedMassetState()
  const { fetchPrice } = useFetchPriceCtx()
  const wbtcPrice = fetchPrice(WBTC)
  return massetState?.token?.symbol === 'mBTC' ? wbtcPrice : { value: 1 }
}
