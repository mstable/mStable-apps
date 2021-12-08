/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-props-no-spreading */
import React, { FC, useEffect, useRef } from 'react'
import styled from 'styled-components'
import ReactSlider from 'react-slider'

interface Props {
  min: number
  max: number
  value: number
  onChange?(value: number): void
  step: number
  error?: string
  intervals?: number
  className?: string
  disabled?: boolean
}

const StyledThumb = styled.div`
  height: 1.25rem;
  width: 0.25rem;
  z-index: 2;
  &:after {
    position: absolute;
    left: -0.5rem;
    margin-top: -2px;
    text-align: center;
    background: white;
    cursor: grab;
    border-radius: 50%;
    content: '';
    width: 1.25rem;
    height: 1.25rem;
    box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.2);
    border: 1px solid ${({ theme }) => theme.color.bodyAccent[3]};
  }
`

const StyledTrack = styled.div<{ index: number; value?: number }>`
  height: 1rem;
  display: ${({ index, value }) => (value === 0 && index === 0 ? 'none' : 'block')};
  background: ${({ index, theme }) => (index === 1 ? theme.color.background[2] : theme.color.blue)};
  border-radius: ${({ index }) => (index === 0 ? '0.5rem 0 0 0.5rem' : '0 0.5rem 0.5rem 0')};
`

const StyledMark = styled.div`
  width: 1px;
  height: 1rem;
  background-color: #000;
  opacity: 0.125;
  cursor: pointer;
`

const StyledSlider = styled(ReactSlider)`
  width: 100%;
  height: 2rem;
`

const renderThumb: FC = props => <StyledThumb {...props} />
const renderTrack: FC = (props, state) => <StyledTrack {...props} index={state.index} value={state.value} />
const renderMark: FC = props => <StyledMark {...props} />

export const Slider: FC<Props> = ({ className, min, max, value = 0, step, intervals = 5, onChange, disabled = false }) => {
  const rangeBound = max - min
  const interval = rangeBound / intervals
  const markRange = intervals ? Array.from(Array(intervals - 1).keys()).map(i => min + interval * (i + 1)) : undefined
  const ref = useRef<any>(null)

  // Workaround for https://github.com/zillow/react-slider/issues/214
  useEffect(() => {
    if (!ref?.current) return
    ref?.current?.handleResize?.()
    return () => {}
  }, [ref, onChange])

  return (
    <StyledSlider
      ref={ref}
      disabled={disabled}
      className={className}
      marks={markRange}
      renderTrack={renderTrack}
      renderThumb={(!disabled && renderThumb) || undefined}
      renderMark={renderMark}
      onChange={v => onChange?.(v as number)}
      min={min}
      max={max}
      step={step}
      value={value}
    />
  )
}
