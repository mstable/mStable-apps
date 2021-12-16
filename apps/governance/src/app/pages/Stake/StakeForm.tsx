import React, { FC } from 'react'
import { useToggle } from 'react-use'
import styled from 'styled-components'
import { constants } from 'ethers'

import { IncentivisedVotingLockup__factory } from '@apps/artifacts/typechain'
import { useSigner } from '@apps/base/context/account'
import { Tooltip, Warning } from '@apps/dumb-components'
import { useTokenAllowance, useTokenSubscription } from '@apps/base/context/tokens'
import { usePropose } from '@apps/base/context/transactions'
import { useModalData } from '@apps/base/context/modal-data'
import { useBigDecimalInput } from '@apps/hooks'
import { TransactionManifest, Interfaces } from '@apps/transaction-manifest'
import { AssetInputSingle, SendButton } from '@apps/base/components/forms'
import { ToggleInput } from '@apps/dumb-components'
import { useNetworkAddresses } from '@apps/base/context/network'
import { truncateAddress } from '@apps/formatters'

import { useStakingQuery } from '../../context'
import { useStakedToken, useStakedTokenQuery, useStakedTokenContract } from '../../context/StakedToken'
import { DelegateSelection } from '../../components/DelegateSelection'
import { useStakingStatus, useStakingStatusDispatch } from '../../context/StakingStatus'
import { TimeMultiplierImpact } from './TimeMultiplierImpact'

const DAY = 86400

interface Props {
  className?: string
  isMigrating?: boolean
}

const StyledDelegateSelection = styled(DelegateSelection)<{ isMigrating: boolean }>`
  background: ${({ theme, isMigrating }) => isMigrating && theme.color.background[1]};
  margin-top: 0.75rem;

  button {
    background: ${({ theme, isMigrating }) => isMigrating && theme.color.background[3]};
  }
`

const Input = styled(AssetInputSingle)<{ isMigrating: boolean }>`
  background: ${({ theme, isMigrating }) => isMigrating && theme.color.background[1]};
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

const Warnings = styled.div`
  background: ${({ theme }) => theme.color.background[0]};
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  border-radius: 0.875rem;
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

export const StakeForm: FC<Props> = ({ className, isMigrating = false }) => {
  const { data, loading } = useStakedTokenQuery()
  const stakingQuery = useStakingQuery()
  const { selected: stakedTokenAddress } = useStakedToken()
  const networkAddresses = useNetworkAddresses()
  const { delegateSelection: delegate } = useModalData()
  const { hasWithdrawnV1Balance, lockedV1 } = useStakingStatus()
  const { setWithdrewV1Balance } = useStakingStatusDispatch()
  const stakingToken = useTokenSubscription(data?.stakedToken?.stakingToken.address)

  const propose = usePropose()
  const signer = useSigner()
  const stakedTokenContract = useStakedTokenContract()
  const allowance = useTokenAllowance(data?.stakedToken?.stakingToken.address, stakedTokenContract?.address)

  const [amount, formValue, setFormValue] = useBigDecimalInput('0')
  const [isDelegating, toggleIsDelegating] = useToggle(true)

  const cooldown = parseInt(data?.stakedToken?.COOLDOWN_SECONDS) / DAY
  const unstakeWindow = parseInt(data?.stakedToken?.UNSTAKE_WINDOW) / DAY

  const balanceV1 = lockedV1?.value?.balance
  const balanceV2 = data?.stakedToken?.accounts?.[0]?.balance?.rawBD
  const canUserStake =
    ((isDelegating && !!delegate) || !isDelegating) && amount?.exact?.gt(0) && allowance?.exact && amount?.exact?.lte(allowance?.exact)

  const otherStakedToken = useTokenSubscription(
    stakedTokenAddress ? stakingQuery.data?.stakedTokens.find(st => st.id !== stakedTokenAddress)?.id : undefined,
  )
  const stakedInOtherToken = stakingToken?.balance?.exact.eq(0) && otherStakedToken?.balance?.exact.gt(0)

  const handleWithdrawV1 = () => {
    if (!signer || !data || !balanceV1?.simple) return

    propose<Interfaces.IncentivisedVotingLockup, 'exit'>(
      new TransactionManifest(IncentivisedVotingLockup__factory.connect(networkAddresses.vMTA, signer), 'exit', [], {
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

    if (delegate && isDelegating) {
      if (delegate === constants.AddressZero) return
      return propose<Interfaces.StakedToken, 'stake(uint256,address)'>(
        new TransactionManifest(stakedTokenContract, 'stake(uint256,address)', [amount.exact, delegate], {
          present: `Staking ${amount.toFixed(2)} ${stakingToken.symbol} and delegating to ${truncateAddress(delegate)}`,
          past: `Staked ${amount.toFixed(2)} ${stakingToken.symbol} and delegated to ${truncateAddress(delegate)}`,
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
        isMigrating={isMigrating}
        preferStaked={isMigrating}
      />
      <div>
        <DelegateToggle>
          <h3>
            Delegate voting power <Tooltip tip="Delegating your voting power will enable a vote in absence." />
          </h3>
          <ToggleInput onClick={toggleIsDelegating} checked={isDelegating} />
        </DelegateToggle>
        {isDelegating && <StyledDelegateSelection isMigrating={isMigrating} />}
      </div>
      {!!balanceV2?.simple && <TimeMultiplierImpact isStaking stakeDelta={amount?.exact} />}
      <Warnings>
        {stakedInOtherToken && (
          <Warning highlight>It is generally not advisable to stake in both MTA and BPT because of increased gas costs.</Warning>
        )}
        <Warning>
          Unstaking is subject to a cooldown period of {cooldown} days, followed by a {unstakeWindow} day withdrawable period.
        </Warning>
        <Warning>A redemption fee applies to all withdrawals. The longer you stake, the lower the redemption fee.</Warning>
        <Warning>
          In the event that the mStable protocol requires recollateralisation, you risk getting diluted{' '}
          <a href="https://docs.mstable.org/using-mstable/mta-staking/staking-v2" target="_blank" rel="noopener noreferrer">
            Learn More
          </a>
        </Warning>
      </Warnings>
      {isMigrating ? (
        <div>
          {!hasWithdrawnV1Balance && <SendButton valid={!!balanceV1?.simple} title="Withdraw from V1" handleSend={handleWithdrawV1} />}
          <SendButton valid={canUserStake} title="Stake in V2" handleSend={handleDeposit} />
        </div>
      ) : (
        <SendButton valid title="Stake" handleSend={handleDeposit} />
      )}
    </Container>
  )
}
