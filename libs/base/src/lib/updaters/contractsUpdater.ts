import { useEffect } from 'react'

import { useAccount } from 'wagmi'

import { useChainIdCtx } from '../context/NetworkProvider'
import { useTransactionsDispatch } from '../context/TransactionsProvider'

export const ContractsUpdater = (): null => {
  const { isConnecting, address } = useAccount()
  const [chainId] = useChainIdCtx()
  const { reset } = useTransactionsDispatch()

  // When the account/chain changes, reset the transactions state.
  useEffect(reset, [address, chainId, isConnecting, reset])

  return null
}
