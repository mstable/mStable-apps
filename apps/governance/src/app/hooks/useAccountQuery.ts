import { useAccountQuery as useAccountQueryBase } from '@apps/artifacts/graphql/staking'
import { useApolloClients } from '@apps/base/context/apollo'

export const useAccountQuery = (address?: string) => {
  const clients = useApolloClients()
  return useAccountQueryBase({ client: clients.staking, variables: { id: address as string }, skip: !address })
}
