import { CountUp } from '@apps/dumb-components'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { ChainIds, getNetwork } from '@apps/base/context/network'
import { useFetchPriceCtx } from '@apps/base/context/prices'
import { MassetState, useDataState } from '@apps/data-provider'
import { BigDecimal } from '@apps/bigdecimal'
import { useSelectedSaveVersion } from '../../context/SelectedSaveVersionProvider'
import { Card, Panel, Title } from './Styled'

export const Item = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  > *:first-child {
    min-width: 20ch;
  }
`

const {
  addresses: { WBTC },
} = getNetwork(ChainIds.EthereumMainnet)

const useDeposits = () => {
  const dataState = useDataState()
  const { fetchPrice } = useFetchPriceCtx()
  const wbtcPrice = fetchPrice(WBTC)
  const [selectedSaveVersion] = useSelectedSaveVersion()

  return useMemo(
    () =>
      Object.values(dataState).reduce((acc, curr: MassetState) => {
        const {
          savingsContracts: {
            v1: { savingsBalance: saveV1Balance } = {},
            v2: { boostedSavingsVault, token: saveToken, latestExchangeRate: { rate: saveExchangeRate } = {} },
          },
          feederPools,
        } = curr
        const mPrice = curr?.token?.symbol === 'mBTC' ? wbtcPrice.value : 1

        const vaults =
          (selectedSaveVersion === 1
            ? saveV1Balance?.balance
            : (boostedSavingsVault?.account?.rawBalance ?? BigDecimal.ZERO)
                .add(saveToken?.balance ?? BigDecimal.ZERO)
                .mulTruncate(saveExchangeRate?.exact ?? BigDecimal.ONE.exact) ?? BigDecimal.ZERO
          ).simple * mPrice

        const pools = Object.values(feederPools).reduce((ac, { vault, token, price }) => {
          const fpTokenPrice = price.simple * mPrice
          const userAmount = token.balance?.simple ?? 0
          const userStakedAmount = vault?.account?.rawBalance.simple ?? 0
          const totalUserBalance = (userStakedAmount + userAmount) * fpTokenPrice

          return ac + totalUserBalance
        }, 0)

        return acc + vaults + pools
      }, 0),
    [dataState, selectedSaveVersion, wbtcPrice.value],
  )
}

export const Overview = () => {
  const deposits = useDeposits()

  return (
    <div>
      <Title>Overview</Title>
      <Card>
        <Panel>
          <Item>
            <span>My deposits</span>
            <CountUp end={deposits} prefix="$" />
          </Item>
          <Item>
            <span>Pending rewards</span>
            <CountUp end={50.1} suffix="MTA" />
          </Item>
          <Item>
            <span>Claimed rewards</span>
            <CountUp end={195.9} suffix="MTA" />
          </Item>
          <Item>
            <span>Total rewards</span>
            <CountUp end={246.0} suffix="MTA" />
          </Item>
        </Panel>
      </Card>
    </div>
  )
}
