import React, { FC } from 'react'
import styled from 'styled-components'
import { useModal } from 'react-modal-hook'

import { ViewportWidth } from '@apps/base/theme'
import { Modal, Table, TableRow } from '@apps/components/core'
import { StakingStatusProvider } from '../context/StakingStatusProvider'
import { Leaderboard } from '../pages/Vote/Leaderboard'
import { AddressInput } from '@apps/components/forms'
import { useModalDataDispatch } from 'libs/base/src/lib/context/ModalDataProvider'
import { DelegateCell } from '../components/DelegateCell'
import { useDelegateesAll } from '../context/DelegateeListsProvider'
import { useHistoricTransactionsLazyQuery } from '@apps/artifacts/graphql/protocol'
import { useHistory } from 'react-router-dom'

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

export const useDelegatorModal = (delegators: string[]): [() => void, () => void] => {
  const [showModal, hideModal] = useModal(({ onExited, in: open }) => (
    <Modal title="User List" onExited={onExited} open={open} hideModal={hideModal}>
      <StakingStatusProvider>
        <DelegationContent hideModal={hideModal} delegators={delegators} />
      </StakingStatusProvider>
    </Modal>
  ))
  return [showModal, hideModal]
}

const DelegationContent: FC<{ hideModal?: () => void; delegators: string[] }> = ({ hideModal, delegators }) => {
  const delegateesAll = useDelegateesAll()
  const history = useHistory()

  const handleRowClick = (id: string): void => {
    history.push(id)
    hideModal()
  }

  return (
    <Container>
      <div>
        <Table widths={[100]}>
          {delegators.map((id, index) => (
            <TableRow key={id} buttonTitle="View profile" onClick={() => handleRowClick(id)}>
              <DelegateCell width={100} address={id} delegatee={delegateesAll[id]} rank={index} />
              <div />
            </TableRow>
          ))}
        </Table>
      </div>
    </Container>
  )
}
