import { useSelectedMassetState } from '@apps/base/context/data'
import { useFetchPriceCtx } from '@apps/base/context/prices'
import { FetchState } from '@apps/hooks'

export const useSelectedMassetPrice = (): FetchState<number> => {
  const massetState = useSelectedMassetState()
  const useFetchPrice = useFetchPriceCtx()
  return useFetchPrice(massetState?.address)
}
