import React, { FC } from 'react'
import { ThemeProvider as SCThemeProvider } from 'styled-components'

import { createToggleContext } from '@apps/context-utils'

import { lightTheme, darkTheme } from './theme'

const [useToggleDarkTheme, ToggleProvider] = createToggleContext(false)

const Content: FC = ({ children }) => {
  const theme = useToggleDarkTheme()[0] ? darkTheme : lightTheme
  return <SCThemeProvider theme={theme}>{children}</SCThemeProvider>
}

const ThemeProvider: FC = ({ children }) => (
  <ToggleProvider>
    <Content>{children}</Content>
  </ToggleProvider>
)

export { useToggleDarkTheme, ThemeProvider }
