import { BalanceWidget } from '@apps/base/components/core'
import { ButtonExternal, InfoBox } from '@apps/dumb-components'
import { ViewportWidth } from '@apps/theme'
import styled from 'styled-components'

import { useEmissionsData } from './context/EmissionsContext'
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

const DOCS_URL = 'https://docs.mstable.org/using-mstable/mta-staking'
const FORUM_URL = 'https://forum.mstable.org/'

export const DialSidebar: FC = () => {
  const [emissionsData] = useEmissionsData()
  const user = emissionsData?.user
  return (
    <Sidebar>
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
