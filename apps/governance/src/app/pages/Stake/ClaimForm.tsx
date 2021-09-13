import React, { FC, useMemo } from 'react'
import { useToggle } from 'react-use'
import styled from 'styled-components'

import { usePropose } from '@apps/base/context/transactions'
import { TransactionManifest, Interfaces } from '@apps/transaction-manifest'
import { SendButton, ToggleInput } from '@apps/components/forms'
import { MultiRewards } from '@apps/components/core'
import { BigDecimal } from '@apps/bigdecimal'

import { useStakedToken, useStakedTokenContract, useStakedTokenQuery } from '../../context/StakedTokenProvider'

interface Balance {
  symbol?: string
  amount: BigDecimal
}

const Compound = styled.div`
  padding: 0 0.5rem;

  > div {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: center;
    margin-bottom: 0.25rem;
  }

  p {
    font-size: 0.875rem;
    color: ${({ theme }) => theme.color.bodyAccent};
  }
`

const StyledMultiRewards = styled(MultiRewards)`
  tbody {
    background: ${({ theme }) => theme.color.background[0]};
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
  height: 100%;
`

export const ClaimForm: FC = () => {
  const { data } = useStakedTokenQuery()
  const { selected: stakedTokenAddress, options } = useStakedToken()
  const [isCompounding, toggleIsCompounding] = useToggle(false)

  const stakedTokenContract = useStakedTokenContract()
  const propose = usePropose()

  const stakedTokenSymbol = options[stakedTokenAddress]?.icon?.symbol

  const rewards = useMemo<Balance>((): Balance | undefined => {
    const account = data?.stakedToken?.accounts?.[0]
    return { symbol: stakedTokenSymbol, amount: new BigDecimal(account?.rewards ?? 0) }
  }, [data, stakedTokenSymbol])

  const handleSend = () => {
    if (!stakedTokenContract || !data) return

    if (isCompounding) {
      return propose<Interfaces.StakedToken, 'compoundRewards'>(
        new TransactionManifest(stakedTokenContract, 'compoundRewards', [], {
          present: `Compound rewards`,
          past: `Compounded rewards`,
        }),
      )
    }

    propose<Interfaces.StakedToken, 'claimReward()'>(
      new TransactionManifest(stakedTokenContract, 'claimReward()', [], {
        present: `Claim rewards`,
        past: `Claimed rewards`,
      }),
    )
  }

  return (
    <Container>
      <StyledMultiRewards rewardsEarned={{ rewards: [{ earned: rewards?.amount, token: rewards?.symbol }] }} />
      {stakedTokenSymbol === 'MTA' && (
        <Compound>
          <div>
            <h3>Compound rewards?</h3>
            <ToggleInput onClick={toggleIsCompounding} checked={isCompounding} />
          </div>
          <p>This will claim and re-stake your earned MTA in 1 transaction</p>
        </Compound>
      )}
      <SendButton valid={!!rewards?.amount} title={isCompounding ? 'Compound Rewards' : 'Claim Rewards'} handleSend={handleSend} />
    </Container>
  )
}
