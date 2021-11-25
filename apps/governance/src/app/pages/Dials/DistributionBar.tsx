import React, { FC, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { titleCase } from 'title-case'

import { CountUp } from '@apps/dumb-components'

const COLORS = ['#087E8B', '#48284A', '#a1cda8', '#ff5a5f', '#3c3c3c', '#F2F3AE', '#A3320B', '#C1839F']

interface Props {
  emission: number
  dials: { title: string; value: number; key: string }[]
}

const NetworkLabel = styled.p`
  color: ${({ theme }) => theme.color.bodyAccent};
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  background: ${({ theme }) => theme.color.background[0]};
  border-radius: 0.5rem;
  padding: 0 0.5rem;
`

const Header = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;

  > div:first-child {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-height: 1.5rem;
  }

  h4 {
    color: ${({ theme }) => theme.color.bodyAccent};
  }

  span {
    ${({ theme }) => theme.mixins.numeric};
    font-weight: 400;
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .recharts-tooltip-wrapper {
    .recharts-tooltip-label {
      display: none;
    }
  }

  .recharts-bar {
    cursor: pointer;

    &:hover {
      * {
        opacity: 0.9;
      }
    }
  }
`

export const DistributionBar: FC<Props> = ({ emission: _emission, dials }) => {
  const [activeBar, setActiveBar] = useState(null)
  const dialCount = Object.keys(dials).length
  const mappedData = [dials.map(v => ({ [v.key]: v.value })).reduce((a, b) => ({ ...a, ...b }))]

  const renderRadius = (i: number, n: number) => {
    if (i === 0) {
      return [10, 0, 0, 10]
    } else if (i === n - 1) {
      return [0, 10, 10, 0]
    }
    return [0, 0, 0, 0]
  }

  const handleLineHover = (key: string) => {
    if (key === activeBar?.key) return
    const match = dials.find(v => v.key === key)
    setActiveBar(match)
  }

  const emission = useMemo(() => {
    if (!activeBar?.value) return _emission
    const dialPercentage = activeBar.value / 100
    return dialPercentage * _emission
  }, [_emission, activeBar])

  const selectedDialNetwork = (!!activeBar && !!activeBar?.key?.includes('p-') ? 'Polygon' : 'Ethereum') ?? null

  return (
    <Container>
      <Header>
        <div>
          <h4>Distribution - {titleCase(activeBar?.title ?? 'All')}</h4>
          {activeBar && <NetworkLabel>{selectedDialNetwork}</NetworkLabel>}
        </div>
        <CountUp end={emission} decimals={0} />
      </Header>
      <ResponsiveContainer height={24} width={'100%'}>
        <BarChart layout="vertical" stackOffset={'none'} data={mappedData} margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
          <XAxis hide type="number" />
          <YAxis hide type="category" />
          {dials.map(({ key }, i) => (
            <Bar
              key={key}
              dataKey={key}
              fill={COLORS[i]}
              stackId="bar"
              radius={renderRadius(i, dialCount)}
              onMouseEnter={e => handleLineHover(key)}
              onMouseLeave={() => setActiveBar(null)}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </Container>
  )
}
