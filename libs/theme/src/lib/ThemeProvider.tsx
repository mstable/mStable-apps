import { useIsDarkMode } from '@apps/browser-settings'
import { ThemeProvider as SCThemeProvider } from 'styled-components'

import { darkTheme, lightTheme } from './theme'

import type { FC } from 'react'

export const ThemeProvider: FC = ({ children }) => {
  const isDarkMode = useIsDarkMode()
  const theme = isDarkMode ? darkTheme : lightTheme
  return <SCThemeProvider theme={theme}>{children}</SCThemeProvider>
}
