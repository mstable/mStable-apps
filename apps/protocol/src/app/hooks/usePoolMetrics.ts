import { useMemo } from 'react'

import { useApolloClients } from '@apps/base/context/apollo'
import { useFeederPoolMetricsQuery } from '@apps/artifacts/graphql/feeders'
import { useBlockNumbers } from '@apps/base/context/block'
import { BigDecimal } from '@apps/bigdecimal'

export const usePoolMetrics = (feederPoolAddress?: string): { volume: BigDecimal; baseApy: number } => {
  const clients = useApolloClients()
  const { block24h } = useBlockNumbers()
  const fpMetrics = useFeederPoolMetricsQuery({
    variables: { feederPool: feederPoolAddress, block: { number: block24h as number } },
    skip: !block24h,
    client: clients.feeders,
  })
  return useMemo(() => {
    let volume = BigDecimal.ZERO
    let baseApy: number

    if (fpMetrics.data?.historic && fpMetrics.data.current) {
      const { current, historic } = fpMetrics.data
      {
        const swapped = BigDecimal.fromMetric(current.cumulativeSwapped).sub(BigDecimal.fromMetric(historic.cumulativeSwapped))
        const minted = BigDecimal.fromMetric(current.cumulativeMinted).sub(BigDecimal.fromMetric(historic.cumulativeMinted))
        const redeemed = BigDecimal.fromMetric(current.cumulativeRedeemed).sub(BigDecimal.fromMetric(historic.cumulativeRedeemed))
        volume = swapped.add(minted).add(redeemed)
      }
      {
        // This can go out of sync when the price hasn't updated for > 24h; we should
        // track priceUpdatedAt on the subgraph
        const rateDiff = parseFloat(current.price) / parseFloat(historic.price)
        baseApy = (rateDiff ** 365 - 1) * 100
      }
    }
    return { volume, baseApy }
  }, [fpMetrics])
}
