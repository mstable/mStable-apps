import { Slider } from '@apps/dumb-components'
import React, { FC, useState } from 'react'
import styled from 'styled-components'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Label, LabelList } from 'recharts'

import { GovernancePageHeader } from '../../components/GovernancePageHeader'
import { Color } from '@apps/theme'
import { DistributionBar } from './DistributionBar'

const EpochInfo = styled.div`
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.color.background[1]};
  padding: 1rem;
  border-radius: 0.75rem;
  gap: 1rem;

  > :first-child {
    display: flex;
    flex: 1;
    flex-direction: row;
    justify-content: space-between;

    h4 {
      color: ${({ theme }) => theme.color.bodyAccent};
    }

    span {
      ${({ theme }) => theme.mixins.numeric};
      font-weight: 400;
    }
  }
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
    <Container>
      <GovernancePageHeader title="Dials" subtitle="Vote on future MTA emissions" />
      <Widget>
        <div>
          <h3>Current Epoch</h3>
          <span>18/11 - 25/11</span>
        </div>
        <EpochInfo>
          <div>
            <h4>Distribution</h4>
            <span>2,300</span>
          </div>
          <DistributionBar />
        </EpochInfo>
      </Widget>
    </Container>
  )
}
