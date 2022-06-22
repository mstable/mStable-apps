import { Button, Modal } from '@apps/dumb-components'
import { ViewportWidth } from '@apps/theme'
import { useModal } from 'react-modal-hook'
import styled from 'styled-components'
import { useConnect, useDisconnect, useNetwork } from 'wagmi'

import { ChainIds } from '../context/NetworkProvider'

const Container = styled.div`
  background: ${({ theme }) => theme.color.background[0]};
  color: ${({ theme }) => theme.color.body};
  padding: 0 1rem;

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
      <Modal title="Network" onExited={onExited} open={open} hideModal={hideModal}>
        <Container>
          <div>
            <h3>Unsupported Network {activeChain?.name}</h3>
            <p>This application does not support the selected network. You can switch network or disconnect</p>
            <div>
              <Button onClick={handleDisconnect}>Disconnect</Button>
              <Button onClick={handleSwitch}>Switch Network</Button>
            </div>
          </div>
        </Container>
      </Modal>
    )
  })

  return [showModal, hideModal]
}
