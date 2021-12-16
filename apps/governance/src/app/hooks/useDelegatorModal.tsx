import React, { FC } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { useModal } from 'react-modal-hook'

import { ViewportWidth } from '@apps/theme'
import { Modal, Table, TableRow } from '@apps/dumb-components'

import { DelegateCell } from '../components/DelegateCell'
import { useDelegateesAll } from '../context/DelegateeLists'

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
  const [showModal, hideModal] = useModal(
    ({ onExited, in: open }) => (
      <Modal title="User List" onExited={onExited} open={open} hideModal={hideModal}>
        <DelegationContent hideModal={hideModal} delegators={delegators} />
      </Modal>
    ),
    [delegators],
  )
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
              <td />
            </TableRow>
          ))}
        </Table>
      </div>
    </Container>
  )
}
