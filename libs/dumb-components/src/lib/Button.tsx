import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'

import type { ButtonHTMLAttributes, ComponentProps } from 'react'

interface Props extends ButtonHTMLAttributes<unknown> {
  highlighted?: boolean
  transparent?: boolean
  scale?: number
  disabled?: boolean
}

const ButtonCss = css<Props>`
  font-size: ${({ scale }) => (scale ? `${scale}rem` : `1rem`)};
  padding: ${({ scale }) => (scale ? `${scale * 0.75}em ${scale * 1.5}em` : `0.5rem 1rem`)};
  border-radius: 0.75em;
  background: ${({ theme, highlighted, transparent, disabled }) =>
    disabled ? theme.color.disabledButton : highlighted ? theme.color.primary : transparent ? 'transparent' : theme.color.background[2]};
  color: ${({ theme, highlighted, disabled }) => (highlighted ? theme.color.white : disabled ? theme.color.disabled : theme.color.body)};
  z-index: ${({ highlighted }) => (highlighted ? 1 : 0)};
  font-weight: 500;
  position: relative;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: 0.2s ease all;
  border: 1px solid ${({ transparent, theme }) => (transparent ? theme.color.defaultBorder : 'transparent')};

  svg {
    rect {
      fill: ${({ theme, highlighted }) => (highlighted ? theme.color.white : theme.color.grey)};
    }
  }

  &:hover {
    ${({ disabled, theme, highlighted }) =>
      !disabled && {
        background: `${highlighted && theme.color.gold}`,
        color: `${highlighted ? theme.color.white : theme.color.gold}`,
      }}
  }
`

export const UnstyledButton = styled.button`
  appearance: none;
  outline: none;
  border: none;
  background: transparent;
  user-select: none;
  cursor: pointer;
`

export const Button = styled(UnstyledButton).attrs<ButtonHTMLAttributes<never>>(({ type = 'button', ...attrs }) => ({
  ...attrs,
  type,
}))<Props>`
  ${ButtonCss}
`

export const ButtonLink = styled(Link)<Props & ComponentProps<typeof Link>>`
  ${ButtonCss}
`
