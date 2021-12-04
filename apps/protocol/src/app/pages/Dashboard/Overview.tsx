import { CountUp } from '@apps/dumb-components'
import React from 'react'
import styled from 'styled-components'
import { useDeposits } from './BalanceProvider'
import { Card, Panel, Title } from './Styled'

export const Item = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  > *:first-child {
    min-width: 20ch;
  }
`
export const Overview = () => {
  const deposits = useDeposits()

  return (
    <div>
      <Title>Overview</Title>
      <Card>
        <Panel>
          <Item>
            <span>My deposits</span>
            <CountUp end={deposits} prefix="$" />
          </Item>
          <Item>
            <span>Pending rewards</span>
            <CountUp end={50.1} suffix="MTA" />
          </Item>
          <Item>
            <span>Claimed rewards</span>
            <CountUp end={195.9} suffix="MTA" />
          </Item>
          <Item>
            <span>Total rewards</span>
            <CountUp end={246.0} suffix="MTA" />
          </Item>
        </Panel>
      </Card>
    </div>
  )
}
