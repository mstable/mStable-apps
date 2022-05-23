import { useState } from 'react'

import { differenceInSeconds } from 'date-fns'
import Countdown from 'react-countdown'
import { useInterval } from 'react-use'
import styled from 'styled-components'

import { Tooltip } from './ReactTooltip'

import type { FC, ReactElement } from 'react'
import type { CountdownRenderProps } from 'react-countdown'

interface Props {
  className?: string
  width?: number
  percentage?: number
  color?: string
  textColor?: string
  end: number
  tip?: string
}

const YEAR = 365.24
const MONTH = 30.44
const WEEK = 7

const StyledTooltip = styled(Tooltip)`
  position: absolute;
  right: -1.25rem;
  bottom: 0.25rem;

  > svg {
    path,
    rect {
      fill: ${({ theme }) => theme.color.bodyAccent};
    }
  }
`

const Time = styled.span<{ color?: string }>`
  ${({ theme }) => theme.mixins.numeric};
  font-size: 0.75rem;
  color: ${({ theme, color }) => color ?? theme.color.bodyAccent};
`

const Progress = styled.div<{ color?: string }>`
  background: ${({ theme }) => theme.color.background[2]};
  border-radius: 0.5rem;
  margin-bottom: 0.25rem;

  > div {
    background-color: ${({ color }) => color ?? `rgb(62, 122, 235)`};
    height: 10px;
    border-radius: 1rem;
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
`

const formatLabel = (val: number, label: string) => (val > 0 ? `${val}${label}` : ``)

export const CountdownBar: FC<Props> = ({ className, width = 150, percentage = 0, end, color, tip, textColor }) => {
  const [value, setValue] = useState((percentage / 100) * width)
  const endDate = new Date(end)
  const dateDifference = differenceInSeconds(endDate, new Date())
  const timeMultiplier = 60 // minute
  const interval = ((((100 - percentage) / 100) * width) / dateDifference) * timeMultiplier

  const renderer = ({ days: total, hours, minutes, completed }: CountdownRenderProps): ReactElement => {
    const years = Math.floor(total / YEAR)
    const months = Math.floor((total % YEAR) / MONTH)
    const weeks = Math.floor((total % MONTH) / WEEK)
    const days = total % 7
    return (
      <Time color={textColor}>
        {completed
          ? `Complete`
          : `${formatLabel(years, 'y')} 
             ${formatLabel(months, 'm')} 
             ${formatLabel(weeks, 'w')} 
             ${formatLabel(days, 'd')} 
             ${hours}h 
             ${minutes}m`}
      </Time>
    )
  }

  useInterval(() => {
    setValue(value - interval <= 0 ? 0 : value - interval)
  }, 1000 * timeMultiplier)

  return (
    <Container className={className}>
      <Progress style={{ width: `${width}px` }} color={color}>
        <div style={{ width: `${value}px` }} />
      </Progress>
      <Countdown date={end} renderer={renderer} />
      {tip && <StyledTooltip tip={tip} />}
    </Container>
  )
}
