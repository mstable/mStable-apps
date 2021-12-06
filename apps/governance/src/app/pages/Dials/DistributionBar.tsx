import React, { FC, useState } from 'react'
import { createMemo } from 'react-use'
import styled from 'styled-components'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'

import { TokenIcon } from '@apps/base/components/core'
import { CountUp } from '@apps/dumb-components'

import { useEmissionsData } from './context/EmissionsContext'
import { useEpochData } from './context/EpochContext'
import { EpochDialVotes } from './types'

// TODO need at least 16 of these
const COLORS = ['#087E8B', '#48284A', '#a1cda8', '#ff5a5f', '#3c3c3c', '#F2F3AE', '#A3320B', '#C1839F']

const NetworkLabel = styled.p`
  color: ${({ theme }) => theme.color.bodyAccent};
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  background: ${({ theme }) => theme.color.background[0]};
  border-radius: 0.5rem;
  padding: 0 0.5rem;
  font-size: 0.875rem;
`

const Header = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;

  > div {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-height: 1.5rem;
  }

  h4 {
    color: ${({ theme }) => theme.color.body};

    > span {
      font-weight: 500;
    }
  }

  > span {
    ${({ theme }) => theme.mixins.numeric};
    font-weight: 400;
  }
`

const StyledTokenIcon = styled(TokenIcon)`
  img {
    height: 1.3rem;
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

const renderRadius = (idx: number, count: number) => {
  if (idx === 0) return [10, 0, 0, 10]
  if (idx === count - 1) return [0, 10, 10, 0]
  return [0, 0, 0, 0]
}

const useScaledMappedData = createMemo((dialVotes?: EpochDialVotes): [{ [dialId: number]: number }] => {
  if (!dialVotes) return [{}]

  const totalVotes = Object.values(dialVotes).reduce((prev, current) => prev + current.votes, 0)

  const weightMultiplier = 100 / totalVotes

  const entries = Object.entries(dialVotes).map(([dialId, dialVote]) => [dialId, dialVote.votes * weightMultiplier])

  return [Object.fromEntries(entries)]
})

export const DistributionBar: FC = () => {
  const [emissionsData] = useEmissionsData()
  const [epochData] = useEpochData()

  const [activeDialId, setActiveDialId] = useState<number | undefined>(undefined)

  const activeDialData = typeof activeDialId == 'number' && emissionsData ? emissionsData.dials[activeDialId] : undefined
  const activeDialVote = typeof activeDialId == 'number' && epochData ? epochData.dialVotes[activeDialId] : undefined

  const emission =
    epochData?.emission && activeDialVote?.votes ? (activeDialVote.votes / 100) * epochData.emission : epochData?.emission ?? 0

  const scaledMappedData = useScaledMappedData(epochData?.dialVotes)

  return (
    <Container>
      <Header>
        <div>
          <h4>
            <span>{activeDialData?.metadata.title ?? 'Distribution'}</span>
          </h4>
          {activeDialData && <NetworkLabel>{activeDialData.metadata.network}</NetworkLabel>}
        </div>
        <div>
          <CountUp end={emission} decimals={0} duration={0.3} />
          <StyledTokenIcon symbol="MTA" />
        </div>
      </Header>
      <ResponsiveContainer height={24} width="100%">
        <BarChart layout="vertical" stackOffset="none" data={scaledMappedData} margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
          <XAxis hide type="number" />
          <YAxis hide type="category" />
          {Object.values(epochData?.dialVotes ?? {})
            .filter(dialVote => dialVote.votes > 0)
            .map(({ dialId }, idx, arr) => (
              <Bar
                key={dialId}
                dataKey={dialId}
                fill={COLORS[idx]}
                stackId="bar"
                radius={renderRadius(idx, arr.length)}
                onMouseEnter={() => {
                  setActiveDialId(dialId)
                }}
                onMouseLeave={() => {
                  setActiveDialId(undefined)
                }}
              />
            ))}
        </BarChart>
      </ResponsiveContainer>
    </Container>
  )
}
