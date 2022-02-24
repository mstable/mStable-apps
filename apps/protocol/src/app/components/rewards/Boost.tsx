import React, { FC } from 'react'
import styled from 'styled-components'

import { BoostedVaultState } from '@apps/data-provider'
import { useCalculateUserBoost } from '@apps/boost'
import { createToggleContext } from '@apps/context-utils'
import { Widget, Button, ProgressBar } from '@apps/dumb-components'
import { ViewportWidth } from '@apps/theme'

import { BoostCalculator } from './BoostCalculator'

const BoostBarLine = styled.div`
  width: 100%;
  height: 2px;
  margin-left: 16px;
  margin-right: 16px;
  background: ${({ theme }) => theme.color.background[2]};
`

const BoostBarRange = styled.div`
  ${({ theme }) => theme.mixins.numeric};

  display: flex;
  justify-content: space-between;
  align-items: center;
  color: grey;
  padding: 0.5rem 0;
`

const [useShowCalculatorCtx, ShowCalculatorProvider] = createToggleContext(false)

const BoostBar: FC<{
  vault: BoostedVaultState
}> = ({ vault }) => {
  const [, toggleShowCalculator] = useShowCalculatorCtx()
  const boost = useCalculateUserBoost(vault)

  return (
    <Widget
      title="Earning Power Multiplier"
      tooltip="Stake MTA in Governance to boost your rewards by up to 3x"
      headerContent={
        <Button scale={0.7} onClick={toggleShowCalculator}>
          Calculator
        </Button>
      }
    >
      <div>
        <ProgressBar value={boost} min={1} max={3} />
        <BoostBarRange>
          <div>1x</div>
          <BoostBarLine />
          <div>3x</div>
        </BoostBarRange>
      </div>
    </Widget>
  )
}

const Container = styled(Widget)<{ showCalculator?: boolean }>`
  > div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  > div > * {
    flex: 1;
  }

  @media (min-width: ${ViewportWidth.l}) {
    > div {
      flex-direction: row;
      align-items: stretch;
    }

    > div > *:first-child {
      flex: ${({ showCalculator }) => !showCalculator && 0};
      flex-basis: ${({ showCalculator }) => !showCalculator && `50%`};
    }
    > div > *:last-child {
      flex: ${({ showCalculator }) => !showCalculator && 0};
      flex-basis: ${({ showCalculator }) => !showCalculator && `40%`};
    }
  }
`

const BoostContent: FC<{
  vault: BoostedVaultState
  apy?: number
}> = ({ children, apy, vault }) => {
  const [showCalculator, toggleShowCalculator] = useShowCalculatorCtx()

  return (
    <Container padding showCalculator={showCalculator}>
      {showCalculator ? (
        <BoostCalculator apy={apy} vault={vault} onClick={toggleShowCalculator} />
      ) : (
        <>
          <BoostBar vault={vault} />
          {children}
        </>
      )}
    </Container>
  )
}

export const Boost: FC<{
  vault: BoostedVaultState
  apy?: number
}> = ({ apy, children, vault }) => (
  <ShowCalculatorProvider>
    <BoostContent apy={apy} vault={vault}>
      {children}
    </BoostContent>
  </ShowCalculatorProvider>
)
