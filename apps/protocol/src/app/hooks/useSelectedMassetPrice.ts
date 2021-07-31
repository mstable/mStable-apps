import { ChainIds, getNetwork } from '@apps/base/context/network'
import { useFetchPriceCtx } from '@apps/base/context/prices'
import { FetchState, useSelectedMassetState } from '@apps/hooks'

const {
  addresses: {
    ERC20: { WBTC },
  },
} = getNetwork(ChainIds.EthereumMainnet)

export const useSelectedMassetPrice = (): FetchState<number> => {
  const massetState = useSelectedMassetState()
  const useFetchPrice = useFetchPriceCtx()
  const wbtcPrice = useFetchPrice(WBTC)
  return massetState?.token?.symbol === 'mBTC' ? wbtcPrice : { value: 1 }
}
