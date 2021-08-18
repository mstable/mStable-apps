import { InMemoryCache } from '@apollo/client'
import { AllGqlEndpoints } from '@apps/base/context/network'
import { staking } from './staking'

export const caches: Record<AllGqlEndpoints, InMemoryCache> = Object.freeze({
  blocks: new InMemoryCache(),
  feeders: new InMemoryCache(),
  protocol: new InMemoryCache(),
  stakingRewards: new InMemoryCache(),
  staking,
  questbook: new InMemoryCache(),
})
