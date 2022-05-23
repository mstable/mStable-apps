import { useMemo } from 'react'

import { Masset__factory } from '@apps/artifacts/typechain'
import { OneToManyAssetExchange, SendButton, useMultiAssetExchangeState } from '@apps/base/components/forms'
import { useSigner, useWalletAddress } from '@apps/base/context/account'
import { useTokens, useTokenSubscription } from '@apps/base/context/tokens'
import { usePropose } from '@apps/base/context/transactions'
import { BigDecimal } from '@apps/bigdecimal'
import { useMaximumOutput } from '@apps/hooks'
import { useSelectedMassetState } from '@apps/masset-hooks'
import { TransactionManifest } from '@apps/transaction-manifest'

import { Route, useEstimatedOutputMulti } from '../../hooks/useEstimatedOutputMulti'
import { useExchangeRateForMassetInputs } from '../../hooks/useMassetExchangeRate'
import { useScaledInputs } from '../../hooks/useScaledInputs'
import { useSelectedMassetPrice } from '../../hooks/useSelectedMassetPrice'

import type { MassetState } from '@apps/data-provider'
import type { Interfaces } from '@apps/transaction-manifest'
import type { FC } from 'react'

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

  const scaledInputs = useScaledInputs(bassetAmounts, bassetRatios)

  const { estimatedOutputAmount, priceImpact } = useEstimatedOutputMulti(Route.Redeem, scaledInputs, undefined, masset)

  const { showImpactWarning } = priceImpact.value ?? {}

  const exchangeRate = useExchangeRateForMassetInputs(estimatedOutputAmount, bassetAmounts)

  const touched = useMemo(() => Object.values(bassetAmounts).filter(v => v.touched), [bassetAmounts])

  const inputAmount = useMemo(() => {
    if (!Object.keys(bassetAmounts).length || !touched.length) return

    return BigDecimal.sum(...Object.values(touched).map(v => v.amount.mulRatioTruncate(bassetRatios[v.address])))
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
        warning={!error && showImpactWarning}
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
