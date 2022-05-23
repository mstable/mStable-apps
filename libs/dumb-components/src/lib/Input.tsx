import styled from 'styled-components'

import type { ChangeEventHandler, FC, KeyboardEvent } from 'react'

interface Props {
  className?: string
  error?: boolean
  value?: string
  balance?: string
  placeholder?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  onKeyPress?: (e?: KeyboardEvent<HTMLInputElement>) => void
  disabled?: boolean
  min?: string
  max?: string
  step?: string
  decimals?: number
  type?: string
}

const StyledInput = styled.input<{
  error?: boolean
  disabled?: boolean
  isNumeric?: boolean
}>`
  ${({ isNumeric, theme }) => isNumeric && theme.mixins.numeric};

  font-size: 1rem;
  padding: 0 0.5rem;
  appearance: none;
  background: none;
  border: none;
  color: ${({ error, theme, disabled }) => (error ? theme.color.red : disabled ? theme.color.disabled : theme.color.body)};
  background: ${({ theme, disabled }) => (disabled ? theme.color.disabledInput : 'none')};
  opacity: ${({ disabled }) => (disabled ? 0.85 : 1)};
  font-weight: normal;
  border-radius: 0.75rem;
  outline: none;
  height: 3rem;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'auto')};
`

export const Input: FC<Props> = ({
  className,
  error,
  disabled = false,
  placeholder,
  value,
  onChange,
  onKeyPress,
  min,
  max,
  step,
  type,
}) => {
  const isNumeric = !!(min || max || step) || type === 'number'
  return (
    <StyledInput
      className={className}
      error={error}
      min={min}
      max={max}
      type={type || isNumeric ? 'number' : 'text'}
      placeholder={placeholder}
      step={step}
      onKeyPress={onKeyPress}
      onChange={onChange}
      disabled={disabled}
      isNumeric={isNumeric}
      value={value}
    />
  )
}
