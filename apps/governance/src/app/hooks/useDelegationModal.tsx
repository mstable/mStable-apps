import { useModalDataDispatch } from '@apps/base/context/modal-data'
import { AddressInput, Modal } from '@apps/dumb-components'
import { ViewportWidth } from '@apps/theme'
import { useModal } from 'react-modal-hook'
import styled from 'styled-components'

import { Leaderboard } from '../pages/Vote/Leaderboard'

import type { FC } from 'react'

const StyledAddressInput = styled(AddressInput)`
  background: ${({ theme }) => theme.color.background[0]};
  border-radius: 1rem;
  padding: 0.25rem 0.5rem;
`

const CustomDelegate = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.color.background[1]};
  justify-content: space-between;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 0.75rem;
  gap: 1rem;

  @media (min-width: ${ViewportWidth.s}) {
    flex-direction: row;
    align-items: center;
  }
`

const Container = styled.div`
  max-height: 75vh;
  background: ${({ theme }) => theme.color.background[0]};
  color: ${({ theme }) => theme.color.body};
  padding: 0.5rem;
  overflow-y: scroll;

  p {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.color.bodyTransparent};
    margin-left: 0.5rem;
  }

  @media (min-width: ${ViewportWidth.m}) {
    width: 42rem;
    padding: 1rem 1rem 1.5rem;
  }
`

export const useDelegationModal = (): [() => void, () => void] => {
  const [showModal, hideModal] = useModal(({ onExited, in: open }) => (
    <Modal title="Delegation List" onExited={onExited} open={open} hideModal={hideModal}>
      <DelegationContent hideModal={hideModal} />
    </Modal>
  ))
  return [showModal, hideModal]
}

const DelegationContent: FC<{ hideModal?: () => void }> = ({ hideModal }) => {
  const { setDelegateSelection } = useModalDataDispatch()

  const handleRowClick = (id: string): void => {
    setDelegateSelection(id)
    hideModal()
  }

  return (
    <Container>
      <div>
        <CustomDelegate>
          <p>Select a delegate from the list below or enter an address manually</p>
          <StyledAddressInput onClick={handleRowClick} title="Delegate" />
        </CustomDelegate>
        <Leaderboard delegation onClick={handleRowClick} />
      </div>
    </Container>
  )
}
