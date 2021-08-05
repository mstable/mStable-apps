import React, { FC } from 'react'
import { Table, TableRow, TableCell, CountUp, Button } from '@apps/components/core'
import styled from 'styled-components'
import { useTokens } from '@apps/base/context/tokens'
import { usePropose } from '@apps/base/context/transactions'
import { Interfaces, TransactionManifest } from '@apps/transaction-manifest'
import { TokenIcon } from '@apps/components/icons'
import { useFraxStakingContract, useFraxStakingState } from 'apps/protocol/src/app/context/FraxStakingProvider'

const TABLE_CELL_WIDTHS = [60, 40]

// TODO: - replace with subscribedtoken when available
const MOCK_TOKENS: Record<string, string> = {
  '0xf501dd45a1198c2e1b5aef5314a68b9006d842e0': 'MTA',
  '0x3e121107f6f22da4911079845a470757af4e1a1b': 'FXS',
}

const Claim = styled(Button)`
  width: 12rem;
`

const Rewards = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  > *:not(:last-child) {
    margin-bottom: 1rem;
  }
`

const Token = styled.div`
  display: flex;
  align-items: center;

  h3 {
    margin: 0;
    font-weight: 600;
  }

  > *:first-child {
    height: 2rem;
    width: 2rem;
    margin-right: 0.5rem;
  }
`

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`

const Container = styled.div``

export const FraxRewards: FC = () => {
  const { subscribed: fraxAccountData } = useFraxStakingState() ?? {}
  const contract = useFraxStakingContract()
  const propose = usePropose()

  const accountData = fraxAccountData?.value?.accountData
  const hasRewards = !!accountData?.earned.length
  const headerTitles = ['Token', 'Earned'].map(t => ({ title: t }))

  const handleClaim = (): void => {
    if (!contract) return
    propose<Interfaces.FraxCrossChainFarm, 'getReward'>(
      new TransactionManifest(contract, 'getReward', [], {
        present: 'Claiming rewards',
        past: 'Claimed rewards',
      }),
    )
  }

  const tokens = useTokens(accountData?.earned?.map(v => v.address) ?? [])

  return (
    <Container>
      {hasRewards ? (
        <Rewards>
          <Table headerTitles={headerTitles} widths={TABLE_CELL_WIDTHS} width={48}>
            {accountData?.earned.map(({ address, amount }) => {
              const token = tokens.find(v => v.address === address)
              return (
                <TableRow key={address}>
                  <TableCell width={TABLE_CELL_WIDTHS[0]}>
                    <Token>
                      <TokenIcon symbol={token?.symbol ?? MOCK_TOKENS[address]} />
                      <h3>{token?.symbol ?? MOCK_TOKENS[address]}</h3>
                    </Token>
                  </TableCell>
                  <TableCell width={TABLE_CELL_WIDTHS[2]}>
                    <CountUp end={amount?.simple} decimals={4} />
                  </TableCell>
                </TableRow>
              )
            })}
          </Table>
          <Claim highlighted onClick={handleClaim}>
            Claim Rewards
          </Claim>
        </Rewards>
      ) : (
        <EmptyState>
          <h3>Stake your LP token balance to begin earning rewards</h3>
        </EmptyState>
      )}
    </Container>
  )
}
