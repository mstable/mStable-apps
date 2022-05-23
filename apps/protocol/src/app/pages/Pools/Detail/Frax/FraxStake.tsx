import { useMemo, useState } from 'react'

import { MultiRewards } from '@apps/base/components/core'
import { AssetInput } from '@apps/base/components/forms'
import { useNetwork } from '@apps/base/context/network'
import { useTokenAllowance } from '@apps/base/context/tokens'
import { usePropose } from '@apps/base/context/transactions'
import { BigDecimal } from '@apps/bigdecimal'
import { Button, CountdownBar, CountUp, Slider, Table, TableCell, TableRow } from '@apps/dumb-components'
import { useBigDecimalInput } from '@apps/hooks'
import { TransactionManifest } from '@apps/transaction-manifest'
import { formatDuration, intervalToDuration } from 'date-fns'
import styled from 'styled-components'

import { StakingRewards } from '../../../../components/rewards/StakingRewards'
import { useFraxStakingContract, useFraxStakingState } from '../../../../context/FraxStakingProvider'
import { useSelectedFeederPoolState } from '../../FeederPoolProvider'

import type { MaticMainnet } from '@apps/base/context/network'
import type { StakingRewardsExtended } from '@apps/masset-hooks'
import type { Interfaces } from '@apps/types'
import type { FC } from 'react'

const TABLE_CELL_WIDTHS = [35, 15, 30]
const DAY = 86400

const Input = styled(AssetInput)`
  height: 2.5rem;
  border-radius: 0.5rem;
  padding: 0;
  border: none;
  max-width: 16rem;

  button {
    padding: 0.25rem 0.5rem;
    border-radius: 0.5rem;
    height: 1.875rem;
  }

  .approve-button {
    border-radius: 0.75rem;
    height: 3rem;
    span {
      font-size: 0.875rem;
      color: ${({ theme }) => theme.color.white};
    }
  }

  > div {
    margin-right: 0.5rem;
  }
`

const StyledRow = styled(TableRow)`
  background: ${({ theme }) => theme.color.background[0]};

  :hover {
    background: ${({ theme, onClick }) => onClick && theme.color.background[1]};
  }
`

const LockupRow = styled(TableRow)`
  display: flex;
  width: 100%;
  padding: 1rem 0.25rem;
  justify-content: flex-start;
  flex-direction: column;
  background: ${({ theme }) => theme.color.background[0]};

  p {
    line-height: 2em;
  }

  > td {
    display: flex;
    flex-direction: column;
    flex: 1;
    align-items: flex-start;
    justify-content: space-between;
  }

  > td > div:not(:last-child) {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    width: 100%;

    span {
      ${({ theme }) => theme.mixins.numeric};
      color: ${({ theme }) => theme.color.blue};
    }
  }

  > td > div:last-child {
    margin-top: 0.5rem;
  }
`

const MultiplierCell = styled(TableCell)`
  span {
    color: ${({ theme }) => theme.color.body};
    ${({ theme }) => theme.mixins.numeric};
  }
`

const StyledTable = styled(Table)`
  background: ${({ theme }) => theme.color.background[1]};
  padding: 0.25rem 0.5rem 0.5rem;
  border-radius: 1rem;

  td h3 {
    margin: 0;
    color: ${({ theme }) => theme.color.bodyAccent};

    span {
      color: ${({ theme }) => theme.color.body};
    }
  }
`

const Container = styled.div`
  > *:not(:last-child) {
    margin-bottom: 1.5rem;
  }
`

const depositHeaderTitles = ['Wallet', ''].map((t, i) =>
  i === 1 ? { title: t, tooltip: 'Lock your tokens for a period of time to earn a boosted reward multiplier' } : { title: t },
)
const withdrawHeaderTitles = ['Vault', 'Multiplier', 'Time Remaining'].map(t => ({ title: t }))

