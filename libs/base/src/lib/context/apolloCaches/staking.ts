import { InMemoryCache } from '@apollo/client'
import { BigDecimal } from '@apps/bigdecimal'

import { readAsBD } from './utils'

import type { FieldPolicy } from '@apollo/client'
import type { Account, Metric, StakedTokenBalance } from '@apps/artifacts/graphql/staking'
import type { TypedTypePolicies } from '@apps/artifacts/graphql/staking/apollo-helpers'

const typePolicies: TypedTypePolicies = {
  StakedTokenBalance: {
    fields: {
      rawBD: readAsBD<StakedTokenBalance>('raw'),
      votesBD: readAsBD<StakedTokenBalance>('votes'),
      timeMultiplierSimple: {
        read(existing, options) {
          const timeMultiplier = (options.readField('timeMultiplier') ?? 10) as number
          return timeMultiplier * 0.1
        },
      },
      questMultiplierSimple: {
        read(existing, options) {
          const questMultiplier = (options.readField('questMultiplier') ?? 10) as number
          return questMultiplier * 0.1
        },
      },
    },
  },
  Account: {
    fields: {
      totalVotesAllBD: readAsBD<Account>('totalVotesAll'),
      totalVotesMTABD: readAsBD<Account>('totalVotesMTA'),
      totalVotesBPTBD: readAsBD<Account>('totalVotesBPT'),
      permMultiplierSimple: {
        read(existing, options) {
          const permMultiplier = (options.readField('permMultiplier') ?? 10) as number
          return permMultiplier * 0.1
        },
      },
      seasonMultiplierSimple: {
        read(existing, options) {
          const seasonMultiplier = (options.readField('seasonMultiplier') ?? 10) as number
          return seasonMultiplier * 0.1
        },
      },
    },
  },
  Metric: {
    fields: {
      bigDecimal: {
        read(existing, options) {
          const decimals: number = options.readField('decimals') as Metric['decimals']
          const exact = options.readField('exact') as Metric['exact']
          return new BigDecimal(exact, decimals)
        },
      } as FieldPolicy<Metric['bigDecimal']>,
    },
  },
}

export const staking = new InMemoryCache({
  typePolicies,
})
