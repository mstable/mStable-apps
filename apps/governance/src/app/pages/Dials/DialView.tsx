import React, { FC } from 'react'
import styled from 'styled-components'

import { ViewportWidth } from '@apps/theme'
import { Button } from '@apps/dumb-components'

import { useSystemView, useUserDialPreferences } from './context/UserDialsContext'
import { DialTable } from './DialTable'
import { DialsSubmit } from './DialsSubmit'

const Buttons = styled.div`
  display: flex;
  position: absolute;
  right: 0.75rem;
  top: -2.5rem;
  gap: 0.25rem;

  @media (min-width: ${ViewportWidth.s}) {
    top: 0.75rem;
  }
`
const StyledButton = styled(Button)`
  height: 2.125rem;
  padding: 0.25rem 0.75rem;
  display: flex;
  align-items: center;
  background: ${({ highlighted, theme }) => !highlighted && theme.color.background[0]};
  border: ${({ highlighted, theme }) => !highlighted && `1px solid ${theme.color.defaultBorder}`};
`

const DialButtons: FC = () => {
  const [isSystemView, toggleSystemView] = useSystemView()
  const [, dispatchUserDialPreferences] = useUserDialPreferences()
  return (
    <Buttons>
      {!isSystemView && (
        <StyledButton
          scale={0.875}
          highlighted={isSystemView}
          onClick={() => {
            dispatchUserDialPreferences({ type: 'RESET' })
          }}
        >
          Reset
        </StyledButton>
      )}
      <StyledButton scale={0.875} highlighted={isSystemView} onClick={toggleSystemView}>
        {isSystemView ? `Vote on weights` : `Back`}
      </StyledButton>
    </Buttons>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 0.875rem;
  position: relative;
  gap: 0.5rem;
  background: ${({ theme }) => theme.color.background[1]};
  padding: 0.75rem;
  margin-top: 2rem;

  tbody {
    background: ${({ theme }) => theme.color.background[0]};

    h3 {
      font-weight: 500;
    }

    span {
      ${({ theme }) => theme.mixins.numeric};
      color: ${({ theme }) => theme.color.body};
      font-weight: 300;
    }
  }

  @media (min-width: ${ViewportWidth.s}) {
    margin-top: 0;
  }
`

export const DialView: FC = () => {
  const [isSystemView] = useSystemView()
  return (
    <Container>
      <DialButtons />
      <DialTable />
      {!isSystemView && <DialsSubmit />}
    </Container>
  )
}
