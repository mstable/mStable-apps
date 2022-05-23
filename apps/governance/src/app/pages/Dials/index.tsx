import { ViewportWidth } from '@apps/theme'
import styled from 'styled-components'

import { GovernancePageHeader } from '../../components/GovernancePageHeader'
import { DialsContext } from './context'
import { DialSidebar } from './DialSidebar'
import { DialView } from './DialView'
import { EpochDetails } from './EpochDetails'

import type { FC } from 'react'

const DialAndSidebar = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: column-reverse;

  @media (min-width: ${ViewportWidth.l}) {
    gap: 0;
    justify-content: space-between;
    flex-direction: row;

    > div:first-child {
      flex-basis: calc(70% - 0.5rem);
    }

    > div:last-child {
      flex-basis: calc(30% - 0.5rem);
    }
  }
`

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const Dials: FC = () => (
  <DialsContext>
    <div>
      <GovernancePageHeader title="Dials" subtitle="Vote on future MTA emissions" />
      <Inner>
        <EpochDetails />
        <DialAndSidebar>
          <DialView />
          <DialSidebar />
        </DialAndSidebar>
      </Inner>
    </div>
  </DialsContext>
)
