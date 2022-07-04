import { TokenIcon } from '@apps/base/components/core'
import { CountUp } from '@apps/dumb-components'
import { createMemo } from 'react-use'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import styled from 'styled-components'

import { ActiveDial } from './ActiveDial'
import { DIALS_METADATA } from './constants'
import { useEpochData } from './context/EpochContext'
import { useHoveredDialId, useSelectedDialId } from './context/ViewOptionsContext'

import type { FC } from 'react'

import type { EpochDialVotes } from './types'

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
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  background: ${({ theme }) => theme.color.background[0]};
  padding: 1rem;
  border-radius: 0.75rem;
  gap: 1rem;
`

const Inner = styled.div`
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
  if (idx === count - 2) return [0, 10, 10, 0]
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

  const [, setSelectedDialId] = useSelectedDialId()
  const [, setHoveredDialId] = useHoveredDialId()

  const scaledDialVotes = useScaledDialVotes(epochData?.dialVotes)

  return (
    <Container>
      <Inner>
        <Header>
          <div>
            <h4>
              <span>Distribution</span>
            </h4>
          </div>
          <div>
            <CountUp end={epochData?.emission} decimals={0} duration={0.3} />
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
                  fill={DIALS_METADATA[dialId].color}
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
        <ActiveDial />
      </Inner>
    </Container>
  )
}
