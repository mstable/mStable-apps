import React, { useRef } from 'react'
import type { FC } from 'react'
import styled from 'styled-components'

import { AddressInput } from '@apps/components/forms'
import { Button } from '@apps/components/core'
import { useIsMasquerading, useMasquerade } from '@apps/base/context/account'
import { truncateAddress } from '@apps/formatters'

const StyledAddressInput = styled(AddressInput)`
  input {
    font-size: 1.25rem;
    padding-left: 0;
  }
`

const Masquerade = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
  align-items: center;
  line-height: 3rem;

  > span:first-child {
    ${({ theme }) => theme.mixins.numeric};
    font-size: 1.25rem;
  }
`

const Container = styled.div`
  flex: 1;
  padding: 0.75rem 1rem 0.25rem 1rem;
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  border-radius: 1rem;
  width: 100%;

  > h4 {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.color.bodyAccent};
  }
`

export const UserLookup: FC = () => {
  const inputText = useRef<string | undefined>()
  const masquerade = useMasquerade()
  const isMasquerading = useIsMasquerading()

  const handleClick = (address?: string) => {
    inputText.current = address
    if (!isMasquerading) {
      masquerade(address)
    } else {
      masquerade(undefined)
    }
  }

  return (
    <Container>
      <h4>{isMasquerading ? 'Viewing balance of' : 'Lookup user balance'}</h4>
      {isMasquerading ? (
        <Masquerade>
          <span>{truncateAddress(inputText.current ?? '')}</span>
          <Button onClick={() => masquerade()}>Reset</Button>
        </Masquerade>
      ) : (
        <StyledAddressInput title="View" onClick={handleClick} />
      )}
    </Container>
  )
}
