import { Modal } from '@apps/dumb-components'
import { ViewportWidth } from '@apps/theme'
import { useModal } from 'react-modal-hook'
import styled from 'styled-components'

import { WithdrawCard } from './WithdrawCard'

import type { LegacyContract } from './types'

const Container = styled.div`
  background: ${({ theme }) => theme.color.background[0]};
  color: ${({ theme }) => theme.color.body};
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: hidden;

  @media (min-width: ${ViewportWidth.m}) {
    width: 34rem;
    padding: 1rem 1rem 1.5rem;
    > *:not(:last-child) {
      margin-bottom: 0;
    }
  }
`

const Description = styled.p`
  border-top: 1px solid ${({ theme }) => theme.color.lighterGrey};
  margin-bottom: 2rem;
`

const Pools = styled.span`
  font-size: 1rem;
  font-weight: bold;
`

const Cards = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 60vh;
  overflow-y: auto;
  padding: 0.5rem 0;
`

export const useLegacyWithdrawModal = (contracts: LegacyContract[]): [() => void, () => void] => {
  const [showModal, hideModal] = useModal(({ onExited, in: open }) => (
    <Modal title="Legacy contract withdraw" onExited={onExited} open={open} hideModal={hideModal}>
      <Container>
        <Description>
          You still have staked tokens on contracts that are no longer supported, we highly recommend withdrawing them.
        </Description>
        <Pools>Pools</Pools>
        <Cards>
          {contracts.map(contract => (
            <WithdrawCard key={contract.address} contract={contract} />
          ))}
        </Cards>
      </Container>
    </Modal>
  ))

  return [showModal, hideModal]
}
