import { useMemo, useState } from 'react'

import { AssetExchange, SendButton, TransactionInfo } from '@apps/base/components/forms'
import { useWalletAddress } from '@apps/base/context/account'
import { usePropose } from '@apps/base/context/transactions'
import { useBigDecimalInput, useMinimumOutput, useSlippage } from '@apps/hooks'
import { TransactionManifest } from '@apps/transaction-manifest'

import { useEstimatedOutput } from '../../../hooks/useEstimatedOutput'
import { useSelectedMassetPrice } from '../../../hooks/useSelectedMassetPrice'
import {
  useFPAssetAddressOptions,
  useFPVaultAddressOptions,
  useSelectedFeederPoolContracts,
  useSelectedFeederPoolState,
} from '../FeederPoolProvider'

import type { BigDecimalInputValue } from '@apps/hooks'
import type { Interfaces } from '@apps/transaction-manifest'
import type { AddressOption } from '@apps/types'
import type { FC } from 'react'

const formId = 'RedeemLP'

export const RedeemLP: FC = () => {
  const feederPool = useSelectedFeederPoolState()
  const contracts = useSelectedFeederPoolContracts()
  const propose = usePropose()
  const walletAddress = useWalletAddress()
  const massetPrice = useSelectedMassetPrice()

  const isLowLiquidity = feederPool?.liquidity.simple * (massetPrice.value ?? 0) < 100000

  const vaultAddressOptions = useFPVaultAddressOptions()
  const fassetAddressOptions = useFPAssetAddressOptions(true)

  const hasVaultOption = !!feederPool.vault?.address

  const defaultInputOptions = hasVaultOption
    ? isLowLiquidity
      ? [vaultAddressOptions.find(v => v.address === feederPool.vault?.address) as AddressOption]
      : vaultAddressOptions
    : fassetAddressOptions

  const defaultOutputOptions = hasVaultOption ? fassetAddressOptions : vaultAddressOptions

  const [inputOptions, setInputOptions] = useState<AddressOption[]>(
    hasVaultOption ? defaultInputOptions : defaultOutputOptions.filter(a => a.address === feederPool.address),
  )
  const [outputOptions, setOutputOptions] = useState<AddressOption[]>(
    hasVaultOption
      ? defaultOutputOptions.filter(a => a.address === feederPool.address)
      : defaultInputOptions.filter(a => a.address !== feederPool.address),
  )

  const [inputAddress, setInputAddress] = useState<string | undefined>(feederPool.vault?.address ?? feederPool.address)
  const [outputAddress, setOutputAddress] = useState<string | undefined>(hasVaultOption ? feederPool.address : feederPool.masset.address)

  const [inputAmount, inputFormValue, setInputFormValue] = useBigDecimalInput()

  const handleSetInputAddress = (address: string): void => {
    if (address === feederPool.address) {
      setOutputOptions(defaultOutputOptions.filter(v => v.address !== feederPool.vault?.address || v.address !== feederPool.address))
      setOutputAddress(feederPool.fasset.address)
    } else if (address === feederPool.vault?.address) {
      setOutputOptions(defaultOutputOptions.filter(v => v.address === feederPool.address))
      setOutputAddress(feederPool.address)
    } else {
      setInputOptions(defaultInputOptions)
    }
    setInputAddress(address)
  }

  const handleSetOutputAddress = (address: string): void => {
    if (address === feederPool.address) {
      setInputOptions(defaultInputOptions.filter(v => v.address !== feederPool.vault?.address || v.address !== feederPool.address))
      setOutputOptions(outputOptions.filter(v => v.address === feederPool.address))
      setInputAddress(feederPool.vault?.address)
    } else {
      setOutputAddress(feederPool.address)
    }
    setOutputAddress(address)
  }

  const [slippageSimple, slippageFormValue, setSlippage] = useSlippage()

  // Can't use useTokenSubscription because the input might be e.g. vault
  const inputToken = inputOptions.find(t => t?.address === inputAddress)

  const outputToken = useMemo(() => outputOptions.find(t => t.address === outputAddress), [outputAddress, outputOptions])

  const isUnstakingFromVault = inputAddress === feederPool.vault?.address && outputAddress === feederPool.address

  const shouldSkipEstimation = isUnstakingFromVault

  const { estimatedOutputAmount, exchangeRate, feeRate, priceImpact } = useEstimatedOutput(
    {
      ...inputToken,
      amount: inputAmount,
    } as BigDecimalInputValue,
    {
      ...outputOptions.find(t => t.address === outputAddress),
    } as BigDecimalInputValue,
    { price: feederPool.price, isInput: true },
    shouldSkipEstimation,
  )

  const { showImpactWarning } = priceImpact?.value ?? {}

  const { minOutputAmount } = useMinimumOutput(slippageSimple, inputAmount, estimatedOutputAmount.value)

  const error = useMemo<string | undefined>(() => {
    if (!inputAmount?.simple) return 'Enter an amount'

    if (!outputToken) {
      return 'Must select an asset to receive'
    }

    if (inputAmount.exact.eq(0)) {
      return 'Amount must be greater than zero'
    }

    if (isUnstakingFromVault) return

    if (!estimatedOutputAmount.value?.simple && !estimatedOutputAmount.fetching) return `Not enough ${outputToken?.symbol} in basket`

    if (estimatedOutputAmount.error) return estimatedOutputAmount.error

    if (inputToken?.balance?.exact && inputAmount.exact.gt(inputToken.balance.exact)) {
      return 'Insufficient balance'
    }

    if (estimatedOutputAmount.fetching) return 'Validating…'

    return estimatedOutputAmount.error
  }, [inputAmount, inputToken, outputToken, isUnstakingFromVault, estimatedOutputAmount])

  return (
    <AssetExchange
      inputAddressOptions={inputOptions}
      outputAddressOptions={outputOptions}
      exchangeRate={exchangeRate}
      handleSetInputAmount={setInputFormValue}
      handleSetInputMax={(): void => {
        setInputFormValue(inputToken?.balance?.string)
      }}
      handleSetInputAddress={handleSetInputAddress}
      handleSetOutputAddress={handleSetOutputAddress}
      inputAddress={inputAddress}
      inputFormValue={inputFormValue}
      outputAddress={outputAddress}
      outputFormValue={isUnstakingFromVault ? inputFormValue : estimatedOutputAmount.value?.string}
      isFetching={estimatedOutputAmount.fetching}
    >
      <SendButton
        title={error ?? 'Redeem'}
        warning={!isUnstakingFromVault && !error && showImpactWarning}
        valid={!error}
        handleSend={() => {
          if (!contracts || !walletAddress || !feederPool) return
          if (!outputAddress || !inputAmount) return

          if (isUnstakingFromVault) {
            return propose<Interfaces.BoostedVault, 'withdraw'>(
              new TransactionManifest(
                contracts.vault,
                'withdraw',
                [inputAmount.exact],
                { past: 'Withdrew', present: 'Withdrawing' },
                formId,
              ),
            )
          }

          if (!minOutputAmount) return

          return propose<Interfaces.FeederPool, 'redeem'>(
            new TransactionManifest(
              contracts.feederPool,
              'redeem',
              [outputAddress, inputAmount.exact, minOutputAmount.exact, walletAddress],
              { past: 'Redeemed', present: 'Redeeming' },
              formId,
            ),
          )
        }}
      />
      <TransactionInfo
        feeAmount={feeRate.value}
        feeLabel="Redemption Fee"
        feeTip="The received amount includes a small redemption fee. Fees are sent to Liquidity Providers."
        minOutputAmount={minOutputAmount}
        slippageFormValue={slippageFormValue}
        onSetSlippage={setSlippage}
        priceImpact={priceImpact?.value}
        price={1}
      />
    </AssetExchange>
  )
}
