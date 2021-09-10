import React, { FC } from 'react'
import styled, {
  createGlobalStyle,
  CSSObject,
  GlobalStyleComponent,
  Interpolation,
  InterpolationFunction,
  ThemedStyledProps,
} from 'styled-components'
import reset from 'styled-reset'
import { TransitionGroup } from 'react-transition-group'
import { ModalProvider } from 'react-modal-hook'

import { Color, FontSize, Size, Spacing, ViewportWidth } from '@apps/base/theme'
import { ReactTooltip, Tooltip } from '@apps/components/core'

import { Footer } from './Footer'
import { AppBar } from './AppBar'
import { Toasts } from './Toasts'

interface Theme {
  color: typeof Color & {
    primary: string
    primaryTransparent: string
    defaultBorder: string
    body: string
    onboardItemHover: string
    onboardBackground: string
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
  isLight: boolean
  mixins: any
}

const Main = styled.main<{ marginTop?: boolean }>`
  margin-top: ${({ marginTop }) => marginTop && `2rem`};
  padding: 0 1rem;
  min-height: 50vh;

  @media (min-width: ${ViewportWidth.s}) {
    padding: 0 1rem;
  }
`

// XXX nx/styled-components hell
const GlobalStyle = (createGlobalStyle as <P extends object = {}>(
  first: TemplateStringsArray | CSSObject | InterpolationFunction<ThemedStyledProps<P, Theme>>,
  ...interpolations: Array<Interpolation<ThemedStyledProps<P, Theme>>>
) => GlobalStyleComponent<P, Theme>)`
  ${reset}
  a {
    color: ${({ theme }) => theme.color.primary};
    text-decoration: none;
    transition: color 0.4s ease;
    &:hover {
      color: ${Color.gold};
    }
  }
  b {
    font-weight: 600;
  }
  html {
    overflow-y: scroll;
    scroll-behavior: smooth;
  }
  body {
    min-width: 320px;
  }
  code {
    display: block;
    padding: 16px;
    border-radius: 2px;
    border: 1px ${Color.blackTransparent} solid;
    background: ${Color.white};
    ${({ theme }) => theme.mixins.numeric}
  }
  * {
      box-sizing: border-box;
  }
  body, button, input {
    font-family: 'Poppins', sans-serif;
    color: ${({ theme }) => theme.color.body};
    line-height: 1.3rem;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type=number] {
    -moz-appearance: textfield;
  }

  // Onboard.js
  aside.bn-onboard-custom {
     z-index: 5 !important;
     width: 100% !important;
     height: 100% !important;

     .bn-onboard-modal-content-close:hover {
      background: none;
      opacity: 0.75;
     }

     button:hover {
      background: ${({ theme }) => theme.color.onboardItemHover};
     }

    .bn-onboard-modal-content {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      padding-bottom: calc(env(safe-area-inset-bottom) + 1rem);
      width: inherit;
      max-width: inherit;
      box-sizing: border-box;
      border-top-left-radius: 1rem;
      border-top-right-radius: 1rem;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
      transition: all ease-in;
      background: ${({ theme }) => theme.color.onboardBackground};
    }
    .bn-onboard-modal-content-header {
      font-family: 'Poppins', sans-serif !important;
      color: ${({ theme }) => theme.color.body};
      justify-content: center;
    }
    h3 {
      font-family: 'Poppins', sans-serif !important;
      color: ${({ theme }) => theme.color.body};
      font-weight: 600;
      font-size: 1.125rem;
    }
    .bn-onboard-modal-content-header-icon,
    .bn-onboard-select-description {
      display: none;
    }
    .bn-onboard-icon-button {
      font-weight: normal;
      padding: 0.5rem 1rem;
      width: 100%;
      border: 1px ${({ theme }) => theme.color.defaultBorder} solid;
      border-radius: 0.5rem;
      > :first-child {
        min-width: 32px;
      }
      > span {
        font-weight: 500;
        font-size: 1rem;
        color: ${({ theme }) => theme.color.body};
      }
      &:hover {
        box-shadow: none;
      }
    }
    .bn-onboard-modal-content-close {
      top: 1.5rem;
    }
    .bn-onboard-modal-select-wallets li {
      width: 50%;
    }
    .bn-onboard-modal-select-wallets {
      .bn-onboard-prepare-button {
        color: 1px solid ${({ theme }) => theme.color.body} !important;
        border: 1px ${Color.blackTransparent} solid !important;
      }
    }
    .bn-onboard-select-info-container  {
      justify-content: center !important;

      .bn-onboard-prepare-button {
        display: none;
      }

      span {
        text-align: center;
        color: ${({ theme }) => theme.color.bodyAccent};
        font-size: 0.875rem !important;
        margin: 0 !important;
      }
    }
    .bn-onboard-modal-selected-wallet {
      > *:not(:last-child) {
        margin-bottom: 0.75rem;
      }
    }


    @media (min-width: ${ViewportWidth.s}) {
      .bn-onboard-modal-content {
        position: relative;
        max-width: 28rem;
        border-radius: 1rem;
      }
    }
  }

`

const StyledTooltip = styled(Tooltip)`
  display: none;
`
const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  pointer-events: none;
  z-index: -1;
  transition: background-color 0.3s ease;
  background-color: ${({ theme }) => theme.color.background[0]};
`

const Container = styled.div`
  display: grid;
  overflow-x: hidden;
  min-height: calc(100vh - 174px);

  // Space for the footer
  padding-bottom: 4rem;

  grid-template-columns:
    1fr
    min(1000px, 100%)
    1fr;

  > * {
    grid-column: 2;
  }
`

export const Layout: FC = ({ children }) => {
  return (
    <ModalProvider rootComponent={TransitionGroup}>
      <Background />
      <AppBar />
      <Container>
        <Main>{children}</Main>
      </Container>
      <Footer />
      <Toasts />
      <StyledTooltip tip="" hideIcon />
      <ReactTooltip id="global" place="top" />
      <GlobalStyle />
    </ModalProvider>
  )
}
