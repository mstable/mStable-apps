/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import React, { FC, useMemo } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { ReactComponent as LogoSvg } from '@apps/icons/mstable-small.svg'
import { UnstyledButton, ActivitySpinner } from '@apps/dumb-components'
import { TransactionStatus } from '@apps/transaction-manifest'
import { TokenIcon } from '@apps/base/components/core'

import { useTransactionsState } from '../../context/TransactionsProvider'
import { useNetwork } from '../../context/NetworkProvider'

import { Navigation } from './Navigation'
import { SettingsButton } from './SettingsButton'
import { WalletButton } from './WalletButton'

const Logo = styled(LogoSvg)`
  width: 1.75rem;
  height: 1.75rem;
  padding-top: 2px;
`

const LogoAndMasset = styled.div<{ inverted?: boolean }>`
  display: flex;
  align-items: center;

  a {
    border-bottom: 0;
  }

  ${Logo} {
    path,
    rect {
      fill: ${({ theme, inverted }) => (inverted ? theme.color.white : theme.color.body)};
    }

    &:hover {
      path,
      rect {
        transition: fill 0.4s ease;
        fill: ${({ theme }) => theme.color.gold};
      }
    }
  }
`

const AccountButton = styled(UnstyledButton)`
  align-items: center;
  border-radius: 1rem;
  cursor: pointer;
  display: flex;
  font-weight: 600;
  height: 2rem;
  justify-content: space-between;
  line-height: 100%;
  transition: all 0.3s ease;
  background: ${({ theme }) => theme.color.background[1]};

  > * {
    margin-right: 4px;
    &:last-child {
      margin-right: 0;
    }
  }

  &:hover {
    background: ${({ theme }) => theme.color.background[3]};
  }
`

const Inner = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  max-width: 1000px;

  > div {
    flex-basis: 33.33%;
  }
`

const Container = styled.div`
  background: ${({ theme }) => theme.color.background[0]};
  height: 72px;
  display: flex;
  justify-content: center;
  padding-top: 2px;
  border-bottom: 1px solid ${({ theme }) => theme.color.lightBorder};
  grid-column: 2;

  ${AccountButton} {
    color: ${({ theme }) => theme.color.body};
  }
`

const WalletAndSpinner = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  align-items: center;
`

const TransactionsSpinner: FC = () => {
  const transactions = useTransactionsState()

  const pending = useMemo(
    () => Object.values(transactions).some(tx => tx.status === TransactionStatus.Response || tx.status === TransactionStatus.Sent),
    [transactions],
  )

  return <ActivitySpinner pending={pending} />
}

const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 2;

  grid-template-columns:
    1fr
    min(1000px, 100%)
    1fr;
`

export const AppBar: FC = () => {
  const { protocolName } = useNetwork()

  return (
    <StickyHeader>
      <Container>
        <Inner>
          <LogoAndMasset>
            <Link to="/" title="Dashboard">
              <Logo />
            </Link>
          </LogoAndMasset>
          <Navigation />
          <WalletAndSpinner>
            <TransactionsSpinner />
            <WalletButton />
            <SettingsButton>
              <TokenIcon symbol={protocolName.toUpperCase()} />
            </SettingsButton>
          </WalletAndSpinner>
        </Inner>
      </Container>
    </StickyHeader>
  )
}
