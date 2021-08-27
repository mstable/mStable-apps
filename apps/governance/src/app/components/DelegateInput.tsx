import React, { ChangeEventHandler, FC, useCallback, useRef, useState } from 'react'
import { Button } from '@apps/components/core'
import { truncateAddress } from '@apps/formatters'
import { ethers } from 'ethers'
import { Input } from 'libs/components/src/lib/forms/Input'
import styled from 'styled-components'
import { CSSTransition } from 'react-transition-group'
import { setTimeout } from 'timers'

interface Props {
  delegate?: string
  onClick?: (address: string) => void
}

const StyledInput = styled(Input)`
  ${({ theme }) => theme.mixins.numeric};
  background: ${({ theme }) => theme.color.background[0]};
  width: 100%;

  @keyframes shake {
    8%,
    41% {
      -webkit-transform: translateX(-10px);
    }
    25%,
    58% {
      -webkit-transform: translateX(10px);
    }
    75% {
      -webkit-transform: translateX(-5px);
    }
    92% {
      -webkit-transform: translateX(5px);
    }
    0%,
    100% {
      -webkit-transform: translateX(0);
    }
  }

  &.entering {
    animation: shake 0.5s linear;
  }
`

const Delegation = styled.p`
  line-height: 3rem;
  width: 100%;
  padding: 0 0.5rem;

  span {
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

  > *:last-child {
    margin-right: 0.25rem;
  }
`

export const DelegateInput: FC<Props> = ({ delegate, onClick }) => {
  const inputValue = useRef<string | undefined>()
  const [invalid, setInvalid] = useState(false)

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(event => {
    inputValue.current = event.target.value
  }, [])

  const resetDelegate = useCallback(() => onClick(undefined), [])

  const handleDelegation = useCallback(() => {
    const address = inputValue.current
    if (!ethers.utils.isAddress(address)) {
      setInvalid(true)
      setTimeout(() => setInvalid(false), 200)
      return
    }
    onClick(address)
  }, [delegate])

  return (
    <Container>
      {delegate ? (
        <Delegation>
          Delegating to <span>{truncateAddress(delegate)}</span>
        </Delegation>
      ) : (
        <CSSTransition in={invalid} timeout={200}>
          {className => <StyledInput className={className} placeholder="0x0000…0000" onChange={handleChange} />}
        </CSSTransition>
      )}
      <Button onClick={!!delegate ? resetDelegate : handleDelegation}>{delegate ? 'Edit' : 'Delegate'}</Button>
    </Container>
  )
}
