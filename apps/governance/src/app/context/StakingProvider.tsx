import React, { FC, useMemo } from 'react'
import { useAccount } from '@apps/base/context/account'
import { useBlockPollingSubscription } from '@apps/hooks'
import { useStakingLazyQuery } from '@apps/artifacts/graphql/staking'

export const StakingProvider: FC = ({ children }) => {
  const account = useAccount()
  const options = useMemo(() => ({ variables: { account: account ?? '', hasAccount: !!account } }), [account])
  const sub = useBlockPollingSubscription(useStakingLazyQuery, options)

  // TODO use the data
  console.log(sub.data)

  return <>{children}</>
}
