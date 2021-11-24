import React, { FC, useState } from 'react'
import styled from 'styled-components'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Rectangle, LabelList } from 'recharts'

import { Color } from '@apps/theme'

const Container = styled.div`
  .recharts-tooltip-wrapper {
    .recharts-tooltip-label {
      display: none;
    }
  }
`

export const DistributionBar: FC = () => {
  const data = { stakers: 25, polygon: 30, save: 45 }
  const colors = [Color.red, Color.green, Color.orange]
  const [activeBarLabel, setActiveBarLabel] = useState(null)

  const renderRadius = (i: number, n: number) => {
    if (i === 0) {
      return [10, 0, 0, 10]
    } else if (i === n - 1) {
      return [0, 10, 10, 0]
    }
    return [0, 0, 0, 0]
  }

  const handleLineHover = (event, label) => {
    if (label === activeBarLabel) return
    setActiveBarLabel(label)
  }

  return (
    <Container>
      <ResponsiveContainer height={24} width={'100%'}>
        <BarChart layout="vertical" stackOffset={'none'} data={[data]} margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
          <XAxis hide type="number" />
          <YAxis hide type="category" />
          {Object.keys(data).map((key, i) => (
            <Bar
              key={key}
              dataKey={key}
              fill={colors[i]}
              stackId="bar"
              radius={renderRadius(i, Object.keys(data).length)}
              onMouseEnter={e => handleLineHover(e, key)}
              onMouseLeave={() => setActiveBarLabel(null)}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
      {activeBarLabel && (
        <p style={{ width: '100%', textAlign: 'center' }}>
          {activeBarLabel} {data[activeBarLabel]}%
        </p>
      )}
    </Container>
  )
}