export const FraxStake: FC = () => {
  const network = useNetwork() as MaticMainnet
  const { subscribedData: userData, staticData } = useFraxStakingState()
  const feederPool = useSelectedFeederPoolState()
  const contract = useFraxStakingContract()
  const propose = usePropose()

  const yieldAPY = feederPool?.dailyApy

  const sliderStart = staticData.value?.lockTimeMin
  const sliderEnd = staticData.value?.lockTimeMax
  const maxMultiplier = staticData.value?.lockMaxMultiplier ?? 1
  const lockTimeMax = staticData.value?.lockTimeMax

  const accountData = userData.value?.accountData
  const poolBalance: BigDecimal | undefined = accountData?.poolBalance
  const lockedStakes = accountData?.lockedStakes
  const earned = accountData?.earned
  const [seconds, setValue] = useState(sliderStart ?? DAY)
  const [inputValue, inputFormValue, handleSetAmount] = useBigDecimalInput(poolBalance ?? '0')

  const showDeposit = !!accountData?.poolBalance?.simple
  const showWithdraw = lockedStakes?.length

  const allowance = useTokenAllowance(network.addresses.FRAX.stakingToken, contract?.address)
  const needsApprove = !inputValue || !allowance || (inputValue && allowance?.exact.lt(inputValue.exact))

  const timeDifference = useMemo(() => {
    const start = Date.now()
    const duration = intervalToDuration({ start, end: start + seconds * 1000 })

    const nonzero = Object.entries(duration)
      .filter(([, v]) => v)
      .map(([unit]) => unit)

    return formatDuration(duration, {
      format: ['years', 'months', 'weeks', 'days'].filter(i => new Set(nonzero).has(i)).slice(0, 3),
      delimiter: ', ',
    })
  }, [seconds])

  const boostMultiplier = useMemo(() => {
    if (!lockTimeMax) return 1
    const secs = Math.ceil(seconds)
    return 1 + (secs * (maxMultiplier - 1)) / lockTimeMax
  }, [maxMultiplier, lockTimeMax, seconds])

  const handleWithdraw = (kekId: string): void => {
    if (!contract) return
    propose<Interfaces.FraxCrossChainFarm, 'withdrawLocked'>(
      new TransactionManifest(contract, 'withdrawLocked', [kekId], {
        present: 'Withdrawing LP token',
        past: 'Withdrew LP token',
      }),
    )
  }

  const handleDeposit = (): void => {
    if (!contract || !inputValue?.exact || !seconds) return
    if (seconds >= DAY) {
      propose<Interfaces.FraxCrossChainFarm, 'stakeLocked'>(
        new TransactionManifest(contract, 'stakeLocked', [inputValue.exact, seconds], {
          present: 'Staking LP token',
          past: 'Staked LP token',
        }),
      )
    }
  }

  const handleClaim = (): void => {
    if (!contract) return
    propose<Interfaces.FraxCrossChainFarm, 'getReward'>(
      new TransactionManifest(contract, 'getReward', [], {
        present: 'Claiming rewards',
        past: 'Claimed rewards',
      }),
    )
  }

  const handleSetMax = (): void => handleSetAmount(poolBalance?.string ?? '0')

  const rewards = useMemo(() => {
    const stakingRewards: StakingRewardsExtended = {
      stakingRewardsContract: undefined,
      rewards: [
        {
          id: 'yield',
          name: 'Yield',
          apy: yieldAPY,
          apyTip:
            'This APY is derived from the native interest rate + current available staking rewards, and is not reflective of future rates.',
          tokens: ['yield'],
          priority: true,
        },
        {
          id: 'MTA',
          name: 'FRAX',
          apy: 0,
          apyTip: 'This APY is derived from currently available staking rewards, and is not reflective of future rates.',
          tokens: ['FXS'],
          priority: false,
        },
        {
          id: 'FRAX',
          name: 'FRAX',
          apy: 0,
          apyTip: 'This APY is derived from currently available staking rewards, and is not reflective of future rates.',
          tokens: ['MTA'],
          priority: false,
        },
      ].map(v => ({ ...v, stakeLabel: undefined, balance: undefined, amounts: undefined })),
      earned: undefined,
      stakedBalance: undefined,
      unstakedBalance: undefined,
      hasStakedBalance: false,
      hasUnstakedBalance: false,
    }

    const rewardsEarned = {
      canClaim: earned?.reduce((a, b) => a.add(b.amount), BigDecimal.ZERO).exact.gt(0) ?? false,
      rewards: earned?.map(({ symbol, amount }) => ({ token: symbol, earned: amount })) ?? [],
    }
    return { rewardsEarned, stakingRewards }
  }, [earned, yieldAPY])

  return (
    <Container>
      <StakingRewards stakingRewards={rewards.stakingRewards} />
      {!!showDeposit && (
        <StyledTable headerTitles={depositHeaderTitles}>
          <StyledRow buttonTitle="Stake">
            <TableCell width={60}>
              <Input
                handleSetAmount={handleSetAmount}
                handleSetMax={handleSetMax}
                formValue={inputFormValue}
                address={network.addresses.FRAX.stakingToken}
                spender={network.addresses.FRAX.stakingContract}
                hideToken
              />
            </TableCell>
            <TableCell width={40}>
              <Button disabled={needsApprove} highlighted={!needsApprove} onClick={handleDeposit}>
                Stake
              </Button>
            </TableCell>
          </StyledRow>
          {!!sliderStart && !!sliderEnd && (
            <LockupRow>
              <TableCell>
                <div>
                  <h4>Amount:</h4>
                  <span>{inputFormValue} mUSD/FRAX</span>
                </div>
                <div>
                  <h4>Lock time: </h4>
                  <span>{timeDifference}</span>
                </div>
                <div>
                  <h4>Boost:</h4>
                  <span>{boostMultiplier.toFixed(3)}x</span>
                </div>
                <Slider min={sliderStart} max={sliderEnd} step={DAY} value={seconds} onChange={setValue} />
              </TableCell>
            </LockupRow>
          )}
        </StyledTable>
      )}
      {!!showWithdraw && (
        <StyledTable headerTitles={withdrawHeaderTitles} widths={TABLE_CELL_WIDTHS} width={31}>
          {lockedStakes?.map(({ liquidity, lockMultiplier, endTime, startTime, kekId }) => {
            const dateRange = endTime - startTime
            const unlocked = endTime < Date.now()
            const percentage = 100 * ((endTime - Date.now()) / dateRange)
            return (
              !!liquidity?.simple && (
                <StyledRow key={kekId} onClick={unlocked ? () => handleWithdraw(kekId) : undefined} buttonTitle="Withdraw">
                  <TableCell width={TABLE_CELL_WIDTHS[0]}>
                    <h3>
                      <CountUp end={liquidity?.simple} decimals={2} />
                      {` mUSD/FRAX`}
                    </h3>
                  </TableCell>
                  <MultiplierCell width={TABLE_CELL_WIDTHS[1]}>
                    <span>{lockMultiplier?.simple.toFixed(3)}x</span>
                  </MultiplierCell>
                  <TableCell width={TABLE_CELL_WIDTHS[2]}>
                    {unlocked ? <span>Unlocked</span> : <CountdownBar percentage={percentage} end={endTime} />}
                  </TableCell>
                </StyledRow>
              )
            )
          })}
        </StyledTable>
      )}
      <MultiRewards rewardsEarned={rewards.rewardsEarned} onClaimRewards={handleClaim} />
    </Container>
  )
}
