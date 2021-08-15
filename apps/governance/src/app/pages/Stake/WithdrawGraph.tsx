import React, { FC } from 'react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Color } from '@apps/base/theme'
import styled from 'styled-components'
import { useStakedTokenQuery } from '../../context/StakedTokenProvider'

const WEEK = 604800

interface DataType {
  fee: number
  week: number
}

const getRedemptionFee = (weeksStaked: number) => {
  var _feeRate = 0
  if (weeksStaked > 2) {
    _feeRate = Math.sqrt(300e18 / weeksStaked) * 1e7
    _feeRate = _feeRate < 25e15 ? 0 : _feeRate - 25e15
  } else {
    _feeRate = 1e17
  }
  return _feeRate / 1e18
}

const generateData = (weeksStaked?: number): DataType[] => {
  const totalIntervals = 50
  const intervals = [...Array(totalIntervals - Math.floor(weeksStaked) + 1).keys()]
  const mapped = intervals?.map((w, i) => ({ fee: getRedemptionFee(w + weeksStaked), week: i * WEEK }))
  return mapped
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

export const WithdrawGraph: FC = () => {
  const { data: stakedData } = useStakedTokenQuery()

  const weightedTimestamp = (stakedData?.stakedToken?.accounts?.[0]?.balance?.weightedTimestamp ?? Date.now()) / 1e3
  const weeksStaked = (Date.now() / 1e3 - weightedTimestamp) / WEEK

  const data = generateData(weeksStaked)
  const ticks = removeDuplicatesBy(x => x.fee, data).map(v => v.week)

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
            tickCount={2}
            tickFormatter={m => `${m}%`}
            axisLine={false}
            padding={{ bottom: 16 }}
            tickLine={false}
            width={32}
          />
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
