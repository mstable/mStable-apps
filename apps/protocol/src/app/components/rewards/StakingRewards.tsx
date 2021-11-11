import React, { FC } from 'react'
import styled from 'styled-components'

import type { StakingRewardsExtended } from '@apps/base/hooks'
import { Tooltip } from '@apps/dumb-components'

interface Props {
  stakingRewards?: StakingRewardsExtended
}

const Container = styled.div`
  border: 1px dashed ${({ theme }) => theme.color.background[3]};
  border-radius: 1rem;
  padding: 1rem;
  align-items: center;
  text-align: center;

  p {
    line-height: 1.5rem;
  }

  p:first-child {
    margin-bottom: 0.75rem;
  }
`

const APY = styled.div`
  display: flex;
  font-size: 0.875rem;
  justify-content: center;

  div {
    background: ${({ theme }) => theme.color.green};
    color: ${({ theme }) => theme.color.white};
    margin-right: 1rem;
    border-radius: 0.75rem;
    padding: 0.25rem 0.5rem;
    align-items: center;
    display: flex;
  }

  div:first-child {
    background: ${({ theme }) => theme.color.greyTransparent};
  }

  div > span > span > span:first-child {
    ${({ theme }) => theme.mixins.numeric};
    margin-right: 0.3rem;
  }
`

export const StakingRewards: FC<Props> = ({ stakingRewards }) => {
  return (
    <Container>
      {!stakingRewards.hasStakedBalance && stakingRewards.hasUnstakedBalance ? (
        <p>Stake to earn rewards in addition to native yield</p>
      ) : (
        !stakingRewards.hasUnstakedBalance && !stakingRewards.hasStakedBalance && <p>Deposit to the pool and then stake to earn rewards</p>
      )}
      <APY>
        {stakingRewards?.rewards
          ?.filter(reward => reward.tokens.length < 2)
          .map(({ apy: _apy, apyTip, tokens, name, id }) => {
            const dp = Math.pow(10, 2)
            const apy = Math.floor(_apy * dp) / dp
            return (
              !!apy && (
                <div key={id}>
                  <Tooltip tip={apyTip} hideIcon>
                    <span>
                      {id === 'yieldRewards' ? '' : '+'}
                      {!!apy && `${apy.toFixed(2)}%`}
                    </span>
                    <span>{tokens.length ? tokens[0] : name}</span>
                  </Tooltip>
                </div>
              )
            )
          })}
      </APY>
    </Container>
  )
}
