import React, { FC, useMemo } from 'react'

import { Masset__factory } from '@apps/artifacts/typechain'
import { usePropose } from '@apps/base/context/transactions'
import { useSigner, useWalletAddress } from '@apps/base/context/account'
import { MassetState } from '@apps/data-provider'
import { useTokens, useTokenSubscription } from '@apps/base/context/tokens'
import { BigDecimal } from '@apps/bigdecimal'
import { TransactionManifest, Interfaces } from '@apps/transaction-manifest'
import { SendButton, OneToManyAssetExchange, useMultiAssetExchangeState } from '@apps/base/components/forms'
import { useMaximumOutput } from '@apps/hooks'
import { useSelectedMassetState } from '@apps/base/hooks'

import { useSelectedMassetPrice } from '../../hooks/useSelectedMassetPrice'
import { Route, useEstimatedOutputMulti } from '../../hooks/useEstimatedOutputMulti'
import { useExchangeRateForMassetInputs } from '../../hooks/useMassetExchangeRate'

const formId = 'RedeemExactBassets'

export const RedeemExactLogic: FC = () => {
  const propose = usePropose()
  const walletAddress = useWalletAddress()
  const signer = useSigner()
  const massetState = useSelectedMassetState() as MassetState
  const { address: massetAddress, bassetRatios } = massetState
  const massetToken = useTokenSubscription(massetState.address)
  const massetBalance = massetToken?.balance

  const [bassetAmounts, slippage] = useMultiAssetExchangeState()

  const outputTokens = useTokens(Object.keys(bassetAmounts))

  const masset = useMemo(() => (signer ? Masset__factory.connect(massetAddress, signer) : undefined), [massetAddress, signer])

  const { estimatedOutputAmount, priceImpact } = useEstimatedOutputMulti(masset, bassetAmounts, undefined, Route.Redeem)

  const { impactWarning } = priceImpact?.value ?? {}

  const exchangeRate = useExchangeRateForMassetInputs(estimatedOutputAmount, bassetAmounts)

  const touched = useMemo(() => Object.values(bassetAmounts).filter(v => v.touched), [bassetAmounts])

  const inputAmount = useMemo(() => {
    if (!Object.keys(bassetAmounts).length || !touched.length) return

    return Object.values(touched).reduce(
      (prev, v) => prev.add((v.amount as BigDecimal).mulRatioTruncate(bassetRatios[v.address])),
      BigDecimal.ZERO,
    )
  }, [bassetAmounts, touched, bassetRatios])

  const { maxOutputAmount } = useMaximumOutput(slippage?.simple, inputAmount, estimatedOutputAmount.value)

  const outputLabel = useMemo(
    () =>
      Object.values(bassetAmounts)
        .filter(v => v.touched)
        .map(v => outputTokens.find(t => t.address === v.address)?.symbol)
        .join(', '),
    [outputTokens, bassetAmounts],
  )

  const error = useMemo(() => {
    if (touched.length === 0) {
      return 'Enter an amount'
    }

    if (estimatedOutputAmount.error) return estimatedOutputAmount.error

    if (massetBalance && maxOutputAmount && maxOutputAmount.exact.gt(massetBalance.exact)) {
      return 'Insufficient balance'
    }

    if (estimatedOutputAmount.fetching) return 'Validating…'

    return estimatedOutputAmount.error
  }, [estimatedOutputAmount, massetBalance, maxOutputAmount, touched])

  const massetPrice = useSelectedMassetPrice()

  const valid = !error && !estimatedOutputAmount.fetching && touched.length > 0

  return (
    <OneToManyAssetExchange
      exchangeRate={exchangeRate}
      inputAddress={massetAddress}
      inputLabel={massetState?.token.symbol}
      outputLabel={outputLabel}
      maxOutputAmount={maxOutputAmount}
      price={massetPrice.value}
      inputAmount={estimatedOutputAmount}
      priceImpact={priceImpact?.value}
    >
      <SendButton
        valid={valid}
        warning={!error && impactWarning}
        title={error ?? 'Redeem'}
        handleSend={() => {
          if (masset && walletAddress && maxOutputAmount) {
            if (!touched.length) return

            const addresses = touched.map(v => v.address)
            const amounts = touched.map(v => (v.amount as BigDecimal).exact)

            return propose<Interfaces.Masset, 'redeemExactBassets'>(
              new TransactionManifest(
                masset,
                'redeemExactBassets',
                [addresses, amounts, maxOutputAmount.exact, walletAddress],
                { past: 'Redeemed', present: 'Redeeming' },
                formId,
              ),
            )
          }
        }}
      />
    </OneToManyAssetExchange>
  )
}
