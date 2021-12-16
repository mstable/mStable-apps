import React, { FC, useMemo } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Color } from '@apps/theme'
import styled from 'styled-components'
import { useStakedTokenQuery } from '../../context/StakedToken'
import { getRedemptionFee } from '../../utils'

const WEEK = 604800

interface DataType {
  fee: number
  week: number
}

const totalIntervals = 50

const generateData = (weeksStaked: number): DataType[] => {
  const length = Math.max(totalIntervals - Math.floor(weeksStaked) + 1, 0)
  const intervals = [...new Array(length).keys()]
  return intervals.map((w, i) => ({ fee: getRedemptionFee(w + weeksStaked), week: i * WEEK }))
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

const nowUnix = Math.floor(Date.now() / 1e3)

export const WithdrawGraph: FC = () => {
  const { data } = useStakedTokenQuery() ?? {}

  const weightedTimestamp = data?.stakedToken?.accounts?.[0]?.balance?.weightedTimestamp ?? nowUnix

  const graphData = useMemo(() => {
    const weeksStaked = (nowUnix - weightedTimestamp) / WEEK
    const data = generateData(weeksStaked)
    const ticks = [...new Set(data.map(d => d.week))]
    return { data, ticks }
  }, [weightedTimestamp])

  return (
    <Container>
      <ResponsiveContainer width="100%" aspect={1.75}>
        <AreaChart data={graphData.data}>
          <defs>
            <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={Color.blue} stopOpacity={0.5} />
              <stop offset="95%" stopColor={Color.blue} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="week"
            tickFormatter={w => `${w / WEEK}`}
            axisLine={false}
            padding={{ left: 16 }}
            tickLine={false}
            ticks={graphData.ticks}
          />
          <YAxis tickCount={2} tickFormatter={m => `${m}%`} axisLine={false} padding={{ bottom: 16 }} tickLine={false} width={24} />
          <Tooltip
            cursor
            labelFormatter={week => `+${(week as number) / WEEK} weeks`}
            formatter={fee => `${(fee as number).toFixed(4)}%`}
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
          <Area type="monotone" name={'Fee: '} dataKey="fee" stroke={Color.blue} strokeWidth={2} fill="url(#area)" />
        </AreaChart>
      </ResponsiveContainer>
    </Container>
  )
}
