import { Button, Modal } from '@apps/dumb-components'
import { ViewportWidth } from '@apps/theme'
import { useModal } from 'react-modal-hook'
import styled from 'styled-components'
import { useConnect, useDisconnect } from 'wagmi'

import { Address } from '../components/core'
import { useWalletAddress } from '../context/AccountProvider'

const DisconnectButton = styled(Button)`
  color: ${({ theme }) => theme.color.white};
  background: ${({ theme }) => theme.color.red};
`

const AddressGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 1rem;

  > div {
    margin-bottom: 0.5rem;

    > a {
      ${({ theme }) => theme.mixins.numeric}
      padding: 0.5rem 1rem;
      border-radius: 1rem;
      border: 1px solid ${({ theme }) => theme.color.defaultBorder};
      color: ${({ theme }) => theme.color.body};
    }
    a:hover {
      color: ${({ theme }) => theme.color.bodyAccent};
    }
  }

  @media (min-width: ${ViewportWidth.s}) {
    flex-direction: row;

    > div {
      margin-bottom: 0;
    }
  }
`

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
export const useAccountModal = (): [() => void, () => void] => {
  const [showModal, hideModal] = useModal(({ onExited, in: open }) => {
    // "Modals are also functional components and can use react hooks themselves"
    /* eslint-disable react-hooks/rules-of-hooks */
    const address = useWalletAddress()
    const { activeConnector } = useConnect()
    const { disconnect } = useDisconnect()

    const handleClick = (): void => {
      if (address) {
        disconnect()
      }
      hideModal()
    }

    return (
      <Modal title="Account" onExited={onExited} open={open} hideModal={hideModal}>
        {activeConnector?.name && address && (
          <Container>
            <div>
              <h3>Connected with {activeConnector.name}</h3>
              <AddressGroup>
                <Address address={address} type="account" copyable />
                <DisconnectButton type="button" onClick={handleClick}>
                  Disconnect
                </DisconnectButton>
              </AddressGroup>
            </div>
          </Container>
        )}
      </Modal>
    )
  })

  return [showModal, hideModal]
}
