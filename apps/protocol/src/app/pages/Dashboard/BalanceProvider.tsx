import { BigDecimal } from '@apps/bigdecimal'
import React, { createContext, FC, useCallback, useContext, useEffect, useState } from 'react'

type SetContribution = (contributorId: string, value: BigDecimal) => void

interface BalanceStateCtx {
  deposits: BigDecimal
  setDeposit: SetContribution
}

const ctx = createContext<BalanceStateCtx>(null)

export const BalanceProvider: FC<{}> = ({ children }) => {
  const [depositContribs, setDepositContribs] = useState<Record<string, BigDecimal>>({})
  const [deposits, setDeposits] = useState(new BigDecimal(0))

  const setDepositContrib = useCallback<SetContribution>(
    (contributorId, value) => {
      if (!depositContribs[contributorId] || depositContribs[contributorId].simple !== value.simple) {
        setDepositContribs({ ...depositContribs, [contributorId]: value })
      }
    },
    [depositContribs],
  )

  useEffect(() => {
    const balance = Object.values(depositContribs).reduce((acc, curr) => acc.add(curr), new BigDecimal(0))
    setDeposits(balance)
  }, [depositContribs])

  return <ctx.Provider value={{ deposits, setDeposit: setDepositContrib }}>{children}</ctx.Provider>
}

export const useDeposits = (): number => useContext(ctx).deposits.simple

export const useSetDeposit = (): SetContribution => useContext(ctx).setDeposit
