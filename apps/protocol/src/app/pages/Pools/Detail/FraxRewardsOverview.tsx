import React, { FC } from 'react'
import Skeleton from 'react-loading-skeleton'
import styled from 'styled-components'
import { usePropose } from '@apps/base/context/transactions'
import { TransactionManifest } from '@apps/transaction-manifest'
import { Interfaces } from '@apps/types'
import { ExternalLink, CountUp, Button } from '@apps/components/core'
import { TokenIcon } from '@apps/components/icons'

import { useFraxStakingContract, useFraxStakingState } from '../../../context/FraxStakingProvider'
import { useSelectedFeederPoolState } from '../FeederPoolProvider'

const StyledTokenIcon = styled(TokenIcon)`
  width: 2rem;
`

const Container = styled.div`
  > :first-child {
    margin-bottom: 1rem;
  }
  > :last-child {
    display: flex;
    gap: 2rem;
  }
`

export const FraxRewardsOverview: FC = () => {
  const stakingContract = useFraxStakingContract()
  const propose = usePropose()
  const { subscribedData, rewards } = useFraxStakingState()
  const feederPool = useSelectedFeederPoolState()

  const claimRewards = () => {
    if (!stakingContract) return

    propose<Interfaces.FraxCrossChainFarm, 'getReward'>(
      new TransactionManifest(stakingContract, 'getReward', [], { present: 'Claiming rewards', past: 'Claimed rewards' }),
    )
  }

  const canClaimRewards = subscribedData.value?.accountData?.earned?.some(e => e.amount.exact.gt(0))

  return (
    <Container>
      <div>
        <ExternalLink href="https://app.frax.finance/staking#mStable_FRAX_mUSD">Use this pool on Frax</ExternalLink>
      </div>
      <div>
        <div>
          <div>Balance</div>
          <div>
            {subscribedData.value?.accountData ? (
              <CountUp end={subscribedData.value.accountData.poolBalance.simple} prefix="$" />
            ) : (
              <Skeleton height={20} />
            )}
          </div>
        </div>
        <div>
          <div>Rewards APY</div>
          <div>
            {rewards.value ? (
              <>
                <CountUp end={rewards.value.base} suffix="%" /> – <CountUp end={rewards.value.maxBoost} suffix="%" />
              </>
            ) : (
              <Skeleton height={20} />
            )}
          </div>
        </div>
        <div>
          <div>Base APY</div>
          <div>{feederPool ? <CountUp end={feederPool.dailyApy} suffix="%" /> : <Skeleton height={20} />}</div>
        </div>
        <div>
          <div>Rewards</div>
          <div>
            {subscribedData.value?.accountData ? (
              subscribedData.value.accountData?.earned?.map(({ symbol, amount }) => (
                <div key={symbol}>
                  <StyledTokenIcon symbol={symbol} />
                  <CountUp end={amount.simple} />
                </div>
              ))
            ) : (
              <Skeleton height={20} />
            )}
          </div>
          <div>
            <Button scale={0.7} highlighted={canClaimRewards} onClick={claimRewards} disabled={!canClaimRewards}>
              Claim rewards
            </Button>
          </div>
        </div>
      </div>
    </Container>
  )
}
