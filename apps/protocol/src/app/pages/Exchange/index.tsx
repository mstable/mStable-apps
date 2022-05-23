import { useMemo } from 'react'

import { MultiAssetExchangeProvider } from '@apps/base/components/forms'
import { ThemedSkeleton } from '@apps/dumb-components'
import { ExchangeAction } from '@apps/hooks'
import { useSelectedMassetState } from '@apps/masset-hooks'
import styled from 'styled-components'

import { ProtocolPageHeader as PageHeader } from '../ProtocolPageHeader'
import { ExchangeStateProvider, useExchangeState } from '../Save/hooks'
import { MintExactLogic } from './MintExactLogic'
import { RedeemExactLogic } from './RedeemExactLogic'
import { SwapLogic } from './SwapLogic'
import { SwitchButton } from './SwitchButton'

import type { FC } from 'react'

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
  display: flex;
  position: relative;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  padding: 0.5rem;
  border-radius: 1rem;

  background: ${({ theme }) => theme.color.background[1]};
  width: 100%;
  max-width: 30rem;

  > div {
    background: ${({ theme }) => theme.color.background[0]};
    border-radius: 0.75rem;
    padding: 0.75rem;
  }
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
        <PageHeader title="Swap" massetSwitcher />
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
