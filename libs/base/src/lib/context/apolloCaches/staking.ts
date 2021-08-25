import { FieldPolicy, InMemoryCache } from '@apollo/client'
import { StakedTokenBalance, Metric, Account } from '@apps/artifacts/graphql/staking'
import { TypedTypePolicies } from '@apps/artifacts/graphql/staking/apollo-helpers'
import { BigDecimal } from '@apps/bigdecimal'

import { readAsBD } from './utils'

const typePolicies: TypedTypePolicies = {
  StakedTokenBalance: {
    fields: {
      rawBD: readAsBD<StakedTokenBalance>('raw'),
      votesBD: readAsBD<StakedTokenBalance>('votes'),
    },
  },
  Account: {
    fields: {
      totalVotesBD: readAsBD<Account>('totalVotes'),
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
