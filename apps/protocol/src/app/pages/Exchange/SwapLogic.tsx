import { useCallback, useMemo, useState } from 'react'

import { FeederPool__factory, Masset__factory } from '@apps/artifacts/typechain'
import { AssetSwap, SendButton, TransactionInfo } from '@apps/base/components/forms'
import { useSigner, useWalletAddress } from '@apps/base/context/account'
import { useTokenSubscription } from '@apps/base/context/tokens'
import { usePropose } from '@apps/base/context/transactions'
import { ExchangeAction, useBigDecimalInput, useMinimumOutput, useSlippage } from '@apps/hooks'
import { useSelectedMassetState } from '@apps/masset-hooks'
import { TransactionManifest } from '@apps/transaction-manifest'
import styled from 'styled-components'

import { useEstimatedOutput } from '../../hooks/useEstimatedOutput'
import { useSelectedMassetPrice } from '../../hooks/useSelectedMassetPrice'
import { useExchangeState } from '../Save/hooks'
import { SwitchButton } from './SwitchButton'

import type { MassetState } from '@apps/data-provider'
import type { BigDecimalInputValue } from '@apps/hooks'
import type { Interfaces } from '@apps/transaction-manifest'
import type { AddressOption } from '@apps/types'
import type { FC } from 'react'

const formId = 'swap'

const Info = styled(TransactionInfo)`
  margin-top: 0.5rem;
`

