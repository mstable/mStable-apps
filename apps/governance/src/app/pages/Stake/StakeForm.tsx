import React, { FC, useState } from 'react'
import { useToggle } from 'react-use'
import styled from 'styled-components'

import { IncentivisedVotingLockup__factory } from '@apps/artifacts/typechain'
import { useSigner } from '@apps/base/context/account'
import { Tooltip, Warning } from '@apps/components/core'
import { useTokenSubscription } from '@apps/base/context/tokens'
import { usePropose } from '@apps/base/context/transactions'
import { useBigDecimalInput } from '@apps/hooks'
import { TransactionManifest, Interfaces } from '@apps/transaction-manifest'
import { AssetInputSingle, SendButton, ToggleInput } from '@apps/components/forms'
import { useNetworkAddresses } from '@apps/base/context/network'

import { useStakedToken, useStakedTokenQuery, useStakedTokenContract } from '../../context/StakedTokenProvider'
import { DelegateInput } from '../../components/DelegateInput'
import { useStakingStatus, useStakingStatusDispatch } from '../../context/StakingStatusProvider'
import { BigDecimal } from '@apps/bigdecimal'

const DAY = 86400

interface Props {
  className?: string
  isMigrating?: boolean
}

const Input = styled(AssetInputSingle)`
  background: ${({ theme }) => theme.color.background[0]};
  height: 3.5rem;
`

const StyledDelegateInput = styled(DelegateInput)<{ isMigrating?: boolean }>`
  background: ${({ theme, isMigrating }) => isMigrating && theme.color.background[3]};
`

const DelegateToggle = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;

  h3 {
    margin-left: 0.25rem;
    display: flex;
    align-items: center;
  }
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const StakeForm: FC<Props> = ({ className, isMigrating = false }) => {
  const { data, loading } = useStakedTokenQuery()
  const { selected: stakedTokenAddress } = useStakedToken()
  const networkAddresses = useNetworkAddresses()
  const { hasWithdrawnV1Balance } = useStakingStatus()
  const { setWithdrewV1Balance } = useStakingStatusDispatch()
  const stakingToken = useTokenSubscription(data?.stakedToken?.stakingToken.address)
  const balanceV1 = useTokenSubscription(networkAddresses.vMTA)?.balance ?? new BigDecimal((1e18).toString())

  const propose = usePropose()
  const signer = useSigner()
  const stakedTokenContract = useStakedTokenContract()

  const [amount, formValue, setFormValue] = useBigDecimalInput()
  const [isDelegating, toggleIsDelegating] = useToggle(false)
  const [delegate, setDelegate] = useState<string | undefined>()

  const cooldown = parseInt(data?.stakedToken?.COOLDOWN_SECONDS) / DAY
  const unstakeWindow = parseInt(data?.stakedToken?.UNSTAKE_WINDOW) / DAY

  const handleWithdrawV1 = () => {
    if (!signer || !data || !balanceV1?.simple) return

    propose<Interfaces.IncentivisedVotingLockup, 'withdraw'>(
      new TransactionManifest(IncentivisedVotingLockup__factory.connect(networkAddresses.vMTA, signer), 'withdraw', [], {
        present: `Withdrawing from Staking V1`,
        past: `Withdrew from Staking V1`,
      }),
    )

    if (!hasWithdrawnV1Balance) {
      setWithdrewV1Balance()
    }
  }

  const handleDeposit = () => {
    if (!stakedTokenContract || amount.exact.lte(0) || !stakingToken) return

    if (delegate) {
      return propose<Interfaces.StakedToken, 'stake(uint256,address)'>(
        new TransactionManifest(stakedTokenContract, 'stake(uint256,address)', [amount.exact, delegate], {
          present: `Staking ${amount.toFixed(2)} ${stakingToken.symbol} and delegating to ${delegate}`,
          past: `Staked ${amount.toFixed(2)} ${stakingToken.symbol} and delegated to ${delegate}`,
        }),
      )
    }

    propose<Interfaces.StakedToken, 'stake(uint256)'>(
      new TransactionManifest(stakedTokenContract, 'stake(uint256)', [amount.exact], {
        present: `Staking ${amount.toFixed(2)} ${stakingToken.symbol}`,
        past: `Staked ${amount.toFixed(2)} ${stakingToken.symbol}`,
      }),
    )
  }

  return (
    <Container className={className}>
      <Input
        isFetching={loading}
        token={stakingToken}
        formValue={formValue}
        handleSetMax={setFormValue}
        handleSetAmount={setFormValue}
        spender={stakedTokenAddress}
        stakedBalance={isMigrating ? balanceV1 : undefined}
      />
      <DelegateToggle>
        <h3>
          Delegate stake? <Tooltip tip="Delegating your voting power will enable a vote in absence" />
        </h3>
        <ToggleInput onClick={toggleIsDelegating} checked={isDelegating} />
      </DelegateToggle>
      {isDelegating && <StyledDelegateInput isMigrating={isMigrating} delegate={delegate} onClick={setDelegate} />}
      <Warning>
        Unstaking is subject to a cooldown period of {cooldown} days, followed by a {unstakeWindow} day withdrawable period.&nbsp;
        <a>Learn more</a>
      </Warning>
      <Warning>A redemption fee applies to all withdrawals. The longer you stake, the lower the redemption fee.</Warning>
      {isMigrating ? (
        <div>
          {!hasWithdrawnV1Balance && <SendButton valid={!!balanceV1?.simple} title="Withdraw from V1" handleSend={handleWithdrawV1} />}
          <SendButton
            valid={((isDelegating && !!delegate) || !isDelegating) && !balanceV1?.simple}
            title="Stake in V2"
            handleSend={handleDeposit}
          />
        </div>
      ) : (
        <SendButton valid={(isDelegating && !!delegate) || !isDelegating} title="Stake" handleSend={handleDeposit} />
      )}
    </Container>
  )
}
