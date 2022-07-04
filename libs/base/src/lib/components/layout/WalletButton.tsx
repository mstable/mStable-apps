import { UnstyledButton } from '@apps/dumb-components'
import { truncateAddress } from '@apps/formatters'
import { ViewportWidth } from '@apps/theme'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import styled from 'styled-components'
import { useAccount, useEnsAvatar, useEnsName } from 'wagmi'

import { useAccountModal } from '../../hooks/useAccountModal'
import { useUnsupportedNetworkModal } from '../../hooks/useUnsupportedNetworkModal'
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

const WrongNetwork = styled(AccountButton)`
  color: red;
  > :first-child {
    margin-bottom: 0.25rem;
  }
  > :last-child {
    font-weight: normal;
  }
`

export const WalletButton: FC = () => {
  const { data: account } = useAccount()
  const { data: ensName } = useEnsName({
    address: account?.address,
  })
  const { data: ensAvatar } = useEnsAvatar({
    addressOrName: account?.address,
  })
  const [showAccountModal] = useAccountModal()
  const [showUnsupportedNetworkModal] = useUnsupportedNetworkModal()

  return (
    <ConnectButton.Custom>
      {({ account, chain, openConnectModal, mounted }) => (
        <div
          {...(!mounted && {
            'aria-hidden': true,
            style: {
              opacity: 0,
              pointerEvents: 'none',
              userSelect: 'none',
            },
          })}
        >
          {(() => {
            if (!mounted || !account || !chain) {
              return (
                <AccountButton onClick={openConnectModal}>
                  <ConnectText>Connect</ConnectText>
                </AccountButton>
              )
            }

            if (chain.unsupported) {
              return (
                <WrongNetwork onClick={showUnsupportedNetworkModal}>
                  <span role="img" aria-label="Warning">
                    ⚠️
                  </span>
                  &nbsp;Wrong Network
                </WrongNetwork>
              )
            }

            return (
              <AccountButton onClick={showAccountModal}>
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
            )
          })()}
        </div>
      )}
    </ConnectButton.Custom>
  )
}
