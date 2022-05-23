import { useCallback, useMemo } from 'react'

import { Input } from './Input'

import type { ChangeEventHandler, FC, KeyboardEventHandler } from 'react'

interface Props {
  className?: string
  error?: boolean
  value?: string
  balance?: string
  placeholder?: string
  onChange?: (formValue?: string) => void
  disabled?: boolean
  min?: string
  max?: string
  step?: string
  decimals?: number
}

const trimInput = (value?: string, decimals?: number): string => {
  if (!value) return ''
  if (!decimals) return value

  const split = value?.split('.')
  if (split.length > 1) {
    if (split[1].length >= decimals) {
      return [split[0], split[1].substr(0, decimals)].join('.')
    }
  }
  return value
}

export const AmountInput: FC<Props> = ({
  className,
  error,
  disabled = false,
  placeholder = '0.0',
  onChange,
  value,
  min = '0',
  max,
  step = '0.01',
  decimals,
}) => {
  const trimmedValue = useMemo(() => trimInput(value, decimals), [value, decimals])

  const handleKeyPress = useCallback<KeyboardEventHandler<HTMLInputElement>>(event => {
    // Prevent 'minus' key
    if ((event.which || event.keyCode) === 45) {
      event.preventDefault()
      event.stopPropagation()
    }
  }, [])

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(event => onChange?.(event.target.value ?? undefined), [onChange])

  return (
    <Input
      className={className}
      error={error}
      min={min}
      max={max}
      placeholder={placeholder}
      step={step}
      value={trimmedValue}
      onKeyPress={handleKeyPress}
      onChange={handleChange}
      disabled={disabled}
    />
  )
}
