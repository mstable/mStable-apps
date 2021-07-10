import React, { FC, useMemo, useState } from 'react'
import styled from 'styled-components'

import { FeederPool__factory, Masset__factory } from '@apps/artifacts/typechain'
import { usePropose } from '@apps/base/context/transactions'
import { useSigner, useWalletAddress } from '@apps/base/context/account'
import { useSelectedMassetState, MassetState } from '@apps/base/context/data'
import { useTokenSubscription } from '@apps/base/context/tokens'

import { useBigDecimalInput, useSlippage, useMinimumOutput, BigDecimalInputValue, useEstimatedOutput } from '@apps/hooks'
import { TransactionManifest, Interfaces } from '@apps/transaction-manifest'

import { AssetInput, SendButton } from '@apps/components/forms'
import { Arrow, ExchangeRate, TransactionInfo } from '@apps/components/core'

const formId = 'redeem'

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

export const RedeemMasset: FC = () => {
  const propose = usePropose()
  const walletAddress = useWalletAddress()
  const signer = useSigner()
  const massetState = useSelectedMassetState() as MassetState
  const { address: massetAddress, bAssets, fAssets, feederPools } = massetState

  const [outputAddress, handleSetAddress] = useState<string | undefined>(Object.keys(bAssets)[0])
  const massetToken = useTokenSubscription(massetAddress)
  const outputToken = useTokenSubscription(outputAddress)

  const [massetAmount, massetFormValue, handleSetMassetFormValue] = useBigDecimalInput('0', massetState.token.decimals)

  const [slippageSimple, slippageFormValue, handleSetSlippage] = useSlippage()

  const currentFeederAddress = Object.keys(feederPools).find(address => feederPools[address].fasset.address === outputAddress)

  const feederOptions = Object.keys(feederPools).map(address => ({
    address: feederPools[address].fasset.address,
  }))

  const masset = useMemo(() => (signer ? Masset__factory.connect(massetAddress, signer) : undefined), [massetAddress, signer])

  const fasset = useMemo(
    () => (signer && currentFeederAddress ? FeederPool__factory.connect(currentFeederAddress, signer) : undefined),
    [currentFeederAddress, signer],
  )

  const { estimatedOutputAmount, exchangeRate, feeRate, priceImpact } = useEstimatedOutput(
    { ...massetToken, amount: massetAmount } as BigDecimalInputValue,
    outputToken as BigDecimalInputValue,
  )

  const { impactWarning } = priceImpact?.value ?? {}

  const addressOptions = useMemo(() => [...Object.keys(bAssets).map(address => ({ address })), ...feederOptions], [bAssets, feederOptions])

  const massetBalance = massetToken?.balance
  const error = useMemo(() => {
    if (!massetAmount?.simple) return 'Enter an amount'

    if (massetAmount) {
      if (!outputAddress) {
        return 'Must select an asset to receive'
      }

      if (massetAmount.exact.eq(0)) {
        return 'Amount must be greater than zero'
      }

      if (estimatedOutputAmount.error) return estimatedOutputAmount.error

      if (massetBalance && massetAmount.exact.gt(massetBalance.exact)) {
        return 'Insufficient balance'
      }
    }

    if (estimatedOutputAmount.fetching) return 'Validating…'

    return estimatedOutputAmount.error
  }, [estimatedOutputAmount.error, estimatedOutputAmount.fetching, massetAmount, massetBalance, outputAddress])

  const { minOutputAmount } = useMinimumOutput(slippageSimple, massetAmount, estimatedOutputAmount.value)

  return (
    <Container>
      <AssetInput
        address={massetAddress}
        addressDisabled
        formValue={massetFormValue}
        handleSetAddress={handleSetAddress}
        handleSetAmount={handleSetMassetFormValue}
        handleSetMax={() => {
          handleSetMassetFormValue(massetToken?.balance.string)
        }}
        decimals={massetState.token.decimals}
      />
      <div>
        <Arrow />
        <ExchangeRate inputToken={massetToken} outputToken={outputToken} exchangeRate={exchangeRate} />
      </div>
      <AssetInput
        address={outputAddress ?? addressOptions[0].address}
        addressOptions={addressOptions}
        amountDisabled
        formValue={estimatedOutputAmount.value?.string}
        handleSetAddress={handleSetAddress}
      />
      <SendButton
        valid={!error}
        title={error ?? 'Redeem'}
        warning={!error && impactWarning}
        handleSend={() => {
          if (masset && walletAddress && massetAmount && outputAddress && minOutputAmount) {
            if (Object.values(fAssets).find(f => f.address === outputAddress) && fasset) {
              return propose<Interfaces.FeederPool, 'swap'>(
                new TransactionManifest(
                  fasset,
                  'swap',
                  [massetAddress, outputAddress, massetAmount.exact, minOutputAmount.exact, walletAddress],
                  { present: 'Swapping', past: 'Swapped' },
                  formId,
                ),
              )
            }

            propose<Interfaces.Masset, 'redeem'>(
              new TransactionManifest(
                masset,
                'redeem',
                [outputAddress, massetAmount.exact, minOutputAmount.exact, walletAddress],
                { past: 'Redeemed', present: 'Redeeming' },
                formId,
              ),
            )
          }
        }}
      />
      <TransactionInfo
        feeAmount={feeRate.value}
        feeLabel="Redemption Fee"
        feeTip="The received amount includes a small redemption fee. Fees are sent to Savers and Liquidity Providers."
        minOutputAmount={minOutputAmount}
        onSetSlippage={handleSetSlippage}
        slippageFormValue={slippageFormValue}
        priceImpact={priceImpact?.value}
      />
    </Container>
  )
}
