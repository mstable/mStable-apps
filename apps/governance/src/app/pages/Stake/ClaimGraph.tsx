import React, { FC } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Color } from '@apps/base/theme'
import styled from 'styled-components'
import { useStakedTokenQuery } from '../../context/StakedTokenProvider'

const WEEK = 604800

interface DataType {
  mta: number
  week: number
}

const generateData = (weeksStaked?: number): DataType[] => {
  return [
    {
      mta: 0,
      week: 0,
    },
    {
      mta: weeksStaked,
      week: 1,
    },
  ]
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

export const ClaimGraph: FC = () => {
  const { data: stakedData } = useStakedTokenQuery()
  const rewardsCount = 130

  const data = generateData(rewardsCount)

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
          <XAxis
            dataKey="week"
            tickFormatter={w => (w === 0 ? 'Last claim' : 'Now')}
            axisLine={false}
            padding={{ left: 16 }}
            tickLine={false}
          />
          <YAxis
            domain={['dataMin', 'dataMax']}
            tickCount={2}
            tickFormatter={m => `${m}%`}
            axisLine={false}
            padding={{ bottom: 16 }}
            tickLine={false}
            width={32}
          />
          <Tooltip
            cursor
            label=""
            labelFormatter={w => (w === 0 ? 'Last claim' : 'Available to claim')}
            formatter={mta => `${(mta as number).toFixed(2)} MTA`}
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
          <Area type="monotone" name={'Earned: '} dataKey="mta" stroke={Color.blue} strokeWidth={2} fill="url(#area)" />
        </AreaChart>
      </ResponsiveContainer>
    </Container>
  )
}
