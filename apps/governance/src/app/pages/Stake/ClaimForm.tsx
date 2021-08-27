import React, { FC, useMemo } from 'react'
import { useToggle } from 'react-use'
import styled from 'styled-components'

import { StakedToken__factory } from '@apps/artifacts/typechain'
import { useSigner } from '@apps/base/context/account'
import { usePropose } from '@apps/base/context/transactions'
import { TransactionManifest, Interfaces } from '@apps/transaction-manifest'
import { SendButton, ToggleInput } from '@apps/components/forms'
import { useStakedToken, useStakedTokenQuery } from '../../context/StakedTokenProvider'
import { TokenIcon } from '@apps/components/icons'
import { ThemedSkeleton } from '@apps/components/core'

interface Balance {
  symbol?: string
  amount: number
  decimals?: number
  suffix?: string
}

const CompoundingToggle = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  font-size: 1.1rem;
  margin-bottom: 1rem;
`

const ClaimBalance = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.125rem;

  > *:first-child span {
    ${({ theme }) => theme.mixins.numeric};
  }

  > *:last-child {
    display: flex;
    align-items: center;
    font-weight: 600;

    div {
      width: 2rem;
      margin-right: 0.5rem;
    }
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  > *:first-child {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 0 0.5rem;
    flex: 1;
  }
`

export const ClaimForm: FC = () => {
  const { data, loading } = useStakedTokenQuery()
  const { selected: stakedTokenAddress } = useStakedToken()
  const [isCompounding, toggleIsCompounding] = useToggle(false)

  const propose = usePropose()
  const signer = useSigner()

  const rewards = useMemo<Balance>((): Balance | undefined => {
    const account = data?.stakedToken?.accounts?.[0]
    if (!data || !account) return
    return { symbol: data.stakedToken.stakingRewards.rewardsToken.symbol, amount: parseInt(account.rewards) / 1e18 }
  }, [data])

  const handleSend = () => {
    if (!signer || !data) return

    if (isCompounding) {
      return propose<Interfaces.StakedToken, 'compoundRewards'>(
        new TransactionManifest(StakedToken__factory.connect(stakedTokenAddress, signer), 'compoundRewards', [], {
          present: `Compound rewards`,
          past: `Compounding rewards`,
        }),
      )
    }

    propose<Interfaces.StakedToken, 'claimReward()'>(
      new TransactionManifest(StakedToken__factory.connect(stakedTokenAddress, signer), 'claimReward()', [], {
        present: `Claim rewards`,
        past: `Claimed rewards`,
      }),
    )
  }

  return (
    <Container>
      <div>
        <ClaimBalance>
          <div>
            {loading ? (
              <ThemedSkeleton height={28} width={230} />
            ) : !!rewards?.amount ? (
              <span>{rewards?.amount}</span>
            ) : (
              <span>no rewards</span>
            )}
          </div>
          <div>
            <TokenIcon symbol="MTA" />
            <span>MTA</span>
          </div>
        </ClaimBalance>
        <div>
          <CompoundingToggle>
            <h3>Compound rewards?</h3>
            <ToggleInput onClick={toggleIsCompounding} checked={isCompounding} />
          </CompoundingToggle>
          <p>This will claim and re-stake your earned MTA in 1 transaction</p>
        </div>
      </div>
      <SendButton valid={!!rewards?.amount} title={isCompounding ? 'Compound Rewards' : 'Claim Rewards'} handleSend={handleSend} />
    </Container>
  )
}
