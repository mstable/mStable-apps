import { TokenIcon } from '@apps/components/icons'
import React, { FC } from 'react'
import styled from 'styled-components'
import { ReactComponent as SwitchIcon } from '@apps/components/icons/switch-icon.svg'

import { useSetStakedToken, useStakedToken } from '../context/StakedTokenProvider'
import { UnstyledButton } from '@apps/components/core'

const Icon = styled(TokenIcon)`
  width: 1.75rem;
`

const Container = styled(UnstyledButton)`
  display: flex;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 0.5rem;
  border-radius: 0.75rem;

  > * {
    height: 65%;
  }

  &:hover {
    img {
      opacity: 0.5;
    }
    svg {
      path {
        stroke: ${({ theme }) => theme.color.gold};
      }
    }
  }
`

export const StakedTokenToggle: FC = () => {
  const { selected, options } = useStakedToken()
  const setStakedToken = useSetStakedToken()

  const handleSwitch = () => {
    const next = Object.keys(options).find(v => v !== selected)
    setStakedToken(next)
  }

  return (
    <div>
      <Container onClick={handleSwitch}>
        <Icon key={selected} symbol={options[selected]?.icon?.symbol} />
        <SwitchIcon title="Switch staking token" />
      </Container>
    </div>
  )
}
