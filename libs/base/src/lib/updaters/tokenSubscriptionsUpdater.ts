import { useEffect, useMemo } from 'react'

import { BigDecimal } from '@apps/bigdecimal'
import { BigNumber } from 'ethers'
import { usePrevious } from 'react-use'
import { erc20ABI, useContractReads } from 'wagmi'

import { useChainIdCtx } from '../context/NetworkProvider'
import { useAllowanceSubscriptionsSerialized, useBalanceSubscriptionsSerialized, useTokensDispatch } from '../context/TokensProvider'
import { useAccount } from '../context/WagmiProvider'

/**
 * Updater for tracking token balances, performing fetches on each new
 * block, and keeping contract instances in state.
 */
export const TokenSubscriptionsUpdater = (): null => {
  const { reset, updateBalances, updateAllowances } = useTokensDispatch()

  const [chainId] = useChainIdCtx()
  const prevChainId = usePrevious(chainId)

  const account = useAccount()
  const prevAccount = usePrevious(account)

  const balanceSubscriptionsSerialized = useBalanceSubscriptionsSerialized()
  const allowanceSubscriptionsSerialized = useAllowanceSubscriptionsSerialized()

  // Clear all contracts and tokens if the account/chain changes.
  useEffect(() => {
    if (prevAccount !== account || chainId !== prevChainId) {
      reset()
    }
  }, [account, chainId, prevAccount, prevChainId, reset])

  const allowances = useMemo(
    () =>
      (
        JSON.parse(allowanceSubscriptionsSerialized) as {
          address: string
          spenders: string[]
          decimals: number
        }[]
      ).flatMap(({ address, spenders, decimals }) =>
        spenders.map(spender => ({
          address,
          spender,
          decimals,
        })),
      ),
    [allowanceSubscriptionsSerialized],
  )

  const { data: allowRes } = useContractReads({
    contracts: allowances.map(({ address, spender }) => ({
      addressOrName: address,
      contractInterface: erc20ABI,
      functionName: 'allowance',
      args: [account, spender],
    })),
    allowFailure: true,
  })

  useEffect(() => {
    if (allowRes) {
      updateAllowances(
        allowances.reduce(
          (acc, curr, i) => ({
            ...acc,
            [curr.address]: {
              ...acc[curr.address],
              [curr.spender]: BigNumber.isBigNumber(allowRes[i]) ? new BigDecimal(allowRes[i], curr.decimals) : BigDecimal.ZERO,
            },
          }),
          {} as Record<string, Record<string, BigDecimal>>,
        ),
      )
    }
  }, [allowRes, allowances, updateAllowances])

  const balances = useMemo(
    () =>
      JSON.parse(balanceSubscriptionsSerialized) as {
        address: string
        decimals: number
      }[],
    [balanceSubscriptionsSerialized],
  )

  const { data: balRes } = useContractReads({
    contracts: balances.map(({ address }) => ({
      addressOrName: address,
      contractInterface: erc20ABI,
      functionName: 'balanceOf',
      args: [account],
    })),
    allowFailure: true,
  })

  useEffect(() => {
    if (balRes) {
      updateBalances(
        balances.reduce(
          (acc, curr, i) => ({
            ...acc,
            [curr.address]: BigNumber.isBigNumber(balRes[i]) ? new BigDecimal(balRes[i], curr.decimals) : BigDecimal.ZERO,
          }),
          {},
        ),
      )
    } else {
      updateBalances(balances.reduce((acc, curr) => ({ ...acc, [curr.address]: BigDecimal.ZERO }), {}))
    }
  }, [balRes, balances, updateBalances])

  return null
}
