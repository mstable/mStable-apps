import { createPricesContext } from '@apps/hooks'

const [useFetchPriceCtx, PricesProvider] = createPricesContext()

export { useFetchPriceCtx, PricesProvider }
