import { InMemoryCache } from '@apollo/client'

import { staking } from './staking'

import type { AllGqlEndpoints } from '../NetworkProvider'

export const caches: Record<AllGqlEndpoints, InMemoryCache> = Object.freeze({
  blocks: new InMemoryCache(),
  feeders: new InMemoryCache(),
  merkleDrop: new InMemoryCache(),
  protocol: new InMemoryCache(),
  stakingRewards: new InMemoryCache(),
  snapshot: new InMemoryCache(),
  staking,
  questbook: new InMemoryCache(),
  emissions: new InMemoryCache(),
})
