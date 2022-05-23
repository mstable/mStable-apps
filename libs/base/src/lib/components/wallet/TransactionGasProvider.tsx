import { createContext, useContext, useMemo, useState } from 'react'

import { useThrottleFn } from 'react-use'

import { Networks, useNetwork } from '../../context/NetworkProvider'
import { useNativeToken } from '../../context/TokensProvider'
import { useTransactionsState } from '../../context/TransactionsProvider'

import type { BigNumber } from 'ethers'
import type { Dispatch, FC, SetStateAction } from 'react'

import type { Transaction } from '../../context/TransactionsProvider'

interface GasCtx {
  estimationError?: string
  gasLimit?: BigNumber
  gasPrice?: number
  setGasPrice: Dispatch<SetStateAction<number | undefined>>
  insufficientBalance: boolean
}

const ctx = createContext<GasCtx>(null as never)

export const useGas = (): GasCtx => useContext(ctx)

export const TransactionGasProvider: FC<{ id: string }> = ({ children, id }) => {
  const { [id]: transaction } = useTransactionsState()
  const { protocolName } = useNetwork()
  const [estimationError, setEstimationError] = useState<string | undefined>()
  const [gasLimit, setGasLimit] = useState<BigNumber | undefined>()
  const [gasPrice, setGasPrice] = useState<number | undefined>()
  const nativeToken = useNativeToken()

  // +100% for Polygon, +10% otherwise
  const gasMargin = protocolName === Networks.Polygon ? 10000 : 1000

  useThrottleFn<Promise<void>, [Transaction | undefined]>(
    async _transaction => {
      let estimate: BigNumber | undefined
      if (_transaction) {
        try {
          estimate = await _transaction.manifest.estimate(gasMargin)
        } catch (error) {
          // MetaMask error messages are in a `data` property
          const txMessage = error.data?.message || error.message
          setEstimationError(txMessage)
          console.error(error)
        }
      }
      setGasLimit(estimate)
    },
    5000,
    [transaction],
  )

  const insufficientBalance = gasLimit && gasPrice && nativeToken?.balance ? nativeToken.balance.exact.lt(gasLimit.mul(gasPrice)) : false

  return (
    <ctx.Provider
      value={useMemo(
        () => ({ estimationError, gasLimit, gasPrice, setGasPrice, insufficientBalance }),
        [estimationError, gasLimit, gasPrice, setGasPrice, insufficientBalance],
      )}
    >
      {children}
    </ctx.Provider>
  )
}