export const SwapLogic: FC = () => {
  const massetState = useSelectedMassetState() as MassetState
  const [_, setExchangeState] = useExchangeState()
  const { address: massetAddress, bAssets, fAssets, feederPools } = massetState

  const signer = useSigner()
  const walletAddress = useWalletAddress()
  const propose = usePropose()

  const [slippageSimple, slippageFormValue, setSlippage] = useSlippage()

  const assetsByBalance = useMemo(
    () => Object.values(bAssets).sort((a, b) => (a.balanceInMasset.exact.lt(b.balanceInMasset.exact) ? 1 : -1)),
    [bAssets],
  )

  const [inputAddress, setInputAddress] = useState<string | undefined>(assetsByBalance?.[0]?.address)
  const [outputAddress, setOutputAddress] = useState<string | undefined>(assetsByBalance?.[1]?.address)

  const inputToken = useTokenSubscription(inputAddress)
  const outputToken = useTokenSubscription(outputAddress)
  const inputDecimals = inputToken?.decimals

  const [inputAmount, inputFormValue, setInputAmount] = useBigDecimalInput('0', {
    decimals: inputDecimals,
  })

  const switchTokens = useCallback(() => {
    const inputAddr = inputAddress
    const outputAddr = outputAddress
    setInputAddress(outputAddr)
    setOutputAddress(inputAddr)
    setInputAmount('0.0')
  }, [inputAddress, outputAddress])

  const currentFeederAddress = Object.values(feederPools).find(
    ({ fasset: { address } }) => address === inputAddress || address === outputAddress,
  )?.address

  const bassetOptions = useMemo(() => Object.keys(bAssets).map(address => ({ address })), [bAssets])

  const fassetOptions = Object.values(feederPools).map(fp => ({
    address: fp.fasset.address,
  }))

  const massetContract = useMemo(() => (signer ? Masset__factory.connect(massetAddress, signer) : undefined), [massetAddress, signer])

  const feederPoolContract = useMemo(
    () => (signer && currentFeederAddress ? FeederPool__factory.connect(currentFeederAddress, signer) : undefined),
    [currentFeederAddress, signer],
  )

  const isFassetSwap = useMemo(
    () =>
      !!Object.keys(fAssets)
        .filter(address => fAssets[address].address !== massetAddress)
        .find(address => fAssets[address].address === inputAddress || fAssets[address].address === outputAddress),
    [fAssets, inputAddress, massetAddress, outputAddress],
  )

  const {
    estimatedOutputAmount: swapOutput,
    exchangeRate,
    feeRate,
    priceImpact,
  } = useEstimatedOutput({ ...inputToken, amount: inputAmount } as BigDecimalInputValue, { ...outputToken } as BigDecimalInputValue)

  const { showImpactWarning } = priceImpact?.value ?? {}

  const error = useMemo<string | undefined>(() => {
    if (!inputAmount?.simple) return 'Enter an amount'

    if (inputAmount) {
      if (!inputToken) {
        return 'Select asset to send'
      }

      if (!outputToken) {
        return 'Select asset to receive'
      }

      if (swapOutput.error) return swapOutput.error

      if (inputToken?.balance && inputAmount.exact.gt(inputToken.balance.exact)) {
        return 'Insufficient balance'
      }
    }

    if (swapOutput.fetching) return 'Validating…'

    return swapOutput.error
  }, [inputAmount, swapOutput.fetching, swapOutput.error, inputToken, outputToken])

  const { minOutputAmount } = useMinimumOutput(slippageSimple, inputAmount, swapOutput?.value)

  const approve = useMemo(
    () =>
      inputAddress
        ? {
            spender: isFassetSwap && currentFeederAddress ? currentFeederAddress : massetAddress,
            address: inputAddress,
            amount: inputAmount,
          }
        : undefined,
    [inputAddress, isFassetSwap, currentFeederAddress, massetAddress, inputAmount],
  )

  const massetPrice = useSelectedMassetPrice()

  const valid = !error && !!swapOutput.value

  const fAssetAddress = currentFeederAddress ? fAssets[currentFeederAddress].address : undefined

  const combinedAddressOptions = useMemo<{
    input: AddressOption[]
    output: AddressOption[]
  }>(() => {
    const addressOptions = [{ address: massetAddress }, ...bassetOptions, ...fassetOptions]

    if (!fAssetAddress) return { input: addressOptions, output: addressOptions }

    const input = outputAddress === fAssetAddress ? [{ address: massetAddress }, ...bassetOptions] : addressOptions

    const output = inputAddress === fAssetAddress ? [{ address: massetAddress }, ...bassetOptions] : addressOptions

    return { input, output }
  }, [massetAddress, bassetOptions, fassetOptions, fAssetAddress, outputAddress, inputAddress])

  const isMassetMint = bAssets[inputAddress]?.address && outputAddress === massetAddress
  const isMassetRedeem = bAssets[outputAddress]?.address && inputAddress === massetAddress
  const isBassetSwap = [inputAddress, outputAddress].filter(address => bAssets[address]?.address).length === 2

  const buttonTitle = isMassetMint ? 'Mint' : isMassetRedeem ? 'Redeem' : 'Swap'

  return (
    <AssetSwap
      inputAddressOptions={combinedAddressOptions.input}
      outputAddressOptions={combinedAddressOptions.output}
      exchangeRate={exchangeRate}
      handleSetInputAddress={setInputAddress}
      handleSetInputAmount={setInputAmount}
      handleSetInputMax={(): void => {
        setInputAmount(inputToken?.balance.string)
      }}
      handleSetOutputAddress={setOutputAddress}
      inputAddress={inputAddress}
      inputFormValue={inputFormValue}
      outputAddress={outputAddress ?? combinedAddressOptions.output[0].address}
      outputFormValue={swapOutput.value?.string}
      isFetching={swapOutput?.fetching}
      inputDecimals={inputDecimals}
      switchTokens={switchTokens}
    >
      <SendButton
        valid={valid}
        title={error ?? buttonTitle}
        approve={approve}
        warning={!error && !!showImpactWarning}
        handleSend={() => {
          if (massetContract && walletAddress && inputAmount && minOutputAmount && inputAddress && outputAddress) {
            // mAsset mint
            if (isMassetMint) {
              return propose<Interfaces.Masset, 'mint'>(
                new TransactionManifest(
                  massetContract,
                  'mint',
                  [inputAddress, inputAmount.exact, minOutputAmount.exact, walletAddress],
                  { past: 'Minted', present: 'Minting' },
                  formId,
                ),
              )
            }

            // mAsset redeem
            if (isMassetRedeem) {
              return propose<Interfaces.Masset, 'redeem'>(
                new TransactionManifest(
                  massetContract,
                  'redeem',
                  [outputAddress, inputAmount.exact, minOutputAmount.exact, walletAddress],
                  { past: 'Redeemed', present: 'Redeeming' },
                  formId,
                ),
              )
            }

            // bAsset or fAsset swap
            if (isBassetSwap || isFassetSwap) {
              const contract = isFassetSwap ? feederPoolContract : massetContract
              if (!contract) return

              return propose<Interfaces.Masset | Interfaces.FeederPool, 'swap'>(
                new TransactionManifest(
                  contract,
                  'swap',
                  [inputAddress, outputAddress, inputAmount.exact, minOutputAmount.exact, walletAddress],
                  { present: 'Swapping', past: 'Swapped' },
                  formId,
                ),
              )
            }
          }
        }}
      />
      <Info
        feeAmount={feeRate?.value}
        feeLabel="Swap Fee"
        feeTip="The received amount includes a small swap fee. Swap fees are sent to Savers and Liquidity Providers."
        minOutputAmount={minOutputAmount}
        slippageFormValue={slippageFormValue}
        onSetSlippage={setSlippage}
        price={massetPrice.value}
        priceImpact={priceImpact?.value}
      />
      {isMassetMint && <SwitchButton onClick={() => setExchangeState(ExchangeAction.MultiMint)}>Switch to multi-asset mint</SwitchButton>}
      {isMassetRedeem && (
        <SwitchButton onClick={() => setExchangeState(ExchangeAction.MultiRedeem)}>Switch to multi-asset redemption</SwitchButton>
      )}
    </AssetSwap>
  )
}
