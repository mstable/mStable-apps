import React, { FC, useMemo } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Color } from '@apps/base/theme'
import styled from 'styled-components'
import { useRewardsEarned } from './context'

interface DataType {
  mta: number
  ordering: number
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
  const rewardsEarned = useRewardsEarned()

  const data = useMemo<DataType[]>(() => {
    return [
      {
        mta: 0,
        ordering: 0,
      },
      {
        mta: rewardsEarned?.rewards ?? 0,
        ordering: 1,
      },
    ]
  }, [rewardsEarned])

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
            dataKey="ordering"
            tickFormatter={ordering => (ordering === 0 ? 'Last claim' : 'Now')}
            axisLine={false}
            padding={{ left: 16 }}
            tickLine={false}
          />
          <YAxis tickCount={2} tickFormatter={m => `${m}`} axisLine={false} padding={{ bottom: 16 }} tickLine={false} width={32} />
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
