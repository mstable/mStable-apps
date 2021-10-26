import { InMemoryCache } from '@apollo/client'

import { AllGqlEndpoints } from '../NetworkProvider'
import { staking } from './staking'

export const caches: Record<AllGqlEndpoints, InMemoryCache> = Object.freeze({
  blocks: new InMemoryCache(),
  feeders: new InMemoryCache(),
  merkleDrop: new InMemoryCache(),
  protocol: new InMemoryCache(),
  stakingRewards: new InMemoryCache(),
  snapshot: new InMemoryCache(),
  staking,
  questbook: new InMemoryCache(),
  balancer: new InMemoryCache(),
})
