import React, { FC, useMemo } from 'react'
import styled from 'styled-components'

import { MassetState } from '@apps/data-provider'
import { ViewportWidth } from '@apps/theme'
import { BigDecimal } from '@apps/bigdecimal'
import { CountUp } from '@apps/dumb-components'
import { useSelectedMassetState } from '@apps/masset-hooks'

import { useSelectedMassetPrice } from '../../../hooks/useSelectedMassetPrice'
import { useSelectedSaveVersion } from '../../../context/SelectedSaveVersionProvider'

const Container = styled.div`
  display: flex;
  flex-direction: column;

  > div {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    text-align: center;

    > div {
      flex-basis: calc(33.3% - 0.5rem);
      justify-content: center;
      align-items: center;
    }

    h4 {
      font-weight: 600;
    }
  }

  @media (min-width: ${ViewportWidth.s}) {
    > div > div {
      display: flex;
      flex-direction: column;

      > div {
        flex-basis: calc(50% - 0.5rem);
      }

      > div:nth-child(even) {
        text-align: right;
      }
    }
  }

  @media (min-width: ${ViewportWidth.l}) {
    > div > div {
      > div {
        flex-basis: 0;
        flex: 1;
      }

      > div:nth-child(even) {
        text-align: center;
      }
    }
  }
`

export const SavePosition: FC = () => {
  const massetState = useSelectedMassetState()
  const massetPrice = useSelectedMassetPrice()
  const [selectedSaveVersion] = useSelectedSaveVersion()

  const {
    savingsContracts: {
      v2: { boostedSavingsVault, token: saveToken, latestExchangeRate: { rate: saveExchangeRate } = {} },
    },
  } = massetState as MassetState

  const saveBalance = useMemo(
    () => saveToken?.balance?.mulTruncate(saveExchangeRate?.exact ?? BigDecimal.ZERO.exact),
    [saveExchangeRate?.exact, saveToken?.balance],
  )

  const vaultBalance = useMemo(
    () => boostedSavingsVault?.account?.rawBalance?.mulTruncate(saveExchangeRate?.exact ?? BigDecimal.ZERO.exact),
    [boostedSavingsVault?.account?.rawBalance, saveExchangeRate?.exact],
  )

  return (
    <Container>
      <div>
        <div>
          <h4>Save {selectedSaveVersion === 1 ? 'V2' : ''} Balance</h4>
          <CountUp end={(saveBalance?.simple ?? 0) * massetPrice.value ?? 1} prefix="$" decimals={2} />
        </div>
        <div>
          <h4>Vault Balance</h4>
          <CountUp end={(vaultBalance?.simple ?? 0) * massetPrice.value ?? 1} prefix="$" decimals={2} />
        </div>
      </div>
    </Container>
  )
}
