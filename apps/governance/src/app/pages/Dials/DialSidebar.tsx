import { BalanceWidget } from '@apps/base/components/core'
import { ButtonExternal, InfoBox, Warning } from '@apps/dumb-components'
import { ViewportWidth } from '@apps/theme'
import styled from 'styled-components'

import { useEmissionsData } from './context/EmissionsContext'
import { useDisabledDialsWithVotes } from './context/EpochContext'
import { DialDelegatee } from './DialDelegatee'

import type { FC } from 'react'

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  > div {
    flex: 1;
  }

  > div:last-child {
    flex-direction: column;
  }

  > div:first-child:not(:last-child) {
    border: 1px solid ${({ theme }) => theme.color.defaultBorder};
    border-radius: 1rem;
  }

  @media (min-width: ${ViewportWidth.s}) {
    flex-direction: row;

    > div:last-child {
      flex-direction: row;
    }
  }

  @media (min-width: ${ViewportWidth.l}) {
    flex-direction: column;

    > div {
      flex: initial;
    }
  }
`

const WarningContainer = styled.div`
  display: flex;
  padding: 1rem;
  border-radius: 0.875rem;
  background: ${({ theme }) => theme.color.background[0]};
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  align-items: center;
`

const WarningLabel = styled.p`
  flex: 1;
  margin-left: 0.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.875rem;
`

const DOCS_URL = 'https://docs.mstable.org/using-mstable/mta-staking'
const FORUM_URL = 'https://forum.mstable.org/'

export const DialSidebar: FC = () => {
  const [emissionsData] = useEmissionsData()
  const disabledDialsWithVotes = useDisabledDialsWithVotes()

  const user = emissionsData?.user

  return (
    <Sidebar>
      {disabledDialsWithVotes.length > 0 && (
        <WarningContainer>
          <Warning />
          <WarningLabel>
            You still have votes allocated to dials that have been disabled (
            <b>{disabledDialsWithVotes.map(d => d.metadata.title).join(', ')}</b>).
            <br />
            Re-allocate your voting power by resetting your votes.
          </WarningLabel>
        </WarningContainer>
      )}
      <BalanceWidget title="Voting Power" token="vMTA" balance={user?.votePower?.simple ?? 0} />
      {user?.isDelegatee && <DialDelegatee address={user.address} />}
      <InfoBox>
        <ButtonExternal
          onClick={() => {
            window.open(DOCS_URL)
          }}
        >
          Docs
        </ButtonExternal>
        <ButtonExternal
          onClick={() => {
            window.open(FORUM_URL)
          }}
        >
          Forum
        </ButtonExternal>
      </InfoBox>
    </Sidebar>
  )
}
