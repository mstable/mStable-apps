import { useMemo, useState } from 'react'

import { ManyToOneAssetExchange, SendButton, useMultiAssetExchangeDispatch, useMultiAssetExchangeState } from '@apps/base/components/forms'
import { useWalletAddress } from '@apps/base/context/account'
import { usePropose } from '@apps/base/context/transactions'
import { useMinimumOutput } from '@apps/hooks'
import { TransactionManifest } from '@apps/transaction-manifest'

import { Route, useEstimatedOutputMulti } from '../../../hooks/useEstimatedOutputMulti'
import { useFPInputRatios } from '../../../hooks/useFPInputRatios'
import { useExchangeRateForFPInputs } from '../../../hooks/useMassetExchangeRate'
import { useScaledInputs } from '../../../hooks/useScaledInputs'
import { useSelectedMassetPrice } from '../../../hooks/useSelectedMassetPrice'
import {
  useFPAssetAddressOptions,
  useFPVaultAddressOptions,
  useSelectedFeederPoolContracts,
  useSelectedFeederPoolState,
} from '../FeederPoolProvider'
import { scaleFassetAmount } from '../utils'

import type { BigDecimal } from '@apps/bigdecimal'
import type { BigDecimalInputValue } from '@apps/hooks'
import type { Interfaces } from '@apps/transaction-manifest'
import type { SubscribedToken } from '@apps/types'
import type { FC } from 'react'

const formId = 'DepositLP'

