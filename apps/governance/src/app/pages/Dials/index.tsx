import React, { FC, useState } from 'react'
import styled from 'styled-components'
import { format } from 'date-fns'

import { UnstyledButton } from '@apps/dumb-components'
import { ReactComponent as BackArrow } from '@apps/icons/back-arrow.svg'
import { ReactComponent as ForwardArrow } from '@apps/icons/forward-arrow.svg'

import { GovernancePageHeader } from '../../components/GovernancePageHeader'
import { DistributionBar } from './DistributionBar'
import { DialsMockProvider, useMockDialsState } from './DialsMockProvider'

const ArrowButton = styled(UnstyledButton)`
  margin: 0 0.5rem;
`

const EpochInfo = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.color.background[1]};
  padding: 1rem;
  border-radius: 0.75rem;
  gap: 1rem;
`

const Widget = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  border-radius: 0.875rem;
  padding: 1rem;
  gap: 1rem;

  > :first-child {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    span {
      ${({ theme }) => theme.mixins.numeric};
    }
  }

  h3 {
    color: ${({ theme }) => theme.color.body};
    font-size: 1.125rem;
    font-weight: 500;
  }
`

const Container = styled.div``

export const Dials: FC = () => {
  return (
    <DialsMockProvider>
      <DialsContent />
    </DialsMockProvider>
  )
}

const DialsContent: FC = () => {
  const { currentEpoch, dials, emission } = useMockDialsState()
  const epochRange = [currentEpoch, currentEpoch + 86400 * 7000]

  const [epoch, setEpoch] = useState(0)

  return (
    <Container>
      <GovernancePageHeader title="Dials" subtitle="Vote on future MTA emissions" />
      <Widget>
        <div>
          <h3>Current Epoch</h3>
          <div>
            <ArrowButton onClick={() => setEpoch(epoch - 1)}>
              <BackArrow />
            </ArrowButton>
            <span>{`(${format(epochRange[0], 'dd/MM')} - ${format(epochRange[1], 'dd/MM')})`}</span>
            <ArrowButton onClick={() => setEpoch(epoch + 1)}>
              <ForwardArrow />
            </ArrowButton>
          </div>
        </div>
        <EpochInfo>
          <DistributionBar dials={dials} emission={emission} />
        </EpochInfo>
      </Widget>
    </Container>
  )
}
