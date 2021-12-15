import React, { FC } from 'react'
import { ThemeProvider as SCThemeProvider } from 'styled-components'

import { useIsDarkMode } from '@apps/browser-settings'

import { lightTheme, darkTheme } from './theme'

export const ThemeProvider: FC = ({ children }) => {
  const isDarkMode = useIsDarkMode()
  const theme = isDarkMode ? darkTheme : lightTheme
  return <SCThemeProvider theme={theme}>{children}</SCThemeProvider>
}
