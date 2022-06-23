import { useRef } from 'react'

import { UnstyledButton } from '@apps/dumb-components'
import { truncateAddress } from '@apps/formatters'
import { ViewportWidth } from '@apps/theme'
import { useToggle } from 'react-use'
import styled from 'styled-components'
import useOnClickOutside from 'use-onclickoutside'
import { useAccount, useConnect, useEnsAvatar, useEnsName } from 'wagmi'

import { useAccountModal } from '../../hooks/useAccountModal'
import { UserIcon, UserIconContainer } from '../core'

import type { FC } from 'react'
import type { Connector } from 'wagmi'

const ConnectText = styled.span`
  padding: 0 0.5rem;
`

const AccountButton = styled(UnstyledButton)`
  align-items: center;
  border-radius: 0.5rem;
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

const ENSName = styled.span`
  display: none;
  font-weight: normal;
  font-size: 0.875rem;
  padding: 0 0.25rem;
  @media (min-width: ${ViewportWidth.m}) {
    text-transform: lowercase;
    display: inherit;
  }
`

const TruncatedAddress = styled.span`
  display: none;
  font-weight: normal;
  font-size: 0.875rem;
  padding: 0 0.25rem;

  @media (min-width: ${ViewportWidth.m}) {
    font-family: 'DM Mono', monospace;
    text-transform: none;
    display: inherit;
  }
`

const Container = styled.div`
  position: relative;
`

const List = styled.div`
  position: absolute;
  border-radius: 0.75rem;
  right: 0;
  top: 2.5rem;
  background: ${({ theme }) => theme.color.background[0]};
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  min-width: 5.5rem;
  z-index: 1;
  padding: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 0.5rem;
  row-gap: 0.5rem;
`

const ConnectorButton = styled.div`
  width: 160px;
  height: 80px;
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  cursor: pointer;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;

  &:hover {
    background: ${({ theme }) => theme.color.background[1]};
  }

  > span {
    font-size: 0.8rem;
  }
`

export const WalletButton: FC<{ className?: string }> = props => {
  const { data: account } = useAccount()
  const { data: ensName } = useEnsName({
    address: account?.address,
  })
  const { data: ensAvatar } = useEnsAvatar({
    addressOrName: account?.address,
  })
  const { connect, isConnected, connectors } = useConnect()
  const [showAccountModal] = useAccountModal()
  const [show, toggleShow] = useToggle(false)
  const container = useRef(null)

  const handleConnect = (connector: Connector) => () => {
    toggleShow(false)
    connect(connector)
  }

  useOnClickOutside(container, () => toggleShow(false))

  return (
    <Container title="Account" {...props} ref={container}>
      <AccountButton onClick={isConnected ? showAccountModal : toggleShow}>
        {account?.address ? (
          <>
            {ensName ? (
              <ENSName>{ensName}</ENSName>
            ) : (
              <TruncatedAddress>{account.address && truncateAddress(account.address)}</TruncatedAddress>
            )}
            {ensAvatar ? (
              <UserIconContainer>
                <img src={ensAvatar} width={20} alt="Account" />
              </UserIconContainer>
            ) : (
              <UserIcon />
            )}
          </>
        ) : (
          <ConnectText>Connect</ConnectText>
        )}
      </AccountButton>
      <List hidden={!show}>
        {connectors?.map(con => (
          <ConnectorButton key={con.id} onClick={handleConnect(con)}>
            <span>{con.name}</span>
          </ConnectorButton>
        ))}
      </List>
    </Container>
  )
}
