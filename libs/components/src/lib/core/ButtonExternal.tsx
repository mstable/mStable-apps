import { ButtonHTMLAttributes, ComponentProps, FC } from 'react'
import styled from 'styled-components'
import { Button } from './Button'

interface Props extends ButtonHTMLAttributes<unknown> {
  highlighted?: boolean
  transparent?: boolean
  scale?: number
  disabled?: boolean
}

const External: FC<{ highlighted?: boolean }> = ({ highlighted }) => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 2C3.82843 2 1 2 1 2V10H9V7.5" stroke={highlighted ? 'white' : 'black'} />
    <path d="M6 5.5L10.5 1M10.5 1H7.16667M10.5 1V4.33333" stroke={highlighted ? 'white' : 'black'} />
  </svg>
)

const StyledButton = styled(Button)`
  svg {
    path {
      stroke: ${({ theme, highlighted }) => (highlighted ? 'white' : theme.color.body)};
    }
  }
`

export const ButtonExternal: FC<Props> = ({ onClick, children, highlighted }) => (
  <StyledButton onClick={onClick} highlighted={highlighted}>
    {children} <External highlighted={highlighted} />
  </StyledButton>
)
