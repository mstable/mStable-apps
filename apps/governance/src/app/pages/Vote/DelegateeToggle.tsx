import { truncateAddress } from '@apps/formatters'
import React, { FC } from 'react'
import styled from 'styled-components'

import { StakedToken__factory } from '@apps/artifacts/typechain'
import { useAccount, useSigner } from '@apps/base/context/account'
import { usePropose } from '@apps/base/context/transactions'
import { Interfaces, TransactionManifest } from '@apps/transaction-manifest'
import { Button, ThemedSkeleton } from '@apps/components/core'

import { StakedTokenSwitcher } from '../../components/StakedTokenSwitcher'
import { useStakedToken, useStakedTokenQuery } from '../../context/StakedTokenProvider'

const Check: FC = () => (
  <svg width="20" height="20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="10" fill="#2ABC13" />
    <path d="M6 11.105L7.92 13 14 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

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
  const signer = useSigner()
  const account = useAccount()

  const stakedToken = useStakedToken()
  const stakedTokenQuery = useStakedTokenQuery()
  const delegatee = stakedTokenQuery.data?.stakedToken.accounts?.[0]?.delegatee
  const isDelegated = delegatee && address && delegatee.id.toLowerCase() === address.toLowerCase()

  return (
    <Container>
      {stakedTokenSwitcher && <StakedTokenSwitcher />}
      {address ? (
        isDelegated ? (
          <>
            <div>
              <Check />
              Delegated
            </div>
            <Button
              highlighted
              onClick={() => {
                propose<Interfaces.StakedToken, 'delegate'>(
                  new TransactionManifest(StakedToken__factory.connect(stakedToken.selected, signer), 'delegate', [account], {
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
              propose<Interfaces.StakedToken, 'delegate'>(
                new TransactionManifest(StakedToken__factory.connect(stakedToken.selected, signer), 'delegate', [address], {
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
