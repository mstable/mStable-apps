import { useEffect } from 'react'

import { useAccount, useConnected } from '../context/AccountProvider'
import { useChainIdCtx } from '../context/NetworkProvider'
import { useTransactionsDispatch } from '../context/TransactionsProvider'

export const ContractsUpdater = (): null => {
  const connected = useConnected()
  const account = useAccount()
  const [chainId] = useChainIdCtx()
  const { reset } = useTransactionsDispatch()

  // When the account/chain changes, reset the transactions state.
  useEffect(reset, [account, chainId, connected, reset])

  return null
}
