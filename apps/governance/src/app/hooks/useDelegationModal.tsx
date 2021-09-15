import React, { FC } from 'react'
import styled from 'styled-components'
import { useModal } from 'react-modal-hook'

import { ViewportWidth } from '@apps/base/theme'
import { Modal } from '@apps/components/core'
import { StakingStatusProvider } from '../context/StakingStatusProvider'
import { Leaderboard } from '../pages/Vote/Leaderboard'
import { AddressInput } from '@apps/components/forms'
import { useModalDataDispatch } from 'libs/base/src/lib/context/ModalDataProvider'

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
  background: ${({ theme }) => theme.color.background[0]};
  color: ${({ theme }) => theme.color.body};
  padding: 0.5rem;

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
      <StakingStatusProvider>
        <DelegationContent hideModal={hideModal} />
      </StakingStatusProvider>
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
