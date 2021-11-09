import React, { ChangeEventHandler, FC, useCallback, useRef, useState } from 'react'
import styled from 'styled-components'
import { CSSTransition } from 'react-transition-group'
import { setTimeout } from 'timers'
import { isAddress } from 'ethers/lib/utils'

import { Button } from './Button'
import { Input } from './Input'

interface Props {
  onClick: (address?: string) => void
  title?: string
  className?: string
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

const Container = styled.div`
  display: flex;
  gap: 0.25rem;
  width: 100%;
  align-items: center;
`

export const AddressInput: FC<Props> = ({ onClick, title, className }) => {
  const inputValue = useRef<string | undefined>()
  const [invalid, setInvalid] = useState(false)

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(event => {
    inputValue.current = event.target.value
  }, [])

  const handleClick = useCallback(() => {
    const address = inputValue.current ?? ''
    if (!isAddress(address)) {
      setInvalid(true)
      setTimeout(() => setInvalid(false), 200)
      return
    }
    onClick(address)
  }, [onClick])

  return (
    <Container className={className}>
      <CSSTransition in={invalid} timeout={200}>
        {className => <StyledInput className={className} placeholder="0x0000…0000" onChange={handleChange} />}
      </CSSTransition>
      <Button onClick={handleClick}>{title}</Button>
    </Container>
  )
}
