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
import { AssetInput, SendButton, ToggleInput } from '@apps/components/forms'

import { useStakingQuery } from '../../context/StakingProvider'

const Input = styled(AssetInput)`
  background: ${({ theme }) => theme.color.background[0]};
  height: 3.5rem;
`

const DelegateToggle = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  font-size: 1.1rem;
  margin-bottom: 1rem;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const StakeForm: FC = () => {
  const { data, loading } = useStakingQuery()
  const stakingToken = useTokenSubscription(data?.stakedToken.stakingToken.address)
  const stakedToken = useTokenSubscription(data?.stakedToken.token.address)

  const propose = usePropose()
  const signer = useSigner()

  const [amount, formValue, setFormValue] = useBigDecimalInput()
  const [isDelegating, toggleIsDelegating] = useToggle(true)
  const [delegate, setDelegate] = useState<string>('sassal0x.eth')

  return (
    <Container>
      <Input
        isFetching={loading}
        address={stakingToken?.address}
        addressOptions={stakingToken ? [stakingToken.address] : []}
        formValue={formValue}
        handleSetMax={() => {
          setFormValue(stakingToken.balance.string)
        }}
        handleSetAmount={setFormValue}
        spender={data?.stakedToken.address}
      />
      <DelegateToggle>
        <div>Delegate stake?</div>
        <ToggleInput onClick={toggleIsDelegating} checked={isDelegating} />
      </DelegateToggle>
      <Warning>
        Unstaking is subject to a cooldown period of X days, followed by a Y day withdrawable period. <a>Learn more</a>
      </Warning>
      <Warning>
        A redemption fee applies to all withdrawals. The longer you stake, the lower the redemption fee. <a>Learn more</a>
      </Warning>
      <SendButton
        valid
        title="Stake"
        handleSend={() => {
          if (signer && data && amount && amount.exact.gt(0)) {
            propose<Interfaces.StakedToken, 'stake(uint256,address)'>(
              new TransactionManifest(
                StakedToken__factory.connect(data.stakedToken.address, signer),
                'stake(uint256,address)',
                [amount.exact, delegate],
                { present: `Staking ${stakingToken.symbol}`, past: `Staked ${stakingToken.symbol}` },
              ),
            )
          }
        }}
      />
    </Container>
  )
}
