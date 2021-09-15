import React, { FC, useCallback, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import useSound from 'use-sound'

import { UnstyledButton } from '@apps/components/core'
import { useAccount } from '@apps/base/context/account'
import { useApolloClients } from '@apps/base/context/apollo'
import { useQuestsQuery as useStakingQuestsQuery, useAccountQuery } from '@apps/artifacts/graphql/staking'
import { useQuestsQuery as useQuestbookQuestsQuery, useUpdateQuestsMutation } from '@apps/artifacts/graphql/questbook'

// @ts-ignore
import bleep26 from '../../../assets/bleeps_26.mp3'
// @ts-ignore
import bleep27 from '../../../assets/bleeps_27.mp3'
import { useStakedToken } from '../../context/StakedTokenProvider'

import { Typist } from './Typist'
import { QuestCard } from './QuestCard'
import { QuestInfo } from './QuestInfo'

const NavButton = styled(UnstyledButton)`
  color: white;
  font-size: 1rem;
  padding: 0;
`

const Content = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
  height: 24rem;
  padding: 1rem 1.25rem;
  overflow-x: scroll;
  overflow-y: hidden;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.5) rgba(255, 255, 255, 0.5);

  ::-webkit-scrollbar {
    height: 4px;
    width: 4px;
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
    ${({ theme }) => theme.mixins.pixel};
  }

  font-size: 1.125rem;
  color: white;
  text-transform: uppercase;
  flex: 1;

  header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 0.5rem 1.25rem;
    height: 5rem;
    font-size: 1rem;

    > :last-child {
      color: rgba(201, 252, 213, 1);
      text-align: right;
    }

    border-bottom: 1px dashed darkgrey;
  }

  > :last-child {
  }
`

const Meta8Account: FC = () => {
  // TODO make sure we have the staked token switcher on Quests
  const stakedToken = useStakedToken()

  const account = useAccount()
  const { staking: client } = useApolloClients()

  const accountQuery = useAccountQuery({
    client,
    variables: { id: account ?? '' },
    skip: !account,
  })

  const accountData = accountQuery.data?.account

  return accountData ? (
    <>
      <div>Permanent: {accountData.permMultiplierSimple.toFixed(2)}x</div>
      <div>Season 0: {accountData.seasonMultiplierSimple.toFixed(2)}x</div>
      <div>
        Hodl time:{' '}
        {(accountData.stakedTokenAccounts.find(st => st.id === stakedToken.selected)?.balance?.timeMultiplierSimple ?? 1).toFixed(2)}x
      </div>
    </>
  ) : null
}

export const Meta8Logic: FC<{ isBooted: boolean }> = ({ isBooted }) => {
  const { questId } = useParams<{ questId?: string }>()

  const account = useAccount()
  const clients = useApolloClients()

  // Just subscribe here
  useStakingQuestsQuery({ client: clients.staking, nextFetchPolicy: 'cache-only' })

  const questbookQuestsQuery = useQuestbookQuestsQuery({
    client: clients.questbook,
    variables: { userId: account ?? '', hasUser: !!account },
  })

  // Update all quests when the user changes
  const [updateUserQuests] = useUpdateQuestsMutation({ client: clients.questbook })
  useEffect(() => {
    updateUserQuests({ variables: { userId: account ?? '', hasUser: !!account } }).catch(error => {
      console.error(error)
    })
  }, [updateUserQuests, account])

  const [selectedId, setSelectedId] = useState<string>()

  const [playBleep26] = useSound(bleep26, { volume: 0.4 })
  const [playBleep27] = useSound(bleep27, { volume: 0.4 })
  const selectQuest = useCallback(
    (id?: string) => {
      if (id) {
        playBleep27()
      } else {
        playBleep26()
      }
      setSelectedId(id)
    },
    [playBleep26, playBleep27],
  )

  return (
    <Container>
      <header>
        <div>
          {selectedId ? (
            <NavButton
              onClick={() => {
                selectQuest()
              }}
            >
              <Typist>[Back]</Typist>
            </NavButton>
          ) : isBooted ? (
            <Typist>[Quests]</Typist>
          ) : (
            'Booting...'
          )}
        </div>
        <div>{isBooted && <Meta8Account />}</div>
      </header>
      <Content>
        {isBooted ? (
          selectedId ? (
            <QuestInfo questId={selectedId} />
          ) : questId ? (
            <QuestCard questId={questId} onClick={setSelectedId} />
          ) : (
            <>
              {questbookQuestsQuery.data?.quests.map(quest => (
                <QuestCard key={quest?.id} questId={quest?.id} onClick={selectQuest} />
              ))}
              <QuestCard questId="timeMultiplier" onClick={selectQuest} />
            </>
          )
        ) : (
          <Typist cursor={{ show: true, blink: true }} avgTypingDelay={20}>
            <p>Meta-8 (c) 1991 mStable Entertainment Australia</p>
            <br />
            <p>Loading sprites...</p>
            <p>Depositing into Save...</p>
            <p>Aping into MTA...</p>
            <p>Voting on Snapshot...</p>
            <p>Following @metaboi_...</p>
            <p>System startup complete.</p>
          </Typist>
        )}
      </Content>
    </Container>
  )
}
