import { FieldPolicy, InMemoryCache } from '@apollo/client'
import { Balance, Metric } from '@apps/artifacts/graphql/staking'
import { TypedTypePolicies } from '@apps/artifacts/graphql/staking/apollo-helpers'
import { BigDecimal } from '@apps/bigdecimal'

import { readAsBN } from './utils'

const typePolicies: TypedTypePolicies = {
  Balance: {
    fields: {
      rawBN: readAsBN<Balance>('raw'),
      votesBN: readAsBN<Balance>('votes'),
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
