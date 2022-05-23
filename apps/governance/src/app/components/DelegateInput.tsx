import { Button } from '@apps/dumb-components'
import { AddressInput } from '@apps/dumb-components'
import { truncateAddress } from '@apps/formatters'
import styled from 'styled-components'

import type { FC } from 'react'

interface Props {
  className?: string
  delegate?: string
  onClick: (address?: string) => void
}

const Delegation = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  line-height: 3rem;
  padding: 0 0.5rem;

  > div > span:first-child {
    ${({ theme }) => theme.mixins.numeric};
    background: ${({ theme }) => theme.color.background[2]};
    padding: 0 0.25rem;
  }
`

const Container = styled.div`
  background: ${({ theme }) => theme.color.background[0]};
  padding: 0.25rem;
  display: flex;
  gap: 0.5rem;
  border-radius: 1rem;
  align-items: center;
`

export const DelegateInput: FC<Props> = ({ delegate, onClick, className }) => {
  return (
    <Container className={className}>
      {delegate ? (
        <Delegation>
          <div>
            Delegating to <span>{truncateAddress(delegate)}</span>
          </div>
          <Button onClick={() => onClick(undefined)}>Edit</Button>
        </Delegation>
      ) : (
        <AddressInput onClick={onClick} title="Delegate" />
      )}
    </Container>
  )
}
