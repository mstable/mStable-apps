import React, { FC, useMemo } from 'react'
import styled from 'styled-components'

import { ThemedSkeleton } from '@apps/components/core'
import { ReactComponent as SwapIcon } from '@apps/components/icons/circle/swap.svg'
import { ExchangeAction, useSelectedMassetState } from '@apps/hooks'
import { MultiAssetExchangeProvider } from '@apps/components/forms'
import { PageHeader } from '../PageHeader'
import { ExchangeStateProvider, useExchangeState } from '../Save/hooks'
import { SwapLogic } from './SwapLogic'
import { MintExactLogic } from './MintExactLogic'
import { RedeemExactLogic } from './RedeemExactLogic'
import { SwitchButton } from './SwitchButton'

const RecolOverlay = styled.div`
  position: absolute;
  opacity: 0.75;
  background: ${({ theme }) => theme.color.background[0]};
  z-index: 2;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;

  * {
    cursor: not-allowed;
    pointer-events: none;
  }
`

const RecolMessage = styled.p`
  position: absolute;
  z-index: 5;
  left: 0;
  right: 0;
  top: 1.5rem;

  background: ${({ theme }) => theme.color.background[0]};
  text-align: center;
  padding: 1rem;
`

const Card = styled.div`
  ${({ theme }) => theme.mixins.card};
  width: 100%;
  max-width: 30rem;
`

const Container = styled.div`
  > div:last-child {
    position: relative;
    display: flex;
    justify-content: center;
  }
`

const ExchangeLogic: FC = () => {
  const massetState = useSelectedMassetState()
  const [exchangeState, setExchangeState] = useExchangeState()

  const inputAssets = useMemo(
    () =>
      !!massetState?.bAssets &&
      Object.fromEntries(
        Object.entries(massetState.bAssets).map(
          ([
            address,
            {
              token: { decimals },
            },
          ]) => [address, { decimals }],
        ),
      ),
    [massetState],
  )

  const isMultiState = [ExchangeAction.MultiMint, ExchangeAction.MultiRedeem].includes(exchangeState)

  return massetState ? (
    <MultiAssetExchangeProvider assets={inputAssets}>
      {exchangeState === ExchangeAction.Default && <SwapLogic />}
      {exchangeState === ExchangeAction.MultiMint && <MintExactLogic />}
      {exchangeState === ExchangeAction.MultiRedeem && <RedeemExactLogic />}
      {isMultiState && <SwitchButton onClick={() => setExchangeState(0)}>Go back</SwitchButton>}
    </MultiAssetExchangeProvider>
  ) : (
    <ThemedSkeleton height={360} />
  )
}

export const Exchange: FC = () => {
  const massetState = useSelectedMassetState()
  const undergoingRecol = massetState?.undergoingRecol

  return (
    <ExchangeStateProvider>
      <Container>
        <PageHeader title="Swap" icon={<SwapIcon />} massetSwitcher />
        <div>
          {undergoingRecol && (
            <>
              <RecolOverlay />
              <RecolMessage>Currently undergoing recollateralisation</RecolMessage>
            </>
          )}
          <Card>
            <ExchangeLogic />
          </Card>
        </div>
      </Container>
    </ExchangeStateProvider>
  )
}
