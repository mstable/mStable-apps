import React, { FC } from 'react'
import { useToggle } from 'react-use'
import styled from 'styled-components'

import { StakedToken__factory } from '@apps/artifacts/typechain'
import { useSigner } from '@apps/base/context/account'
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

const CompoundingToggle = styled.div`
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

export const ClaimForm: FC = () => {
  const { data, loading } = useStakingQuery()
  const stakingToken = useTokenSubscription(data?.stakedToken.stakingToken.address)
  const stakedToken = useTokenSubscription(data?.stakedToken.token.address)

  const propose = usePropose()
  const signer = useSigner()

  const [amount, formValue, setFormValue] = useBigDecimalInput()
  const [isCompounding, toggleIsCompounding] = useToggle(true)

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
      <CompoundingToggle>
        <div>Compound rewards?</div>
        <ToggleInput onClick={toggleIsCompounding} checked={isCompounding} />
      </CompoundingToggle>
      <p>This will claim & re-stake your earned MTA in 1 transaction</p>
      <SendButton
        valid
        title="Claim Rewards"
        handleSend={() => {
          if (signer && data && amount && amount.exact.gt(0)) {
            propose<Interfaces.StakedToken, 'stake(uint256,address)'>(
              new TransactionManifest(
                StakedToken__factory.connect(data.stakedToken.address, signer),
                'stake(uint256,address)',
                [amount.exact, ''],
                { present: `Staking ${stakingToken.symbol}`, past: `Staked ${stakingToken.symbol}` },
              ),
            )
          }
        }}
      />
    </Container>
  )
}
