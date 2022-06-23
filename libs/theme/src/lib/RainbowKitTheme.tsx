import { darkTheme, lightTheme } from '@rainbow-me/rainbowkit'

import type { Theme } from '@rainbow-me/rainbowkit'

const light = lightTheme()
const dark = darkTheme()

export const rbkLightTheme: Theme = { ...light, fonts: { body: 'Poppins' } }

export const rbkDarkTheme: Theme = {
  ...dark,
  fonts: { body: 'Poppins' },
  colors: { ...dark.colors, modalBackground: 'rgba(12, 27, 50, 1)' },
}
