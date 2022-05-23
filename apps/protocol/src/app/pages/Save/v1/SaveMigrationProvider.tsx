/* eslint-disable @typescript-eslint/no-explicit-any */

import { createContext, useCallback, useContext, useMemo, useState } from 'react'

import { ERC20__factory, ISavingsContractV1__factory } from '@apps/artifacts/typechain'
import { useSigner } from '@apps/base/context/account'
import { useTokenAllowance } from '@apps/base/context/tokens'
import { useTransactionsDispatch, useTransactionsState } from '@apps/base/context/transactions'
import { useSelectedMassetState } from '@apps/masset-hooks'
import { TransactionManifest, TransactionStatus } from '@apps/transaction-manifest'
import { constants } from 'ethers'

import { useSelectedSaveVersion } from '../../../context/SelectedSaveVersionProvider'

import type { ISavingsContractV1 } from '@apps/artifacts/typechain'
import type { Transaction } from '@apps/base/context/transactions'
import type { StepProps } from '@apps/dumb-components'
import type { Interfaces } from '@apps/transaction-manifest'
import type { BigNumber } from 'ethers'
import type { FC } from 'react'

const isTxPending = (transactions: Record<string, Transaction>, id?: string): boolean => {
  return !!(
    id &&
    transactions[id] &&
    [TransactionStatus.Pending, TransactionStatus.Sent, TransactionStatus.Response].includes(transactions[id].status)
  )
}

const stepsCtx = createContext<StepProps[]>([])

const formId = 'saveMigration'

const useSelectedSaveV1Contract = (): ISavingsContractV1 | undefined => {
  const massetState = useSelectedMassetState()
  const address = massetState?.savingsContracts.v1?.address
  const signer = useSigner()
  return useMemo(() => (signer && address ? ISavingsContractV1__factory.connect(address, signer) : undefined), [address, signer])
}

export const SaveMigrationProvider: FC = ({ children }) => {
  const [approveInfinite, setApproveInfinite] = useState<boolean>(true)
  const [withdrawId, setWithdrawId] = useState<string | undefined>()
  const [approveId, setApproveId] = useState<string | undefined>()

  const signer = useSigner()
  const { propose } = useTransactionsDispatch()
  const transactions = useTransactionsState()
  const massetState = useSelectedMassetState()
  const [, setSelectedSaveVersion] = useSelectedSaveVersion()
  const massetAddress = massetState?.address
  const massetSymbol = massetState?.token.symbol
  const v1SavingsBalance = massetState?.savingsContracts.v1?.savingsBalance
  const v2Address = massetState?.savingsContracts.v2?.address

  const savingsContractV1 = useSelectedSaveV1Contract()

  const allowance = useTokenAllowance(massetAddress, v2Address)

  const proposeWithdrawTx = useCallback(() => {
    if (!(v1SavingsBalance?.balance && v1SavingsBalance.credits?.exact.gt(0) && savingsContractV1)) {
      return
    }

    const body = v1SavingsBalance.balance.format()
    const tx = new TransactionManifest<Interfaces.SavingsContract, 'redeem'>(
      savingsContractV1 as never,
      'redeem',
      [v1SavingsBalance?.credits?.exact as BigNumber],
      {
        present: `Withdrawing ${body}`,
        past: `Withdrew ${body}`,
      },
      formId,
    )

    setWithdrawId(tx.id)
    propose(tx)
  }, [propose, savingsContractV1, v1SavingsBalance])

  const proposeApproveTx = useCallback(() => {
    if (!(v2Address && massetSymbol && v1SavingsBalance?.balance && signer && massetAddress)) {
      return
    }

    const body = `transfer of ${massetSymbol}`
    const tx = new TransactionManifest<Interfaces.ERC20, 'approve'>(
      ERC20__factory.connect(massetAddress, signer),
      'approve',
      [v2Address, approveInfinite ? constants.MaxUint256 : (v1SavingsBalance?.balance.exact as BigNumber)],
      {
        present: `Approving ${body}`,
        past: `Approved ${body}`,
      },
      formId,
    )

    setApproveId(tx.id)
    propose(tx)
  }, [approveInfinite, massetAddress, massetSymbol, propose, signer, v1SavingsBalance?.balance, v2Address])

  const steps = useMemo<StepProps[]>(() => {
    if (!(massetState && massetState.savingsContracts.v1 && massetState.savingsContracts.v2?.token)) {
      return []
    }

    const { v1, v2 } = massetState.savingsContracts

    const approveComplete = allowance?.exact.gte(massetState.token.balance?.exact as BigNumber) ?? false

    const withdrawTxSubmitting = isTxPending(transactions, withdrawId)
    const approveTxSubmitting = isTxPending(transactions, approveId)

    return [
      {
        key: 'withdraw',
        complete: !!v1.savingsBalance.balance?.exact.eq(0),
        options: [
          {
            title: 'Withdraw from Save V1',
            key: 'withdraw',
            onClick: proposeWithdrawTx,
            pending: withdrawTxSubmitting,
          },
        ],
      },
      {
        key: 'approve',
        complete: approveComplete || !!v1.savingsBalance.balance?.exact.eq(0),
        options: [
          {
            title: 'Approve',
            key: 'approve-exact',
            buttonTitle: 'Exact',
            onClick: () => {
              setApproveInfinite(false)
              proposeApproveTx()
            },
            pending: approveTxSubmitting && !approveInfinite,
          },
          {
            title: 'Approve',
            key: 'approve-infinite',
            buttonTitle: 'Infinite',
            onClick: () => {
              setApproveInfinite(true)
              proposeApproveTx()
            },
            pending: approveTxSubmitting && approveInfinite,
          },
        ],
      },
      {
        key: 'deposit',
        complete: !!(v1.savingsBalance.balance?.exact.eq(0) && v2.savingsBalance.balance?.exact.gt(0)),
        options: [
          {
            title: 'Deposit to Save V2 (imUSD)',
            buttonTitle: 'Deposit',
            key: 'deposit',
            onClick: () => setSelectedSaveVersion(2),
            pending: false,
          },
        ],
      },
    ]
  }, [
    allowance,
    approveId,
    approveInfinite,
    massetState,
    proposeApproveTx,
    proposeWithdrawTx,
    setSelectedSaveVersion,
    transactions,
    withdrawId,
  ])

  return <stepsCtx.Provider value={steps}>{children}</stepsCtx.Provider>
}

export const useMigrationSteps = (): StepProps[] => useContext(stepsCtx)
