import { truncateAddress } from '@apps/formatters'
import React, { FC } from 'react'
import styled from 'styled-components'

import { useAccount } from '@apps/base/context/account'
import { usePropose } from '@apps/base/context/transactions'
import { Interfaces, TransactionManifest } from '@apps/transaction-manifest'
import { Button, ThemedSkeleton } from '@apps/components/core'

import { StakedTokenSwitcher } from '../../components/StakedTokenSwitcher'
import { useStakedTokenQuery, useStakedTokenContract } from '../../context/StakedTokenProvider'

const Check: FC = () => (
  <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="10" fill="#2ABC13" />
    <path d="M6 11.105L7.92 13 14 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const Delegated = styled.div`
  display: flex;
  gap: 0.5rem;
`

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 1rem;
  background: ${({ theme }) => theme.color.background[1]};
`

export const DelegateeToggle: FC<{ address?: string; stakedTokenSwitcher?: boolean }> = ({ address, stakedTokenSwitcher }) => {
  const propose = usePropose()
  const stakedTokenContract = useStakedTokenContract()
  const account = useAccount()

  const stakedTokenQuery = useStakedTokenQuery()
  const delegatee = stakedTokenQuery.data?.stakedToken.accounts?.[0]?.delegatee
  const isDelegated = delegatee && address && delegatee.id.toLowerCase() === address.toLowerCase()

  return (
    <Container>
      {stakedTokenSwitcher && <StakedTokenSwitcher />}
      {address ? (
        isDelegated ? (
          <>
            <Delegated>
              <Check />
              Delegated
            </Delegated>
            <Button
              highlighted
              onClick={() => {
                if (!stakedTokenContract) return

                propose<Interfaces.StakedToken, 'delegate'>(
                  new TransactionManifest(stakedTokenContract, 'delegate', [account], {
                    present: 'Disabling delegation',
                    past: 'Disabled delegation',
                  }),
                )
              }}
            >
              Undelegate
            </Button>
          </>
        ) : (
          <Button
            highlighted
            onClick={() => {
              if (!stakedTokenContract) return

              propose<Interfaces.StakedToken, 'delegate'>(
                new TransactionManifest(stakedTokenContract, 'delegate', [address], {
                  present: `Delegating to ${truncateAddress(address)}`,
                  past: `Delegated to ${truncateAddress(address)}`,
                }),
              )
            }}
          >
            Delegate
          </Button>
        )
      ) : (
        <ThemedSkeleton height={40} width={110} />
      )}
    </Container>
  )
}