export const MintExact: FC = () => {
  const feederPool = useSelectedFeederPoolState()
  const contracts = useSelectedFeederPoolContracts()

  const propose = usePropose()
  const walletAddress = useWalletAddress()

  const assetAddressOptions = useFPAssetAddressOptions(true)
  const vaultAddressOptions = useFPVaultAddressOptions()

  const massetPrice = useSelectedMassetPrice()
  const isLowLiquidity = feederPool?.liquidity.simple * (massetPrice.value ?? 0) < 100000

  const [outputAddress, setOutputAddress] = useState<string | undefined>(vaultAddressOptions[0]?.address)

  const [inputValues, slippage] = useMultiAssetExchangeState()
  const [inputCallbacks] = useMultiAssetExchangeDispatch()

  const touched = useMemo(() => Object.values(inputValues).filter(v => v.touched), [inputValues])

  const inputRatios = useFPInputRatios()
  const scaledInputs = useScaledInputs(inputValues, inputRatios)

  const inputAmount = useMemo(() => {
    if (!touched.length) return

    const massetAmount = touched.find(({ address }) => address === feederPool.masset.address)?.amount

    const fassetAmount = touched.find(({ address }) => address === feederPool.fasset.address)?.amount

    const scaledFassetAmount = scaleFassetAmount(fassetAmount, feederPool.fasset.address, inputRatios)

    if (scaledFassetAmount && massetAmount) {
      return scaledFassetAmount.add(massetAmount).setDecimals(18)
    }

    return massetAmount ?? fassetAmount
  }, [feederPool, inputRatios, touched])

  const { estimatedOutputAmount, priceImpact } = useEstimatedOutputMulti(
    Route.Mint,
    scaledInputs,
    { price: feederPool.price, isInput: false },
    contracts?.feederPool,
  )

  const exchangeRate = useExchangeRateForFPInputs(feederPool.address, estimatedOutputAmount, inputValues)

  const { minOutputAmount } = useMinimumOutput(slippage?.simple, inputAmount, estimatedOutputAmount.value)

  const setMaxCallbacks = useMemo(
    () =>
      Object.fromEntries(
        assetAddressOptions.map(({ address, balance }) => [
          address,
          () => {
            inputCallbacks[address].setAmount(balance)
          },
        ]),
      ),
    [assetAddressOptions, inputCallbacks],
  )

  const inputLabel = useMemo(
    () =>
      touched
        .map(
          v =>
            (
              assetAddressOptions.find(t => t.address === v.address) as {
                symbol: string
              }
            ).symbol,
        )
        .join(', '),
    [assetAddressOptions, touched],
  )

  const isMintingAndStakingLP = outputAddress === feederPool.vault?.address

  const contractAddress = isMintingAndStakingLP ? contracts?.feederWrapper.address : contracts?.feederPool.address

  const error = useMemo<string | undefined>(() => {
    if (!touched.length) return 'Enter an amount'
    if (!outputAddress) return 'Select a token'

    const touchedOptions = assetAddressOptions
      .map(opt => ({
        ...opt,
        input: touched.find(t => t.address === opt.address),
      }))
      .filter(opt => opt.input) as (SubscribedToken & {
      input: BigDecimalInputValue
    })[]

    if (isLowLiquidity) {
      const minAssetSimple = (inputAmount?.simple ?? 0) * 0.4

      if (touchedOptions.length !== Object.keys(inputValues).length) return 'Assets must be deposited in pairs'

      const isInRatio = !touched.find(v => scaleFassetAmount(v.amount, v.address, inputRatios)?.simple < minAssetSimple)

      if (!isInRatio) return 'Assets must be deposited at a minimum 40/60 ratio'
    }

    if (!contractAddress || !touchedOptions.every(opt => opt.balance)) {
      return 'Fetching balances…'
    }

    const addressesBalanceTooLow = touchedOptions.filter(opt => opt.input.amount && opt.balance?.exact.lt(opt.input.amount.exact))

    if (addressesBalanceTooLow.length) return `Insufficient ${addressesBalanceTooLow.map(t => t.symbol).join(', ')} balance`

    const addressesApprovalNeeded = touchedOptions.filter(
      opt => opt.input.amount && opt.allowances[contractAddress]?.exact.lt(opt.input.amount.exact),
    )

    if (addressesApprovalNeeded.length) return `Approval for ${addressesApprovalNeeded.map(t => t.symbol).join(', ')} needed`

    if (estimatedOutputAmount.fetching) return 'Validating…'

    return estimatedOutputAmount.error
  }, [
    touched,
    outputAddress,
    assetAddressOptions,
    isLowLiquidity,
    contractAddress,
    estimatedOutputAmount,
    inputAmount,
    inputValues,
    inputRatios,
  ])

  return (
    <ManyToOneAssetExchange
      exchangeRate={exchangeRate}
      inputLabel={inputLabel}
      outputAmount={estimatedOutputAmount}
      outputAddressOptions={vaultAddressOptions}
      outputLabel={feederPool.token.symbol}
      setOutputAddress={setOutputAddress}
      outputAddress={outputAddress}
      setMaxCallbacks={setMaxCallbacks}
      spender={contractAddress}
      minOutputAmount={minOutputAmount}
      priceImpact={priceImpact?.value}
      price={feederPool.price.simple}
    >
      <SendButton
        title={error ?? 'Deposit'}
        warning={!error && priceImpact.value?.showImpactWarning}
        valid={!error}
        handleSend={() => {
          if (!contracts || !walletAddress || !minOutputAmount) return

          if (touched.length === 1) {
            const [{ address, amount }] = touched
            // mint & stake via wrapper
            if (outputAddress !== feederPool.address) {
              return propose<Interfaces.FeederWrapper, 'mintAndStake'>(
                new TransactionManifest(
                  contracts.feederWrapper,
                  'mintAndStake',
                  [feederPool.address, feederPool.vault.address, address, (amount as BigDecimal).exact, minOutputAmount.exact],
                  {
                    past: 'Deposited & Staked',
                    present: 'Depositing & Staking',
                  },
                  formId,
                ),
              )
            }
            // mint
            return propose<Interfaces.FeederPool, 'mint'>(
              new TransactionManifest(
                contracts.feederPool,
                'mint',
                [address, (amount as BigDecimal).exact, minOutputAmount.exact, walletAddress],
                { past: 'Deposited', present: 'Depositing' },
                formId,
              ),
            )
          }

          const addresses = touched.map(v => v.address as string)
          const amounts = touched.map(v => (v.amount as BigDecimal).exact)

          // mint & stake multi
          if (isMintingAndStakingLP) {
            return propose<Interfaces.FeederWrapper, 'mintMultiAndStake'>(
              new TransactionManifest(
                contracts.feederWrapper,
                'mintMultiAndStake',
                [feederPool.address, feederPool.vault.address, addresses, amounts, minOutputAmount.exact],
                { past: 'Deposited & Staked', present: 'Depositing & Staking' },
                formId,
              ),
            )
          }

          // mint multi
          return propose<Interfaces.FeederPool, 'mintMulti'>(
            new TransactionManifest(
              contracts.feederPool,
              'mintMulti',
              [addresses, amounts, minOutputAmount.exact, walletAddress],
              { past: 'Deposited', present: 'Depositing' },
              formId,
            ),
          )
        }}
      />
    </ManyToOneAssetExchange>
  )
}
