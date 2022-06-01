import { useMemo } from 'react'

import { BigDecimal } from '@apps/bigdecimal'
import { Arrow, Button } from '@apps/dumb-components'
import styled from 'styled-components'

import { useTokenSubscription } from '../../context/TokensProvider'
import { useCheckPath } from '../../hooks/useCheckPath'
import { AssetInput } from './AssetInput'
import { ExchangeRate } from './ExchangeRate'

import type { AddressOption } from '@apps/types'
import type { FC } from 'react'

export interface Props {
  inputAddress?: string
  inputAddressDisabled?: boolean
  inputAddressOptions: AddressOption[]
  inputFormValue?: string
  handleSetInputAddress?: (address?: string) => void
  handleSetInputAmount?: (formValue?: string) => void
  handleSetInputMax?: () => void

  outputAddress?: string
  outputAddressDisabled?: boolean
  outputAddressOptions: AddressOption[]
  outputFormValue?: string
  handleSetOutputAddress?: (address?: string) => void
  handleSetOutputAmount?: (formValue?: string) => void
  handleSetOutputMax?: () => void

  exchangeRate: { value?: number; fetching?: boolean } // e.g. for mUSD->imUSD
  className?: string
  // TODO: Combine this with outputFormValue, same with decimals
  isFetching?: boolean
  inputDecimals?: number
  outputDecimals?: number
  inputLabel?: string
  outputLabel?: string

  switchTokens?: () => void
}

const Container = styled.div`
  > * {
    margin: 0.5rem 0;
    &:first-child {
      margin-top: 0;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
`

const ExChangeButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 28px;

  > button {
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    padding: 8px;
    width: 36px;
    height: 36px;
    background-color: ${({ theme }) => theme.color.background[1]};
    transition: transform 0.4s ease-in-out;

    :hover {
      transform: rotate(180deg);
    }
  }
`

export const AssetExchange: FC<Props> = ({
  inputAddressOptions,
  outputAddressOptions,
  exchangeRate,
  handleSetInputAddress,
  handleSetInputAmount,
  handleSetInputMax,
  handleSetOutputAddress,
  handleSetOutputAmount,
  handleSetOutputMax,
  inputAddress,
  inputAddressDisabled,
  inputFormValue,
  outputAddress,
  outputAddressDisabled,
  outputFormValue,
  children,
  className,
  isFetching,
  inputDecimals,
  outputDecimals,
  inputLabel,
  outputLabel,
  switchTokens,
}) => {
  const inputToken = useTokenSubscription(inputAddress) ?? inputAddressOptions.find(v => v.address === inputAddress)
  const outputToken = useTokenSubscription(outputAddress) ?? outputAddressOptions.find(v => v.address === outputAddress)
  const isSwapPage = useCheckPath('swap')

  const conversionFormValue = useMemo(() => {
    if (!inputFormValue) return
    const inputValueSimple = BigDecimal.maybeParse(inputFormValue)?.simple
    const exchangeRateSimple = exchangeRate.value
    if (!inputValueSimple || !exchangeRateSimple) return
    const value = inputValueSimple * exchangeRateSimple
    return value.toString()
  }, [exchangeRate.value, inputFormValue])

  return (
    <Container className={className}>
      <AssetInput
        address={inputAddress}
        addressOptions={inputAddressOptions}
        formValue={inputFormValue}
        handleSetAmount={handleSetInputAmount}
        handleSetMax={handleSetInputMax}
        handleSetAddress={handleSetInputAddress}
        addressDisabled={inputAddressDisabled}
        decimals={inputDecimals}
      />
      <ExchangeRate
        exchangeRate={exchangeRate}
        outputToken={outputToken}
        inputToken={inputToken}
        outputLabel={outputLabel}
        inputLabel={inputLabel}
      />
      {isSwapPage ? (
        <ExChangeButtonContainer>
          <Button onClick={switchTokens}>↓↑</Button>
        </ExChangeButtonContainer>
      ) : (
        <Arrow />
      )}
      <AssetInput
        address={outputAddress}
        addressOptions={outputAddressOptions}
        formValue={conversionFormValue ?? outputFormValue}
        amountDisabled={!handleSetOutputAmount}
        handleSetAmount={handleSetOutputAmount}
        handleSetMax={handleSetOutputMax}
        handleSetAddress={handleSetOutputAddress}
        addressDisabled={outputAddressDisabled}
        isFetching={isFetching}
        decimals={outputDecimals}
      />
      {children}
    </Container>
  )
}
