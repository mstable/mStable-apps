import React, { FC, useState } from 'react'
import { useToggle } from 'react-use'
import styled from 'styled-components'

import { StakedToken__factory } from '@apps/artifacts/typechain'
import { useSigner } from '@apps/base/context/account'
import { Warning } from '@apps/components/core'
import { useTokenSubscription } from '@apps/base/context/tokens'
import { usePropose } from '@apps/base/context/transactions'
import { useBigDecimalInput } from '@apps/hooks'
import { TransactionManifest, Interfaces } from '@apps/transaction-manifest'
import { AssetInputSingle, SendButton, ToggleInput } from '@apps/components/forms'
import { DelegateInput } from '../../components/DelegateInput'

import { useStakedToken, useStakedTokenQuery } from '../../context/StakedTokenProvider'

const Input = styled(AssetInputSingle)`
  background: ${({ theme }) => theme.color.background[0]};
  height: 3.5rem;
`

const DelegateToggle = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;

  h3 {
    margin-left: 0.25rem;
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const StakeForm: FC = () => {
  const { data, loading } = useStakedTokenQuery()
  const { selected: stakedTokenAddress } = useStakedToken()

  const stakingToken = useTokenSubscription(data?.stakedToken?.stakingToken.address)

  const propose = usePropose()
  const signer = useSigner()

  const [amount, formValue, setFormValue] = useBigDecimalInput()
  const [isDelegating, toggleIsDelegating] = useToggle(true)
  const [delegate, setDelegate] = useState<string | undefined>()

  const handleSend = () => {
    console.log(signer, data, amount)
    if (!signer || !data || amount.exact.lte(0)) return

    if (delegate) {
      return propose<Interfaces.StakedToken, 'stake(uint256,address)'>(
        new TransactionManifest(
          StakedToken__factory.connect(stakedTokenAddress, signer),
          'stake(uint256,address)',
          [amount.exact, delegate],
          {
            present: `Staking ${stakingToken.symbol} and delegating to ${delegate}`,
            past: `Staked ${stakingToken.symbol} and delegated to ${delegate}`,
          },
        ),
      )
    }

    propose<Interfaces.StakedToken, 'stake(uint256)'>(
      new TransactionManifest(StakedToken__factory.connect(stakedTokenAddress, signer), 'stake(uint256)', [amount.exact], {
        present: `Staking ${stakingToken.symbol}`,
        past: `Staked ${stakingToken.symbol}`,
      }),
    )
  }

  return (
    <Container>
      <Input
        isFetching={loading}
        token={stakingToken}
        formValue={formValue}
        handleSetMax={() => setFormValue(stakingToken.balance.string)}
        handleSetAmount={setFormValue}
        spender={stakedTokenAddress}
      />
      <DelegateToggle>
        <h3>Delegate stake?</h3>
        <ToggleInput onClick={toggleIsDelegating} checked={isDelegating} />
      </DelegateToggle>
      {isDelegating && <DelegateInput delegate={delegate} onClick={setDelegate} />}
      <Warning>
        Unstaking is subject to a cooldown period of X days, followed by a Y day withdrawable period. <a>Learn more</a>
      </Warning>
      <Warning>
        A redemption fee applies to all withdrawals. The longer you stake, the lower the redemption fee. <a>Learn more</a>
      </Warning>
      <SendButton valid={(isDelegating && delegate) || !isDelegating} title="Stake" handleSend={handleSend} />
    </Container>
  )
}
