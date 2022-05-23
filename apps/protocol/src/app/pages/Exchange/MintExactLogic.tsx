import { useMemo } from 'react'

import { Masset__factory } from '@apps/artifacts/typechain'
import { ManyToOneAssetExchange, SendButton, useMultiAssetExchangeDispatch, useMultiAssetExchangeState } from '@apps/base/components/forms'
import { useSigner, useWalletAddress } from '@apps/base/context/account'
import { useTokens, useTokensState } from '@apps/base/context/tokens'
import { usePropose } from '@apps/base/context/transactions'
import { BigDecimal } from '@apps/bigdecimal'
import { useMinimumOutput } from '@apps/hooks'
import { useSelectedMassetState } from '@apps/masset-hooks'
import { TransactionManifest } from '@apps/transaction-manifest'
import styled from 'styled-components'

import { Route, useEstimatedOutputMulti } from '../../hooks/useEstimatedOutputMulti'
import { useExchangeRateForMassetInputs } from '../../hooks/useMassetExchangeRate'
import { useScaledInputs } from '../../hooks/useScaledInputs'
import { useSelectedMassetPrice } from '../../hooks/useSelectedMassetPrice'

import type { MassetState } from '@apps/data-provider'
import type { Interfaces } from '@apps/transaction-manifest'
import type { FC } from 'react'

const formId = 'mint'

const Container = styled(ManyToOneAssetExchange)`
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

export const MintExactLogic: FC = () => {
  const propose = usePropose()
  const walletAddress = useWalletAddress()
  const signer = useSigner()
  const tokenState = useTokensState()

  const massetState = useSelectedMassetState() as MassetState
  const { address: massetAddress, bassetRatios } = massetState

  const [inputValues, slippage] = useMultiAssetExchangeState()
  const [inputCallbacks] = useMultiAssetExchangeDispatch()

  const inputTokens = useTokens(Object.keys(inputValues))

  const masset = useMemo(
    () => (massetAddress && signer ? Masset__factory.connect(massetAddress, signer) : undefined),
    [massetAddress, signer],
  )

  const touched = useMemo(() => Object.values(inputValues).filter(v => v.touched), [inputValues])

  const inputAmount = useMemo(() => {
    if (!Object.keys(inputValues).length || !touched.length) return

    return BigDecimal.sum(...Object.values(touched).map(v => v.amount.mulRatioTruncate(bassetRatios[v.address])))
  }, [inputValues, touched, bassetRatios])

  const scaledInputs = useScaledInputs(inputValues, bassetRatios)

  const { estimatedOutputAmount, priceImpact } = useEstimatedOutputMulti(Route.Mint, scaledInputs, undefined, masset)

  const { showImpactWarning } = priceImpact?.value ?? {}

  const exchangeRate = useExchangeRateForMassetInputs(estimatedOutputAmount, inputValues)

  const { minOutputAmount } = useMinimumOutput(slippage?.simple, inputAmount, estimatedOutputAmount.value)

  const setMaxCallbacks = useMemo(
    () =>
      Object.fromEntries(
        inputTokens.map(({ address, balance }) => [
          address,
          () => {
            inputCallbacks[address].setAmount(balance)
          },
        ]),
      ),
    [inputTokens, inputCallbacks],
  )

  const inputLabel = useMemo(
    () =>
      Object.values(inputValues)
        .filter(v => v.touched)
        .map(v => inputTokens.find(t => t.address === v.address)?.symbol)
        .join(', '),
    [inputTokens, inputValues],
  )

  const error = useMemo(() => {
    if (!touched) return 'Enter an amount'

    const addressesBalanceTooLow = Object.keys(inputValues).filter(t =>
      inputValues[t].amount?.exact.gt(tokenState.tokens[t]?.balance?.exact ?? 0),
    )

    if (addressesBalanceTooLow.length)
      return `Insufficient ${addressesBalanceTooLow.map(t => tokenState.tokens[t]?.symbol).join(', ')} balance`

    const addressesApprovalNeeded = Object.keys(inputValues).filter(t =>
      inputValues[t].amount?.exact.gt(tokenState.tokens[t]?.allowances[massetState.address]?.exact ?? 0),
    )

    if (addressesApprovalNeeded.length)
      return `Approval for ${addressesApprovalNeeded.map(t => tokenState.tokens[t]?.symbol).join(', ')} needed`

    if (estimatedOutputAmount.fetching) return 'Validating…'

    return estimatedOutputAmount.error
  }, [inputValues, massetState, estimatedOutputAmount, tokenState, touched])

  const massetPrice = useSelectedMassetPrice()

  const valid = !!(!error && !estimatedOutputAmount.fetching && estimatedOutputAmount.value?.exact.gt(0) && touched.length > 0)

  return (
    <Container
      exchangeRate={exchangeRate}
      inputLabel={inputLabel}
      outputLabel={massetState.token.symbol}
      outputAddress={massetState.address}
      outputAmount={estimatedOutputAmount}
      setMaxCallbacks={setMaxCallbacks}
      spender={massetState.address}
      minOutputAmount={minOutputAmount}
      price={massetPrice.value}
      priceImpact={priceImpact?.value}
    >
      <SendButton
        valid={valid}
        warning={!error && showImpactWarning}
        title={error ?? 'Mint'}
        handleSend={() => {
          if (masset && walletAddress && minOutputAmount) {
            if (touched.length === 1) {
              const [{ address, amount }] = touched
              return propose<Interfaces.Masset, 'mint'>(
                new TransactionManifest(
                  masset,
                  'mint',
                  [address, (amount as BigDecimal).exact, minOutputAmount.exact, walletAddress],
                  { past: 'Minted', present: 'Minting' },
                  formId,
                ),
              )
            }

            const addresses = touched.map(v => v.address)
            const amounts = touched.map(v => (v.amount as BigDecimal).exact)

            return propose<Interfaces.Masset, 'mintMulti'>(
              new TransactionManifest(
                masset,
                'mintMulti',
                [addresses, amounts, minOutputAmount.exact, walletAddress],
                { past: 'Minted', present: 'Minting' },
                formId,
              ),
            )
          }
        }}
      />
    </Container>
  )
}
