import { useEffect } from 'react'

import { useConnect } from 'wagmi'

import { useChainIdCtx } from '../context/NetworkProvider'
import { useTransactionsDispatch } from '../context/TransactionsProvider'
import { useAccount } from '../context/WagmiProvider'

export const ContractsUpdater = (): null => {
  const { isConnecting } = useConnect()
  const account = useAccount()
  const [chainId] = useChainIdCtx()
  const { reset } = useTransactionsDispatch()

  // When the account/chain changes, reset the transactions state.
  useEffect(reset, [account, chainId, isConnecting, reset])

  return null
}
