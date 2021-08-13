import React, { createContext, FC, useContext, useMemo } from 'react'
import styled from 'styled-components'

import { BigDecimal } from '@apps/bigdecimal'
import {
  FetchState,
  useSlippage,
  useBigDecimalInputs,
  UseBigDecimalInputsArg,
  BigDecimalInputCallbacks,
  BigDecimalInputValues,
} from '@apps/hooks'

import { Arrow, ExchangeRate, TransactionInfo } from '@apps/components/core'
import { AssetInput } from '@apps/components/forms'

import { AddressOption } from '@apps/types'
import { PriceImpact } from '@apps/quick-maths'

type Dispatch = [
  BigDecimalInputCallbacks, // input callbacks
  (slippage?: string) => void, // set slippage
]

type State = [
  BigDecimalInputValues, // input values
  { simple?: number; formValue?: string }, // slippage
]

const dispatchCtx = createContext<Dispatch>(null as never)
const stateCtx = createContext<State>(null as never)

export const useMultiAssetExchangeDispatch = (): Dispatch => useContext(dispatchCtx)

export const useMultiAssetExchangeState = (): State => useContext(stateCtx)

export const MultiAssetExchangeProvider: FC<{
  assets: UseBigDecimalInputsArg
}> = ({ children, assets }) => {
  const [values, callbacks] = useBigDecimalInputs(assets)
  const [slippageSimple, slippageFormValue, setSlippage] = useSlippage()

  const dispatch = useMemo<Dispatch>(() => [callbacks, setSlippage], [callbacks, setSlippage])

  const state = useMemo<State>(
    () => [values, { simple: slippageSimple, formValue: slippageFormValue }],
    [values, slippageFormValue, slippageSimple],
  )

  return (
    <dispatchCtx.Provider value={dispatch}>
      <stateCtx.Provider value={state}>{children}</stateCtx.Provider>
    </dispatchCtx.Provider>
  )
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

interface Props {
  className?: string
  inputLabel?: string
  outputLabel?: string
  spender?: string
  setMaxCallbacks?: { [address: string]: () => void }
  exchangeRate: { value?: BigDecimal; fetching?: boolean }
  price?: number
  priceImpact?: PriceImpact
}

// TODO: I think the provider logic of MultiAssetExchange could be dropped.
// ^ It's not being taken advantage of (see repeating slippage examples)

export const ManyToOneAssetExchange: FC<
  Props & {
    outputAddress?: string
    outputAddressOptions?: AddressOption[]
    setOutputAddress?(address?: string): void
    minOutputAmount?: BigDecimal
    outputAmount?: FetchState<BigDecimal>
  }
> = ({
  className,
  children,
  exchangeRate,
  spender,
  setMaxCallbacks,
  setOutputAddress,
  inputLabel = 'Input',
  outputLabel = 'Output',
  outputAddressOptions,
  outputAddress,
  minOutputAmount,
  outputAmount,
  price,
  priceImpact,
}) => {
  const [inputValues, slippage] = useContext(stateCtx)
  const [inputCallbacks, setSlippage] = useContext(dispatchCtx)
  return (
    <Container className={className}>
      {Object.keys(inputValues).map(
        address =>
          inputValues && (
            <AssetInput
              key={address}
              address={address}
              addressDisabled
              formValue={inputValues[address].formValue}
              handleSetAmount={inputCallbacks[address].setFormValue}
              handleSetMax={setMaxCallbacks?.[address]}
              spender={spender}
              decimals={inputValues[address].decimals}
            />
          ),
      )}
      <Arrow />
      <ExchangeRate inputLabel={inputLabel} outputLabel={outputLabel} exchangeRate={exchangeRate} />
      <AssetInput
        amountDisabled
        address={outputAddress}
        addressOptions={outputAddressOptions}
        handleSetAddress={setOutputAddress}
        formValue={outputAmount?.value?.string}
        isFetching={exchangeRate.fetching}
      />
      {children}
      <TransactionInfo
        price={price}
        onSetSlippage={setSlippage}
        slippageFormValue={slippage.formValue}
        minOutputAmount={minOutputAmount}
        priceImpact={priceImpact}
      />
    </Container>
  )
}

export const OneToManyAssetExchange: FC<
  Props & {
    inputAddress?: string
    inputAddressOptions?: AddressOption[]
    setInputAddress?(address?: string): void
    maxOutputAmount?: BigDecimal
    inputAmount?: FetchState<BigDecimal>
  }
> = ({
  children,
  exchangeRate,
  spender,
  setMaxCallbacks,
  inputAddress,
  inputAddressOptions,
  setInputAddress,
  inputLabel = 'Input',
  outputLabel = 'Output',
  maxOutputAmount,
  inputAmount,
  price,
  priceImpact,
}) => {
  const [outputValues, slippage] = useContext(stateCtx)
  const [outputCallbacks, setSlippage] = useContext(dispatchCtx)

  return (
    <Container>
      <AssetInput
        addressOptions={inputAddressOptions}
        address={inputAddress}
        formValue={inputAmount?.value?.string}
        amountDisabled
        isFetching={exchangeRate.fetching}
        handleSetAddress={setInputAddress}
      />
      <div>
        <Arrow />
        <ExchangeRate inputLabel={inputLabel} outputLabel={outputLabel} exchangeRate={exchangeRate} />
      </div>
      {Object.keys(outputValues).map(address => (
        <AssetInput
          key={address}
          address={address}
          addressDisabled
          formValue={outputValues[address].formValue}
          handleSetAmount={outputCallbacks[address].setFormValue}
          handleSetMax={setMaxCallbacks?.[address]}
          spender={spender}
          decimals={outputValues[address].decimals}
        />
      ))}
      {children}
      <TransactionInfo
        price={price}
        onSetSlippage={setSlippage}
        slippageFormValue={slippage.formValue}
        maxOutputAmount={maxOutputAmount}
        priceImpact={priceImpact}
      />
    </Container>
  )
}
