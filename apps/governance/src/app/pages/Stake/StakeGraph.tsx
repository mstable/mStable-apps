import React, { FC } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Color } from '@apps/theme'
import styled from 'styled-components'
import { useStakedTokenQuery } from '../../context/StakedToken'

const WEEK = 604800

interface DataType {
  multiplier: number
  week: number
}

const getCurrentMultiplier = (hodlLength: number) => {
  if (hodlLength < 13) {
    // 0-3 months = 1x
    return 1
  }
  if (hodlLength < 26) {
    // 3 months = 1.2x
    return 1.2
  }
  if (hodlLength < 52) {
    // 6 months = 1.3x
    return 1.3
  }
  if (hodlLength < 78) {
    // 12 months = 1.4x
    return 1.4
  }
  if (hodlLength < 104) {
    // 18 months = 1.5x
    return 1.5
  }
  // > 24 months = 1.6x
  return 1.6
}

const generateData = (startTime?: number): DataType[] => {
  const now = Date.now() / 1e3
  const start = startTime ?? now
  const week = Math.floor((now - start) / WEEK)
  const totalIntervals = 117
  const length = Math.max(0, totalIntervals - week + 1)
  const intervals = [...new Array(length).keys()]
  return intervals.map((w, i) => ({ multiplier: getCurrentMultiplier(w + week), week: i * WEEK }))
}

const removeDuplicatesBy = (keyFn: (n: DataType) => void, array: DataType[]) => {
  const uniqueSet = new Set()
  return array.filter(x => {
    const key = keyFn(x),
      isNew = !uniqueSet.has(key)
    if (isNew) uniqueSet.add(key)
    return isNew
  })
}

const Container = styled.div`
  width: 100%;
  height: 100%;

  > div {
    margin-top: 1rem;
  }

  .recharts-cartesian-axis-tick-value {
    ${({ theme }) => theme.mixins.numeric};
    font-size: 0.75rem;
    color: ${({ theme }) => theme.color.bodyTransparent} !important;
  }
`

export const StakeGraph: FC = () => {
  const { data: tokenData } = useStakedTokenQuery()
  const weightedTimestamp = tokenData?.stakedToken?.accounts?.[0]?.balance?.weightedTimestamp

  const data = generateData(weightedTimestamp)
  const ticks = removeDuplicatesBy(x => x.multiplier, data).map(v => v.week)

  return (
    <Container>
      <ResponsiveContainer width="100%" aspect={1.75}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={Color.blue} stopOpacity={0.5} />
              <stop offset="95%" stopColor={Color.blue} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="week" tickFormatter={w => `${w / WEEK}`} axisLine={false} padding={{ left: 16 }} tickLine={false} ticks={ticks} />
          <YAxis
            domain={['dataMin', 'dataMax']}
            tickCount={4}
            tickFormatter={m => `${m}x`}
            axisLine={false}
            padding={{ bottom: 16 }}
            tickLine={false}
            width={32}
          />
          <Tooltip
            cursor
            labelFormatter={week => `+${(week as number) / WEEK} weeks`}
            formatter={multiplier => multiplier}
            separator=""
            contentStyle={{
              fontSize: '14px',
              padding: '8px',
              background: 'rgba(255, 255, 255, 0.8)',
              textAlign: 'right',
              border: 'none',
              borderRadius: '4px',
              color: Color.black,
            }}
            wrapperStyle={{
              top: 0,
              left: 0,
            }}
          />
          <Area type="stepAfter" name={`multiplier: `} dataKey="multiplier" stroke={Color.blue} strokeWidth={2} fill="url(#area)" />
        </AreaChart>
      </ResponsiveContainer>
    </Container>
  )
}
