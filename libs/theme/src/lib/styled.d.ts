import 'styled-components'

import type { Color, ColorTheme, FontSize, mixins, Size, Spacing, ViewportWidth } from './theme'

declare module 'styled-components' {
  export interface DefaultTheme {
    color: ColorTheme &
      typeof Color & {
        // XXX issue combining these types...
        primary: string
        primaryTransparent: string
        body: string
        bodyAccent: string
        accent: string
        bodyTransparent: string
        bodyTransparenter: string
        background: string
        backgroundAccent: string
      }
    spacing: typeof Spacing
    size: typeof Size
    fontSize: typeof FontSize
    viewportWidth: typeof ViewportWidth
    mixins: typeof mixins
    isLight: typeof boolean
  }
}
