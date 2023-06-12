import { useMemo } from 'react'

import { useAccount } from '@apps/base/context/account'
import { usePropose } from '@apps/base/context/transactions'
import { BigDecimal } from '@apps/bigdecimal'
import { Button, Table, TableCell, TableRow, Tooltip } from '@apps/dumb-components'
import { TransactionManifest } from '@apps/transaction-manifest'
import styled from 'styled-components'

import { useStakedTokenContract, useStakedTokenQuery } from '../../context/StakedToken'

import type { Interfaces } from '@apps/transaction-manifest'
import type { FC } from 'react'

const TABLE_WIDTHS = [33, 33, 33]

interface Props {
  balance?: BigDecimal
  symbol?: string
  percentage?: number
  endTime?: number
  unlocked?: boolean
}

const StyledTable = styled(Table)`
  tr {
    color: ${({ theme }) => theme.color.bodyAccent};
  }

  td {
    padding: 0 1.25rem;
  }

  tr > *:nth-child(1) {
    span {
      margin-left: 0.25rem;
    }
  }

  tr > *:nth-child(2) {
    span {
      ${({ theme }) => theme.mixins.numeric};
      color: ${({ theme }) => theme.color.body};
      margin-right: 0.25rem;
    }
  }
`

const getData = (
  startTime?: number,
  endTime?: number,
): {
  startTime: number
  endTime: number
  percentage: number
  complete: boolean
} => {
  const dateRange = endTime - startTime
  const percentage = 100 * ((endTime - Date.now()) / dateRange)
  return {
    startTime,
    endTime,
    percentage,
    complete: endTime < Date.now(),
  }
}

export const PendingBalances: FC = () => {
  const { data } = useStakedTokenQuery()

  const propose = usePropose()
  const stakedTokenContract = useStakedTokenContract()
  const address = useAccount()

  const { balance, unlocked, symbol } = useMemo<Props>((): Props => {
    const stakedToken = data?.stakedToken
    const account = stakedToken?.accounts?.[0]
    if (!data || !stakedToken || !account) return {}

    const {
      balance: { cooldownTimestamp, cooldownUnits: units },
    } = account

    const startTime = cooldownTimestamp * 1e3
    const cooldownSeconds = parseInt(stakedToken?.COOLDOWN_SECONDS) * 1e3
    const unstakeSeconds = parseInt(stakedToken?.UNSTAKE_WINDOW) * 1e3

    const pending = getData(startTime, startTime + cooldownSeconds)
    const unlocked = pending.complete && getData(pending.endTime, pending.endTime + unstakeSeconds)

    return {
      balance: new BigDecimal(units.toString()),
      symbol: stakedToken.stakingToken.symbol,
      percentage: unlocked.percentage ?? pending.percentage,
      endTime: unlocked.endTime ?? pending.endTime,
      unlocked: true, // all pending stakes where unlock on contract side
    }
  }, [data])

  const title = unlocked ? 'Withdrawable:' : 'Pending cooldown:'
  const buttonTitle = unlocked ? 'Withdraw' : 'Cancel'

  const tooltipMessage = unlocked
    ? 'Your balance is now withdrawable, please claim within the allotted timeframe'
    : 'Your balance will be available for withdrawal after a cooldown period'

  const handleWithdrawal = () => {
    if (!stakedTokenContract || !data) return

    return propose<Interfaces.StakedToken, 'withdraw'>(
      new TransactionManifest(stakedTokenContract, 'withdraw', [balance.exact, address, true, true], {
        present: `Withdraw ${balance?.simple} ${symbol}`,
        past: `Withdrew ${balance?.simple} ${symbol}`,
      }),
    )
  }

  return (
    !!balance?.simple && (
      <StyledTable widths={TABLE_WIDTHS} width={28}>
        <TableRow buttonTitle={buttonTitle} onClick={handleWithdrawal}>
          <TableCell width={TABLE_WIDTHS[0]}>
            {title} <Tooltip tip={tooltipMessage} />
          </TableCell>
          <TableCell width={TABLE_WIDTHS[1]}>
            <span>{`${balance?.simple ?? 0} `}</span>
            {symbol}
          </TableCell>
          <TableCell width={TABLE_WIDTHS[2]}>
            <Button highlighted onClick={handleWithdrawal}>
              {buttonTitle}
            </Button>
          </TableCell>
        </TableRow>
      </StyledTable>
    )
  )
}
