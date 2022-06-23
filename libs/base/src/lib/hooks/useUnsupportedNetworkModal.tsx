import { Button, Modal } from '@apps/dumb-components'
import { ViewportWidth } from '@apps/theme'
import { useModal } from 'react-modal-hook'
import styled from 'styled-components'
import { useConnect, useDisconnect, useNetwork } from 'wagmi'

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

const SwitchButton = styled(Button)`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;

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

const Actions = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-end;

  > * {
    margin-left: 1rem;
  }
`

export const useUnsupportedNetworkModal = (): [() => void, () => void] => {
  const [showModal, hideModal] = useModal(({ onExited, in: open }) => {
    // "Modals are also functional components and can use react hooks themselves"
    /* eslint-disable react-hooks/rules-of-hooks */
    const { activeChain, switchNetwork } = useNetwork()
    const { isConnected } = useConnect()
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
            <b>{activeChain?.name}</b> is not supported by this application.
          </Header>
          <Actions>
            <SwitchButton onClick={handleSwitch}>
              Switch to Ethereum mainnet
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
