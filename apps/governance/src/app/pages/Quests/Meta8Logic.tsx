import React, { FC, useCallback, useEffect, useMemo } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import styled from 'styled-components'
import useSound from 'use-sound'

import { UnstyledButton } from '@apps/dumb-components'
import { useAccount } from '@apps/base/context/account'
import { useApolloClients } from '@apps/base/context/apollo'
import { useQuestsQuery as useStakingQuestsQuery, useAccountQuery } from '@apps/artifacts/graphql/staking'
import { useQuestsQuery as useQuestbookQuestsQuery, useUpdateQuestsMutation } from '@apps/artifacts/graphql/questbook'

// @ts-ignore
import bleep26 from '../../../assets/bleeps_26.mp3'
// @ts-ignore
import bleep27 from '../../../assets/bleeps_27.mp3'
import { StakedTokenSwitcher } from '../../components/StakedTokenSwitcher'
import { useStakedToken } from '../../context/StakedTokenProvider'

import { Typist } from './Typist'
import { QuestCard } from './QuestCard'
import { QuestInfo } from './QuestInfo'
import { getDaysUntilQueueUpdate } from '../../utils'

const NavButton = styled(UnstyledButton)`
  color: white;
  font-size: 1rem;
  padding: 0;
`

const Content = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1.25rem;
  height: 24rem;
  padding: 1rem 1.25rem;
  overflow-x: scroll;
  overflow-y: hidden;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.5) rgba(255, 255, 255, 0.5);

  ::-webkit-scrollbar {
    height: 8px;
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.5);
    border-radius: 0;
  }
  ::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 0;
    border: 4px solid rgba(255, 255, 255, 0.5);
  }
`

const Container = styled.div`
  * {
    ${({ theme }) => theme.mixins.mono};
  }

  font-size: 1.125rem;
  color: white;
  text-transform: uppercase;
  flex: 1;

  *::selection {
    background: rgba(201, 252, 213, 0.5);
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0.5rem 1.25rem;
    height: 5rem;
    font-size: 1rem;

    > :first-child {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      height: 100%;

      > div:not(:first-child):last-child {
        opacity: 0.75;
      }
    }

    > :last-child {
      color: rgba(201, 252, 213, 1);
      text-align: right;
    }

    border-bottom: 1px dashed darkgrey;
  }
`

const StyledStakedTokenSwitcher = styled(StakedTokenSwitcher)`
  > :first-child,
  > :last-child {
    border-color: rgb(201, 252, 213);
    background: rgb(62, 78, 66);
  }

  > :first-child:hover,
  > :last-child button:hover {
    background: rgb(122, 170, 134);
  }
`

const Meta8AccountContainer = styled.div`
  display: flex;
  gap: 1rem;
`

const Meta8Account: FC = () => {
  const stakedToken = useStakedToken()

  const account = useAccount()
  const { staking: client } = useApolloClients()

  const accountQuery = useAccountQuery({
    client,
    variables: { id: account ?? '' },
    skip: !account,
    pollInterval: 15e3,
  })

  const accountData = accountQuery.data?.account

  return (
    <Meta8AccountContainer>
      <StyledStakedTokenSwitcher />
      <div>
        <div>Permanent: {(1 + (accountData?.permMultiplierSimple ?? 0) * 0.1).toFixed(2)}x</div>
        <div>Season 0: {(1 + (accountData?.seasonMultiplierSimple ?? 0) * 0.1).toFixed(2)}x</div>
        <div>
          Hodl time:{' '}
          {(accountData?.stakedTokenAccounts.find(st => st.id === stakedToken.selected)?.balance?.timeMultiplierSimple ?? 1).toFixed(2)}x
        </div>
      </div>
    </Meta8AccountContainer>
  )
}

export const Meta8Logic: FC<{ isBooted: boolean }> = ({ isBooted }) => {
  const { questId } = useParams<{ questId?: string }>()
  const history = useHistory()
  const account = useAccount()
  const clients = useApolloClients()

  const nextQueueUpdate = getDaysUntilQueueUpdate()

  // Just subscribe here
  useStakingQuestsQuery({ client: clients.staking, nextFetchPolicy: 'cache-only' })

  const questbookQuestsQuery = useQuestbookQuestsQuery({
    client: clients.questbook,
    variables: { userId: account ?? '', hasUser: !!account },
    pollInterval: 30e3,
  })

  // Update all quests when the user changes
  const [updateUserQuests] = useUpdateQuestsMutation({ client: clients.questbook })
  useEffect(() => {
    if (account) {
      updateUserQuests({ variables: { userId: account ?? '', hasUser: !!account } }).catch(error => {
        console.error(error)
      })
    }
  }, [updateUserQuests, account])

  const [playBleep26] = useSound(bleep26, { volume: 0.4 })
  const [playBleep27] = useSound(bleep27, { volume: 0.4 })
  const selectQuest = useCallback(
    (id?: string) => {
      if (id) {
        playBleep27()
      } else {
        playBleep26()
      }
      history.push(id ? `/quests/${id}` : '/quests')
    },
    [history, playBleep26, playBleep27],
  )

  const questIds = useMemo<string[]>(() => {
    const questbookQuests = (questbookQuestsQuery.data?.quests ?? []).map(q => q.id)
    // TODO remove magic strings
    return ['timeMultiplier', ...questbookQuests.filter(q => q !== 'democracyMaxi'), 'democracyMaxi']
  }, [questbookQuestsQuery.data])

  return (
    <Container>
      <header>
        <div>
          {questId ? (
            <NavButton
              onClick={() => {
                selectQuest()
              }}
            >
              <Typist>[&lt; Back]</Typist>
            </NavButton>
          ) : isBooted ? (
            <Typist>[Quests]</Typist>
          ) : (
            'Booting...'
          )}
          {questId && isBooted && <div>Queue submitted in: {nextQueueUpdate}d</div>}
        </div>
        <div>{isBooted && <Meta8Account />}</div>
      </header>
      <Content>
        {isBooted ? (
          questId ? (
            <QuestInfo questId={questId} />
          ) : questId ? (
            <QuestCard
              questId={questId}
              onClick={() => {
                selectQuest(questId)
              }}
            />
          ) : (
            questIds.map(questId => (
              <QuestCard
                key={questId}
                questId={questId}
                onClick={() => {
                  selectQuest(questId)
                }}
              />
            ))
          )
        ) : (
          <Typist cursor={{ show: true, blink: true }} avgTypingDelay={20}>
            <p>Meta-8 (c) 1991 mStable Entertainment Australia</p>
            <br />
            <p>Reticulating splines...</p>
            <p>Aping into MTA...</p>
            <p>Following @metaboi_...</p>
            <p>System startup complete.</p>
          </Typist>
        )}
      </Content>
    </Container>
  )
}
