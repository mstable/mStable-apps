import React, { FC, useRef } from 'react'
import styled from 'styled-components'
import { useToggle } from 'react-use'
import useOnClickOutside from 'use-onclickoutside'

import { useThemeMode, useToggleThemeMode } from '@apps/base/context/app'
import { UnstyledButton, NetworkDropdown } from '@apps/components/core'

import { ReactComponent as SettingsSvg } from '../../../../../components/src/lib/icons/settings.svg'

const Button = styled(UnstyledButton)`
  background: ${({ theme }) => theme.color.background[1]};
  height: 1.75rem;
  width: 1.75rem;
  border-radius: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  > * {
    position: absolute;
    left: 0.25rem;
    right: 0.25rem;
    top: 0.25rem;
    bottom: 0.25rem;
  }

  :hover {
    background: ${({ theme }) => theme.color.background[2]};
  }
`

const ThemeModeButton = styled(Button)`
  width: 4rem;
  padding: 1.25rem 0;
`

const List = styled.div`
  position: absolute;
  border-radius: 0.75rem;
  right: 0;
  top: 2.5rem;
  width: 20rem;
  background: ${({ theme }) => theme.color.background[0]};
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  min-width: 5.5rem;
  z-index: 1;

  > div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 4rem;
    padding: 0 1rem;
    border-bottom: 1px solid ${({ theme }) => theme.color.defaultBorder};
  }
`

const Container = styled.div`
  position: relative;
`

export const SettingsButton: FC<{ className?: string }> = ({ children, className }) => {
  const [show, toggleShow] = useToggle(false)
  const container = useRef(null)
  const toggleThemeMode = useToggleThemeMode()
  const themeMode = useThemeMode()

  useOnClickOutside(container, () => toggleShow(false))

  const handleThemeToggle = (): void => {
    localStorage.setItem('themeMode', themeMode === 'light' ? 'dark' : 'light')
    toggleThemeMode()
  }

  return (
    <Container ref={container} className={className}>
      <Button onClick={toggleShow}>
        {children || (
          <div>
            <SettingsSvg />
          </div>
        )}
      </Button>
      <List hidden={!show}>
        <div>
          <p>Network</p>
          <NetworkDropdown />
        </div>
        <div>
          <p>Theme</p>
          <ThemeModeButton onClick={handleThemeToggle}>{themeMode === 'light' ? '☀️' : '🌙'}</ThemeModeButton>
        </div>
      </List>
    </Container>
  )
}
