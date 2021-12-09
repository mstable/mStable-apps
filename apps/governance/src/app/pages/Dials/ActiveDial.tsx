import { ChainIds, Networks } from '@apps/base/context/network'
import React, { FC } from 'react'
import styled from 'styled-components'

import { Address, TokenIcon } from '@apps/base/components/core'
import { CountUp, ExternalLink, ToggleInput, Tooltip } from '@apps/dumb-components'

import { useEpochData } from './context/EpochContext'
import { useActiveDial, useShowVotesTable } from './context/ViewOptionsContext'
import { DialPreferencesTable } from './DialPreferencesTable'

const StyledTokenIcon = styled(TokenIcon)`
  img {
    height: 1.3rem;
  }
`

const NetworkLabel = styled.p`
  color: ${({ theme }) => theme.color.bodyAccent};
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  background: ${({ theme }) => theme.color.background[0]};
  border-radius: 0.5rem;
  padding: 0 0.5rem;
  font-size: 0.875rem;
`

const Content = styled.div`
  p,
  .recipient {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.color.bodyTransparent};
  }

  .items {
    display: flex;
    gap: 1rem;
  }
`

const DialTitle = styled.div<{ fill?: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  &:before {
    content: '';
    display: block;
    width: 1rem;
    height: 1rem;
    margin-top: -2px;
    border-radius: 100%;
    background-color: ${({ fill }) => fill ?? '#ccc'};
  }
`

const Header = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;

  .title,
  .emission {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-height: 1.5rem;
  }

  .emission {
    justify-content: flex-end;
    margin-bottom: 0.5rem;
  }

  .vote-share {
    color: ${({ theme }) => theme.color.bodyTransparent};
    font-size: 0.8rem;
  }

  .user-weights {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    > :first-child {
      font-size: 0.8rem;
      color: ${({ theme }) => theme.color.bodyTransparent};
      display: flex;
      gap: 1rem;
      align-items: center;
    }
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
  const [showVotesTable, toggleShowVotesTable] = useShowVotesTable()

  const emission = activeDial && epochData ? (activeDial.dialVotes.voteShare / 100) * epochData.emission : undefined

  return (
    <Container>
      <Header>
        <div className="title">
          <DialTitle fill={activeDial?.dial.metadata.color}>{activeDial?.dial.metadata.title}</DialTitle>
          <NetworkLabel>{activeDial?.dial.metadata.network}</NetworkLabel>
        </div>
        <div>
          <div className="emission">
            {activeDial && <CountUp end={activeDial.dialVotes.voteShare} decimals={0} duration={0.3} suffix="% " className="vote-share" />}
            <CountUp end={emission} decimals={0} duration={0.3} />
            <StyledTokenIcon symbol="MTA" />
          </div>
          <div className="user-weights">
            <div>
              <div>Show user weights</div>
              <ToggleInput onClick={toggleShowVotesTable} checked={showVotesTable} />
            </div>
          </div>
        </div>
      </Header>
      <Content>
        <p className="description">{activeDial?.dial.metadata.description ?? ''}</p>
        <div className="items">
          {activeDial?.dial.metadata.link && (
            <p>
              <ExternalLink href={activeDial.dial.metadata.link}>{activeDial.dial.metadata.linkTitle ?? 'Learn more'}</ExternalLink>
            </p>
          )}
          <div className="recipient">
            {activeDial && (
              <Tooltip tip="Recipient address" hideIcon>
                <Address
                  address={activeDial.dial.recipient}
                  truncate
                  type="account"
                  chainId={activeDial.dial.metadata.network === Networks.Polygon ? ChainIds.MaticMainnet : undefined}
                />
              </Tooltip>
            )}
          </div>
        </div>
        {showVotesTable && <DialPreferencesTable />}
      </Content>
    </Container>
  )
}
