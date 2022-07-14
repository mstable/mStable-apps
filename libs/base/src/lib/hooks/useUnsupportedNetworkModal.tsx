import { useLayoutEffect } from 'react'

import { Button, Modal } from '@apps/dumb-components'
import { ViewportWidth } from '@apps/theme'
import { useModal } from 'react-modal-hook'
import styled from 'styled-components'
import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi'

import { TokenIconSvg } from '../components/core'
import { ChainIds } from '../context/NetworkProvider'

const Container = styled.div`
  background: ${({ theme }) => theme.color.background[0]};
  color: ${({ theme }) => theme.color.body};
  padding: 2rem;
  display: flex;
  flex-flow: column nowrap;

  > div:first-child {
    padding: 1rem 1rem 2rem 1rem;

    h3 {
      font-size: 1rem;
      font-weight: 600;
    }
  }

  @media (min-width: ${ViewportWidth.m}) {
    width: 34rem;
    padding: 1rem 1rem 1.5rem;
    > *:not(:last-child) {
      margin-bottom: 0;
    }
  }
`

const Header = styled.div`
  padding: 0 1rem;

  h3 {
    font-size: 1.25rem;
    color: ${({ theme }) => theme.color.body};
    margin-bottom: 0.75rem;
  }

  p {
    font-size: 0.875rem;
  }
`

const Actions = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;

  > *:not(:first-child) {
    margin-left: 1rem;
  }
`

const SwitchButton = styled(Button)`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  flex-grow: 1;

  > svg {
    margin-left: 0.5rem;
  }

  &:hover {
    > svg {
      fill: ${({ theme }) => theme.color.gold};
    }
  }
`

const DisconnectButton = styled(Button)`
  color: ${({ theme }) => theme.color.white};
  background: ${({ theme }) => theme.color.red};
`

export const useUnsupportedNetworkModal = (): [() => void, () => void] => {
  const [showModal, hideModal] = useModal(({ onExited, in: open }) => {
    // "Modals are also functional components and can use react hooks themselves"
    /* eslint-disable react-hooks/rules-of-hooks */
    const { chain } = useNetwork()
    const { isConnected } = useAccount()
    const { switchNetwork } = useSwitchNetwork()
    const { disconnect } = useDisconnect()

    const handleSwitch = (): void => {
      if (switchNetwork) {
        switchNetwork(ChainIds.EthereumMainnet)
      }
      hideModal()
    }

    const handleDisconnect = (): void => {
      if (isConnected) {
        disconnect()
      }
      hideModal()
    }

    return (
      <Modal title="Unsupported Network" onExited={onExited} open={open} hideModal={hideModal}>
        <Container>
          <Header>
            The selected network ({chain?.name}) is not supported by the application. You can either switch your wallet or reset to Ethereum
            mainnet.
          </Header>

          <Actions>
            <SwitchButton onClick={handleSwitch}>
              Reset to Ethereum mainnet
              <TokenIconSvg symbol="eth" width={24} height={24} />
            </SwitchButton>
            <DisconnectButton onClick={handleDisconnect}>Disconnect</DisconnectButton>
          </Actions>
        </Container>
      </Modal>
    )
  })

  return [showModal, hideModal]
}

export const useUnsupportedNetwork = () => {
  const { chain } = useNetwork()
  const { isConnected } = useAccount()
  const [showDialog, hideDialog] = useUnsupportedNetworkModal()

  useLayoutEffect(() => {
    if (chain?.unsupported) {
      showDialog()
    } else {
      hideDialog()
    }
  }, [hideDialog, showDialog, isConnected, chain?.unsupported])
}
