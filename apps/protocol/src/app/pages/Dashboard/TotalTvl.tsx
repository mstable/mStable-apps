import React, { useMemo } from 'react'
import type { FC } from 'react'
import { useDataState } from '@apps/data-provider'
import styled from 'styled-components'
import { useWBTCPrice } from './utils'
import { ViewportWidth } from '@apps/theme'
import { ThemedSkeleton } from '@apps/dumb-components'

const StyledSkeleton = styled(ThemedSkeleton)`
  max-width: 20rem;
  width: 100%;
  height: 6rem;
  border-radius: 0.75rem;
`

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 1rem;
  border: 1px solid ${({ theme }) => theme.color.defaultBorder};
  padding: 1.5rem;
  margin-bottom: 1rem;

  h3 {
    font-size: 2rem;
    padding: 1rem 0;
    font-weight: 500;
  }

  p {
    color: ${({ theme }) => theme.color.bodyAccent};
    text-align: center;
    font-size: 0.875rem;
  }

  @media (min-width: ${ViewportWidth.m}) {
    h3 {
      padding: 1.75rem 0;
      font-size: 2.5rem;
      font-weight: 500;
    }

    p {
      font-size: 1rem;
    }
  }
`

export const TotalTvl: FC = () => {
  const dataState = useDataState()
  const wbtcPrice = useWBTCPrice()

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  const tvl = useMemo(
    () =>
      Object.values(dataState).reduce(
        (acc, curr) => acc + curr.token.totalSupply.simple * (curr?.token?.symbol === 'mBTC' ? wbtcPrice.value : 1),
        0,
      ),
    [dataState, wbtcPrice],
  )

  return (
    <Stack>
      {!!tvl ? (
        <>
          <h3>{formatter.format(tvl)}</h3>
          <p>Total value deposited in mStable</p>
        </>
      ) : (
        <StyledSkeleton />
      )}
    </Stack>
  )
}
