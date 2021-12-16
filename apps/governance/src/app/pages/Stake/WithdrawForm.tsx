import React, { FC, useEffect } from 'react'
import styled from 'styled-components'

import { Warning } from '@apps/dumb-components'
import { useTokenSubscription } from '@apps/base/context/tokens'
import { usePropose } from '@apps/base/context/transactions'
import { useBigDecimalInput, useFetchState } from '@apps/hooks'
import { TransactionManifest, Interfaces } from '@apps/transaction-manifest'
import { AssetInputSingle, SendButton } from '@apps/base/components/forms'
import { useBlockNow } from '@apps/base/context/block'
import { BigDecimal } from '@apps/bigdecimal'

import { useStakedTokenQuery, useStakedTokenContract } from '../../context/StakedToken'
import { TimeMultiplierImpact } from './TimeMultiplierImpact'
import { getRedemptionFee } from '../../utils'

const Fee = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  border-top: 1px solid ${({ theme }) => theme.color.background[1]};
  padding-top: 0.75rem;

  span {
    ${({ theme }) => theme.mixins.numeric};
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

export const WithdrawForm: FC = () => {
  const { data, loading } = useStakedTokenQuery()
  const [fee, setFee] = useFetchState<BigDecimal>()
  const blockNumber = useBlockNow()

  const propose = usePropose()
  const stakedTokenContract = useStakedTokenContract()

  const stakingToken = useTokenSubscription(data?.stakedToken?.stakingToken.address)
  const [amount, formValue, setFormValue] = useBigDecimalInput()

  const weightedTimestamp = data?.stakedToken?.accounts?.[0]?.balance?.weightedTimestamp
  const stakedAmount = data?.stakedToken?.accounts?.[0]?.balance?.rawBD ?? BigDecimal.ZERO
  const isValid = amount?.simple <= (stakedAmount?.simple ?? 0) && amount?.simple > 0
  const balanceV2 = data?.stakedToken?.accounts?.[0]?.balance?.rawBD

  useEffect(() => {
    if (!weightedTimestamp || fee.fetching || !stakedTokenContract) return
    setFee.fetching()
    Promise.all([stakedTokenContract ? stakedTokenContract.calcRedemptionFeeRate(weightedTimestamp) : undefined])
      .then(([fee = 0]) => {
        setFee.value(new BigDecimal(((fee as number) * 1e2).toString()))
      })
      .catch(setFee.error)
  }, [blockNumber, weightedTimestamp, setFee, fee.fetching, stakedTokenContract])

  const handleSend = () => {
    if (!stakedTokenContract || !data || amount.exact.lte(0) || !fee.value) return

    propose<Interfaces.StakedToken, 'startCooldown'>(
      new TransactionManifest(stakedTokenContract, 'startCooldown', [amount.exact], {
        present: `Initiating cooldown of ${amount.simple} ${stakingToken.symbol}`,
        past: `Initiated cooldown of ${amount.simple} ${stakingToken.symbol}`,
      }),
    )
  }

  return (
    <Container>
      <AssetInputSingle
        isFetching={loading}
        token={stakingToken}
        formValue={formValue}
        handleSetMax={() => setFormValue(stakedAmount.string)}
        handleSetAmount={setFormValue}
        stakedBalance={stakedAmount}
        preferStaked
      />
      {!!balanceV2?.simple && <TimeMultiplierImpact isStaking={false} stakeDelta={amount?.exact} />}
      <Warnings>
        <Warning>
          During withdrawals, your voting power will be temporarily reduced.{' '}
          <a href="https://docs.mstable.org/using-mstable/mta-staking/staking-v2" target="_blank" rel="noopener noreferrer">
            Learn More
          </a>
        </Warning>
        <Warning>
          There is a cooldown period to unstake & a penalty if you have not staked long enough.{' '}
          <a href="https://docs.mstable.org/using-mstable/mta-staking/staking-v2" target="_blank" rel="noopener noreferrer">
            Learn More
          </a>
        </Warning>
        <Fee>
          <div>Redemption Fee</div>
          <span>{fee.value?.simple ?? getRedemptionFee(0)}%</span>
        </Fee>
      </Warnings>
      <SendButton valid={isValid} title="Begin Withdrawal" handleSend={handleSend} />
    </Container>
  )
}
