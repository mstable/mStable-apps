import React, { FC } from 'react'
import styled from 'styled-components'

import { TokenIcon } from '@apps/base/components/core'
import { CountUp } from '@apps/dumb-components'

import { useEpochData } from './context/EpochContext'
import { useActiveDial, useShowVotesTable } from './context/ViewOptionsContext'
import { DialMetadataContent } from './DialMetadataContent'
import { DialPreferencesTable } from './DialPreferencesTable'
import { DialTitle } from './DialTitle'

const StyledTokenIcon = styled(TokenIcon)`
  img {
    height: 1.3rem;
  }
`

const Header = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;

  .emission {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-height: 1.5rem;
    justify-content: flex-end;
    margin-bottom: 0.5rem;
  }

  .vote-share {
    color: ${({ theme }) => theme.color.bodyTransparent};
    font-size: 0.8rem;
  }
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 1rem;
  border: 1px ${({ theme }) => theme.color.defaultBorder} solid;
`

export const ActiveDial: FC = () => {
  const [epochData] = useEpochData()
  const activeDial = useActiveDial()
  const [showVotesTable] = useShowVotesTable()

  const emission = activeDial && epochData ? (activeDial.dialVotes.voteShare / 100) * epochData.emission : undefined

  return (
    <Container>
      <Header>
        <DialTitle dialId={activeDial.dial.dialId} dialMetadata={activeDial.dial.metadata} />
        <div>
          <div className="emission">
            {activeDial && <CountUp end={activeDial.dialVotes.voteShare} decimals={0} duration={0.3} suffix="% " className="vote-share" />}
            <CountUp end={emission} decimals={0} duration={0.3} />
            <StyledTokenIcon symbol="MTA" />
          </div>
        </div>
      </Header>
      <DialMetadataContent dial={activeDial?.dial}>{showVotesTable && <DialPreferencesTable />}</DialMetadataContent>
    </Container>
  )
}
