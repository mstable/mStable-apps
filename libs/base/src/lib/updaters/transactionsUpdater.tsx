import { useEffect } from 'react'

import { TransactionStatus } from '@apps/transaction-manifest'
import { usePrevious } from 'react-use'
import { useWaitForTransaction } from 'wagmi'

import { useTransactionsDispatch, useTransactionsState } from '../context/TransactionsProvider'
import { useAccount } from '../context/WagmiProvider'

import type { FC } from 'react'

import type { Transaction } from '../context/TransactionsProvider'

const STATUS_NEEDS_CHECK = [TransactionStatus.Pending, TransactionStatus.Sent, TransactionStatus.Response]

const TansactionWatcher: FC<{ tx: Transaction }> = ({ tx }) => {
  const { data, isLoading } = useWaitForTransaction({ hash: tx?.hash })
  const { finalize } = useTransactionsDispatch()

  useEffect(() => {
    if (!isLoading && data) {
      finalize(tx.manifest, data)
    }
  }, [data, finalize, isLoading, tx.manifest])

  return null
}

/**
 * Update the state of affected transactions when the provider or
 * block number changes.
 */
export const TransactionsUpdater = () => {
  const account = useAccount()
  const accountPrev = usePrevious(account)
  const state = useTransactionsState()
  const txsToCheck = Object.values(state).filter(tx => STATUS_NEEDS_CHECK.includes(tx.status) && tx.hash)
  const { reset } = useTransactionsDispatch()

  /**
   * Reset transactions state on account change
   */
  useEffect(() => {
    if (accountPrev !== account) {
      reset()
    }
  }, [account, accountPrev, reset])

  if (!txsToCheck || txsToCheck.length === 0) return null

  return (
    <>
      {txsToCheck.map(tx => (
        <TansactionWatcher key={tx.manifest.id} tx={tx} />
      ))}
    </>
  )
}
