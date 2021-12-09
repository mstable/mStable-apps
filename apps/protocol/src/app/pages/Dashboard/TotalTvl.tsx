import { useDataState } from '@apps/data-provider'
import { CountUp, Tooltip } from '@apps/dumb-components'
import React, { FC, useMemo } from 'react'
import styled from 'styled-components'
import { useWBTCPrice } from './utils'

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ theme }) => `linear-gradient(180deg, rgba(74,161,255, 0.3) 0%, ${theme.color.background[0]} 100%)`};
  border-radius: 1rem;
  padding: 1.5rem;
`

const TooltipWrapper = styled(Tooltip)`
  font-size: 3rem;
  padding: 2rem 0;
`

export const TotalTvl: FC = () => {
  const dataState = useDataState()
  const wbtcPrice = useWBTCPrice()

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
      <TooltipWrapper tip="Total supply amount in all supported vaults" hideIcon>
        <CountUp end={tvl} prefix="$" decimals={0} />
      </TooltipWrapper>
      <p>total value deposited in mStable in USD</p>
    </Stack>
  )
}
