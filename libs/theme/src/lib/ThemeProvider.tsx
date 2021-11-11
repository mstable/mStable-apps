import React, { FC, useEffect } from 'react'

import { ThemeProvider as SCThemeProvider } from 'styled-components'
import { createToggleContext } from '@apps/context-utils'
import { lightTheme, darkTheme } from './theme'

const [useToggleDarkTheme, ToggleProvider] = createToggleContext(false)

const Content: FC = ({ children }) => {
  const [isDarkMode, toggleTheme] = useToggleDarkTheme()
  const theme = isDarkMode ? darkTheme : lightTheme

  useEffect(() => {
    const storage = localStorage.getItem('themeMode') as 'light' | 'dark'
    if (storage === 'light') toggleTheme()
  }, [toggleTheme])

  return <SCThemeProvider theme={theme}>{children}</SCThemeProvider>
}

const ThemeProvider: FC = ({ children }) => (
  <ToggleProvider>
    <Content>{children}</Content>
  </ToggleProvider>
)

export { useToggleDarkTheme, ThemeProvider }
