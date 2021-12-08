import React, { FC, useRef } from 'react'
import { createMemo } from 'react-use'
import styled from 'styled-components'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'

import { TokenIcon } from '@apps/base/components/core'
import { CountUp } from '@apps/dumb-components'

import { useHoveredDial, useHoveredDialId, useSelectedDial, useSelectedDialId } from './context/ViewOptionsContext'
import { useEpochData } from './context/EpochContext'
import { DialPreferencesTable } from './DialPreferencesTable'
import { EpochDialVotes, ActiveDial } from './types'

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

  > span {
    ${({ theme }) => theme.mixins.numeric};
    font-weight: 400;
  }

  .vote-share {
    color: ${({ theme }) => theme.color.bodyTransparent};
    font-size: 0.8rem;
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

  h4 {
    color: ${({ theme }) => theme.color.body};
    font-weight: 500;
  }

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

const useScaledDialVotes = createMemo((dialVotes?: EpochDialVotes): [{ [dialId: number]: number }] => {
  if (!dialVotes) return [{}]

  const totalVotes = Object.values(dialVotes).reduce((prev, dialVote) => prev + dialVote.votes, 0)

  // TODO improve; >100 total breaks the chart
  const weightMultiplier = 99.9 / totalVotes

  const entries = Object.entries(dialVotes).map(([dialId, dialVote]) => [dialId, dialVote.votes * weightMultiplier])

  return [Object.fromEntries(entries)]
})

export const DistributionBar: FC = () => {
  const [epochData] = useEpochData()
  const ref = useRef(null)

  const hoveredDial = useHoveredDial()
  const selectedDial = useSelectedDial()
  const activeDial = hoveredDial ?? selectedDial

  const [, setSelectedDialId] = useSelectedDialId()
  const [, setHoveredDialId] = useHoveredDialId()

  const scaledDialVotes = useScaledDialVotes(epochData?.dialVotes)

  const emission = activeDial && epochData ? (activeDial.dialVotes.voteShare / 100) * epochData.emission : epochData?.emission
  return (
    <Container ref={ref}>
      <Header>
        <div>
          <h4>
            <span>{(hoveredDial ?? selectedDial)?.dial.metadata.title ?? 'Distribution'}</span>
          </h4>
          {(hoveredDial ?? selectedDial) && <NetworkLabel>{(hoveredDial ?? selectedDial)?.dial.metadata.network}</NetworkLabel>}
        </div>
        <div>
          {(hoveredDial ?? selectedDial) && (
            <CountUp
              end={(hoveredDial ?? selectedDial).dialVotes.voteShare}
              decimals={0}
              duration={0.3}
              suffix="% "
              className="vote-share"
            />
          )}
          <CountUp end={emission} decimals={0} duration={0.3} />
          <StyledTokenIcon symbol="MTA" />
        </div>
      </Header>
      <ResponsiveContainer height={24} width="100%">
        <BarChart layout="vertical" stackOffset="none" data={scaledDialVotes} margin={{ top: 0, bottom: 0, left: 0, right: 0 }}>
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
                onClick={() => {
                  setSelectedDialId(dialId)
                }}
                onMouseEnter={() => {
                  setHoveredDialId(dialId)
                }}
                onMouseLeave={() => {
                  setHoveredDialId(undefined)
                }}
              />
            ))}
        </BarChart>
      </ResponsiveContainer>
      {selectedDial && <DialPreferencesTable />}
    </Container>
  )
}
