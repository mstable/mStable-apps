import { useCallback, useMemo } from 'react'

import { OneToManyAssetExchange, SendButton, useMultiAssetExchangeDispatch, useMultiAssetExchangeState } from '@apps/base/components/forms'
import { useWalletAddress } from '@apps/base/context/account'
import { usePropose } from '@apps/base/context/transactions'
import { BigDecimal } from '@apps/bigdecimal'
import { useMaximumOutput } from '@apps/hooks'
import { TransactionManifest } from '@apps/transaction-manifest'
import { useToggle } from 'react-use'

import { Route, useEstimatedOutputMulti } from '../../../hooks/useEstimatedOutputMulti'
import { useFPInputRatios } from '../../../hooks/useFPInputRatios'
import { useExchangeRateForFPInputs } from '../../../hooks/useMassetExchangeRate'
import { useScaledInputs } from '../../../hooks/useScaledInputs'
import { useSelectedFeederPoolContract, useSelectedFeederPoolState } from '../FeederPoolProvider'
import { scaleFassetAmount } from '../utils'

import type { Interfaces } from '@apps/transaction-manifest'
import type { AddressOption } from '@apps/types'
import type { FC } from 'react'

const formId = 'RedeemExact'

export type RedeemExactProps = {
  isLowLiquidity?: boolean
}

export const RedeemExact: FC<RedeemExactProps> = ({ isLowLiquidity }) => {
  const [redeemMax, setRedeemMax] = useToggle(false)
  const feederPool = useSelectedFeederPoolState()
  const contract = useSelectedFeederPoolContract()
  const propose = usePropose()
  const walletAddress = useWalletAddress()
  const outputTokens = useMemo(() => [feederPool.masset.token, feederPool.fasset.token], [feederPool])

  const [inputValues, slippage] = useMultiAssetExchangeState()
  const [callbacks] = useMultiAssetExchangeDispatch()

  const touched = useMemo(() => Object.values(inputValues).filter(v => v.touched), [inputValues])

  const inputRatios = useFPInputRatios()

  const scaledInputs = useScaledInputs(inputValues, inputRatios)

  const { estimatedOutputAmount, priceImpact } = useEstimatedOutputMulti(
    Route.Redeem,
    scaledInputs,
    { price: feederPool.price, isInput: false },
    contract,
  )

  const exchangeRate = useExchangeRateForFPInputs(feederPool.address, estimatedOutputAmount, inputValues)

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

  const { maxOutputAmount } = useMaximumOutput(slippage.simple, inputAmount, estimatedOutputAmount.value)

  const outputOption = feederPool.token as AddressOption

  const outputLabel = useMemo(
    () =>
      touched
        .map(
          v =>
            (
              outputTokens.find(t => t.address === v.address) as {
                symbol: string
              }
            ).symbol,
        )
        .join(', '),
    [touched, outputTokens],
  )

  const error = useMemo<string | undefined>(() => {
    if (!touched.length) return 'Enter an amount'

    if (isLowLiquidity) {
      // const minAssetSimple = (inputAmount?.simple ?? 0) * 0.4

      if (touched.length !== Object.keys(inputValues).length) return 'Assets must be withdrawn in pairs'

      // const isInRatio = !touched.find(v => scaleFassetAmount(v.amount, v.address, inputRatios)?.simple < minAssetSimple)

      // if (!isInRatio) return 'Assets must be withdrawn at a minimum 40/60 ratio'
    }

    if (estimatedOutputAmount.error) return estimatedOutputAmount.error

    if (feederPool.token.balance.exact && estimatedOutputAmount.value?.exact.gt(feederPool.token.balance.exact)) {
      return 'Insufficient balance'
    }

    if (estimatedOutputAmount.fetching) return 'Validating…'

    return estimatedOutputAmount.error
  }, [
    touched.length,
    isLowLiquidity,
    estimatedOutputAmount?.error,
    estimatedOutputAmount.value?.exact,
    estimatedOutputAmount?.fetching,
    feederPool.token.balance.exact,
    inputValues,
  ])

  const topInputAmount = useMemo(
    () =>
      redeemMax
        ? { value: new BigDecimal(outputOption?.balance?.exact, outputOption?.['decimals']), fetching: false }
        : estimatedOutputAmount,
    [estimatedOutputAmount, outputOption, redeemMax],
  )

  const handleMax = useCallback(async () => {
    setRedeemMax(true)
    const sim = await contract.callStatic.redeemProportionately(
      new BigDecimal(outputOption?.balance?.exact, outputOption?.['decimals']).exact,
      [0, 0],
      walletAddress,
    )
    if (sim && sim.length) {
      sim.forEach((s, i) => {
        if (i === 0) {
          callbacks[feederPool.masset.address].setAmount(new BigDecimal(s, feederPool.masset.token.decimals))
        }
        if (i === 1) {
          callbacks[feederPool.fasset.address].setAmount(new BigDecimal(s, feederPool.fasset.token.decimals))
        }
      })
    }
  }, [
    callbacks,
    contract.callStatic,
    feederPool.fasset.address,
    feederPool.fasset.token.decimals,
    feederPool.masset.address,
    feederPool.masset.token.decimals,
    outputOption,
    setRedeemMax,
    walletAddress,
  ])

  return (
    <OneToManyAssetExchange
      exchangeRate={exchangeRate}
      inputAddress={outputOption?.address as string}
      inputLabel={outputOption?.symbol}
      inputAmount={topInputAmount}
      outputLabel={outputLabel}
      maxOutputAmount={maxOutputAmount}
      priceImpact={priceImpact?.value}
      price={feederPool.price.simple}
      setMaxCallbacks={{
        [outputOption?.address]: handleMax,
      }}
    >
      <SendButton
        title={error ?? 'Redeem'}
        warning={!error && priceImpact.value?.showImpactWarning}
        valid={!error}
        handleSend={() => {
          if (!contract || !walletAddress || !maxOutputAmount) return

          const addresses = touched.map(v => v.address)
          const amounts = touched.map(v => (v.amount as BigDecimal).exact)

          if (isLowLiquidity) {
            return propose<Interfaces.FeederPool, 'redeemProportionately'>(
              new TransactionManifest(
                contract,
                'redeemProportionately',
                [
                  new BigDecimal(outputOption?.balance?.exact, outputOption?.['decimals']).exact,
                  touched.map(a => BigDecimal.fromSimple(a.amount.simple * (1 - slippage.simple), a.decimals).exact),
                  walletAddress,
                ],
                { past: 'Redeemed', present: 'Redeeming' },
                formId,
              ),
            )
          }

          return propose<Interfaces.FeederPool, 'redeemExactBassets'>(
            new TransactionManifest(
              contract,
              'redeemExactBassets',
              [addresses, amounts, maxOutputAmount.exact, walletAddress],
              { past: 'Redeemed', present: 'Redeeming' },
              formId,
            ),
          )
        }}
      />
    </OneToManyAssetExchange>
  )
}
