import { UnstyledButton } from '@apps/dumb-components'
import { truncateAddress } from '@apps/formatters'
import { ViewportWidth } from '@apps/theme'
import styled from 'styled-components'

import { useConnect, useConnected, useEnsAvatar, useEnsName, useInjectedChainIdCtx, useWalletAddress } from '../../context/AccountProvider'
import { ChainIds, getNetwork, useChainIdCtx } from '../../context/NetworkProvider'
import { useAccountModal } from '../../hooks/useAccountModal'
import { UserIcon, UserIconContainer } from '../core'

import type { FC } from 'react'

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

const WrongNetwork = styled.div`
  color: red;
  > :first-child {
    margin-bottom: 0.25rem;
  }
  > :last-child {
    font-weight: normal;
  }
`

const Container = styled(AccountButton)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const WalletButton: FC = () => {
  const connected = useConnected()
  const account = useWalletAddress()
  const ensName = useEnsName()
  const ensAvatar = useEnsAvatar()
  const [injectedChainId] = useInjectedChainIdCtx()
  const [chainId] = useChainIdCtx()

  const injectedNetwork = getNetwork(injectedChainId ?? ChainIds.EthereumMainnet)
  const [showAccountModal] = useAccountModal()

  const connect = useConnect()

  const handleClick = (): void => {
    if (connected && account) {
      return showAccountModal()
    }
    connect()
  }

  return (
    <Container title="Account" onClick={handleClick}>
      {injectedChainId && chainId !== injectedChainId ? (
        <>
          <div>
            <UserIcon />
          </div>
          <WrongNetwork>
            <div>
              <span role="img" aria-label="Warning">
                ⚠️
              </span>{' '}
              Wrong network
            </div>
            <div>{injectedNetwork ? `${injectedNetwork.protocolName} (${injectedNetwork.chainName})` : `Chain ID ${injectedChainId}`}</div>
          </WrongNetwork>
        </>
      ) : connected ? (
        <>
          {ensName ? <ENSName>{ensName}</ENSName> : <TruncatedAddress>{account && truncateAddress(account)}</TruncatedAddress>}
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
    </Container>
  )
}
