import React, { FC } from 'react'
import { useToggle } from 'react-use'
import styled from 'styled-components'

import { BoostedSavingsVaultState } from '@apps/data-provider'
import { TransitionCard, Button } from '@apps/dumb-components'
import { ChainIds, useNetwork } from '@apps/base/context/network'
import { ViewportWidth } from '@apps/theme'

import { BoostCalculator } from '../../../components/rewards/BoostCalculator'
import { useFeederPoolApy } from '../../../hooks/useFeederPoolApy'
import { useSelectedFeederPoolState } from '../FeederPoolProvider'

const Card = styled.div`
  display: flex;
  justify-content: space-between;
  border-radius: 1rem;
  padding: 1rem;

  > button {
    width: 100%;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: ${({ theme }) => theme.color.body};
    margin-bottom: 0.75rem;
  }
`

const Container = styled(Card)`
  background: ${({ theme }) => theme.color.background[1]};
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  margin: 0.5rem;

  > div:last-child {
    display: flex;
    height: 100%;
    align-items: center;
    margin-top: 1rem;
  }

  @media (min-width: ${ViewportWidth.m}) {
    flex-direction: row;
    align-items: flex-start;

    > div {
      margin-bottom: 0;
    }

    > button {
      width: inherit;
    }

    > div:last-child {
      margin-top: 0;
    }
  }
`

const LiquidityMessageContent: FC<{
  vault: BoostedSavingsVaultState
  apy?: number
}> = ({ vault, apy }) => {
  const [showCalculator, setShowCalculator] = useToggle(false)
  const network = useNetwork()
  const canBoost = network.chainId === ChainIds.EthereumMainnet
  return (
    <TransitionCard
      selection={showCalculator ? 'boost' : undefined}
      components={{
        boost: <BoostCalculator vault={vault} noBackButton apy={apy} />,
      }}
    >
      <Container>
        <div>
          <h3>Need {vault?.stakingToken.symbol} tokens to stake?</h3>
          <p>Provide liquidity by depositing below, and stake to earn rewards and trade fees</p>
        </div>
        <div>
          {canBoost && (
            <Button highlighted onClick={setShowCalculator}>
              Calculate Boost
            </Button>
          )}
        </div>
      </Container>
    </TransitionCard>
  )
}

export const LiquidityMessage: FC = () => {
  const feederPool = useSelectedFeederPoolState()
  const apy = useFeederPoolApy(feederPool.address)

  return <LiquidityMessageContent vault={feederPool.vault} apy={apy.value?.rewards.base} />
}
