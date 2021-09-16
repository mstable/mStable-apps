import React, { FC, useMemo } from 'react'
import styled from 'styled-components'
import { BigNumber } from 'ethers'
import { getUnixTime } from 'date-fns'

import { useStakedTokenQuery } from '../../context/StakedTokenProvider'

const getTimeMultiplier = (hodlLengthSeconds: BigNumber) => {
  if (hodlLengthSeconds.lt(7862400)) return 0
  if (hodlLengthSeconds.lt(15724800)) return 20
  if (hodlLengthSeconds.lt(31449600)) return 30
  if (hodlLengthSeconds.lt(47174400)) return 40
  if (hodlLengthSeconds.lt(62899200)) return 50
  return 60
}

const useSimulatedTimeMultiplier = (isStaking: boolean, stakeDelta?: BigNumber) => {
  const stakedTokenQuery = useStakedTokenQuery()

  return useMemo<{ simulatedTimeMultiplier: number; timeMultiplier: number }>(() => {
    if (!stakedTokenQuery.data?.stakedToken?.accounts?.[0]?.balance || !stakeDelta) {
      return {
        simulatedTimeMultiplier: 0,
        timeMultiplier: 0,
      }
    }

    const {
      accounts: [
        {
          balance: { raw, weightedTimestamp: oldWeightedTimestamp },
        },
      ],
    } = stakedTokenQuery.data?.stakedToken

    if (!raw || !oldWeightedTimestamp)
      return {
        simulatedTimeMultiplier: 0,
        timeMultiplier: 0,
      }

    const oldStakedBalance = BigNumber.from(raw)
    const currentTimestamp = BigNumber.from(getUnixTime(Date.now()))

    const oldWeightedSeconds = currentTimestamp.sub(oldWeightedTimestamp)

    const adjustedStakedBalanceDelta = isStaking ? stakeDelta.div(2) : stakeDelta.div(8)

    const adjustedNewStakedBalance = isStaking
      ? oldStakedBalance.add(adjustedStakedBalanceDelta)
      : oldStakedBalance.sub(adjustedStakedBalanceDelta)

    const newWeightedSeconds = isStaking
      ? oldStakedBalance.mul(oldWeightedSeconds).div(adjustedNewStakedBalance)
      : adjustedNewStakedBalance.mul(oldWeightedSeconds).div(oldStakedBalance)

    // const newWeightedTimestamp = currentTimestamp.sub(newWeightedSeconds)
    const simulatedTimeMultiplier = getTimeMultiplier(newWeightedSeconds)
    const timeMultiplier = getTimeMultiplier(oldWeightedSeconds)

    return { simulatedTimeMultiplier, timeMultiplier }
  }, [stakeDelta, isStaking, stakedTokenQuery.data])
}

const Container = styled.div`
  h4 {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;

    > div {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.25rem;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      background: ${({ theme }) => theme.color.background[2]};
      > :first-child {
        color: ${({ theme }) => theme.color.bodyTransparent};
        font-size: 0.8rem;
      }
      > :last-child {
        font-size: 1.3rem;
        font-family: 'DM Mono', monospace;
      }
    }
  }
`

export const TimeMultiplierImpact: FC<{ isStaking: boolean; stakeDelta: BigNumber }> = ({ isStaking, stakeDelta }) => {
  const { timeMultiplier, simulatedTimeMultiplier } = useSimulatedTimeMultiplier(isStaking, stakeDelta)
  return (
    <Container>
      <h4>Time multiplier impact</h4>
      <div>
        <div>
          <div>Now</div>
          <div>1.{timeMultiplier.toString().slice(0, 1)}</div>
        </div>
        <div>
          <div>After</div>
          <div>1.{simulatedTimeMultiplier.toString().slice(0, 1)}</div>
        </div>
      </div>
    </Container>
  )
}
