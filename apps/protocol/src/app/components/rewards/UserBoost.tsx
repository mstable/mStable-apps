import React, { FC } from 'react'
import styled from 'styled-components'

import { ThemedSkeleton, CountUp, DifferentialCountup } from '@apps/components/core'
import { BoostedSavingsVaultState } from '@apps/data-provider'
import { FetchState } from '@apps/hooks'
import { BoostedCombinedAPY } from '@apps/types'

import { Boost } from './Boost'

const Container = styled.div`
  h3 {
    font-size: 1.25rem;
    font-weight: 500;
    color: ${({ theme }) => theme.color.body};
  }

  p {
    color: ${({ theme }) => theme.color.bodyAccent};
  }

  > div {
    padding: 0;
    > div {
      display: flex;
      justify-content: space-between;

      p {
        font-size: 0.875rem;
        margin-top: 0.5rem;
      }

      > :last-child {
        > :first-child {
          display: flex;
          justify-content: space-between;
          h4 {
            font-weight: 500;
            margin-bottom: 0.25rem;
          }
        }
        p {
          margin-top: 1rem;
        }
      }
    }
  }
`

export const UserBoost: FC<{
  vault: BoostedSavingsVaultState
  apy: FetchState<BoostedCombinedAPY>
}> = ({ vault, vault: { isImusd }, apy }) => (
  <Container>
    <Boost vault={vault} apy={apy.value?.rewards.base}>
      <div>
        <div>
          <div>
            <h4>Base APY</h4>
            {apy.fetching ? <ThemedSkeleton height={20} width={64} /> : apy.value && <CountUp end={apy.value.rewards.base} suffix="%" />}
          </div>
          <div>
            <h4>Max APY</h4>
            {apy.fetching ? (
              <ThemedSkeleton height={20} width={64} />
            ) : (
              apy.value && <CountUp end={apy.value.rewards.maxBoost} suffix="%" />
            )}
          </div>
          <div>
            <h4>My APY</h4>
            {apy.fetching ? (
              <ThemedSkeleton height={20} width={64} />
            ) : (
              apy.value && (
                <DifferentialCountup
                  prev={apy.value.rewards.base}
                  end={apy.value?.rewards.userBoost ?? apy.value.rewards.base}
                  suffix="%"
                />
              )
            )}
          </div>
        </div>
        <p>{isImusd ? 20 : 33}% of earned rewards are claimable immediately. The remaining rewards are streamed linearly after 26 weeks</p>
      </div>
    </Boost>
  </Container>
)
