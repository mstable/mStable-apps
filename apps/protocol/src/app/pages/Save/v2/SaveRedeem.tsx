/* eslint-disable new-cap */
import { useCallback, useMemo, useState } from 'react'

import { BoostedVault__factory, ISavingsContractV3__factory } from '@apps/artifacts/typechain'
import { AssetExchange, SendButton } from '@apps/base/components/forms'
import { useSigner, useWalletAddress } from '@apps/base/context/account'
import { useTokenSubscription } from '@apps/base/context/tokens'
import { usePropose } from '@apps/base/context/transactions'
import { BigDecimal } from '@apps/bigdecimal'
import { useBigDecimalInput } from '@apps/hooks'
import { useSelectedMassetState } from '@apps/masset-hooks'
import { TransactionManifest } from '@apps/transaction-manifest'

import { useEstimatedOutput } from '../../../hooks/useEstimatedOutput'
import { useStakingRewards } from '../hooks'
import { SaveRoutesOut } from './types'

import type { MassetState } from '@apps/data-provider'
import type { BigDecimalInputValue } from '@apps/hooks'
import type { Interfaces } from '@apps/transaction-manifest'
import type { AddressOption } from '@apps/types'
import type { FC } from 'react'

const formId = 'SaveRedeem'

const titles = {
  [SaveRoutesOut.Withdraw]: 'Withdraw',
  [SaveRoutesOut.WithdrawAndRedeem]: 'Withdraw',
  [SaveRoutesOut.VaultWithdraw]: 'Withdraw from Vault',
  [SaveRoutesOut.VaultUnwrapAndRedeem]: 'Withdraw from Vault',
}

const purposes = {
  [SaveRoutesOut.Withdraw]: {
    past: 'Withdrew from Save',
    present: 'Withdrawing from Save',
  },
  [SaveRoutesOut.WithdrawAndRedeem]: {
    past: 'Withdrew from Save',
    present: 'Withdrawing from Save',
  },
  [SaveRoutesOut.VaultWithdraw]: {
    past: 'Withdrew from Save Vault',
    present: 'Withdrawing from Save Vault',
  },
  [SaveRoutesOut.VaultUnwrapAndRedeem]: {
    past: 'Withdrew from Save Vault',
    present: 'Withdrawing from Save Vault',
  },
}

const FetchActive = { value: undefined, fetching: true }
const FetchInactive = { value: undefined, fetching: false }
const FetchResolve = (value?: number) => ({ value, fetching: false })

export const SaveRedeem: FC = () => {
  const signer = useSigner()
  const propose = usePropose()
  const stakingRewards = useStakingRewards()
  const userAddress = useWalletAddress()

  const {
    address: massetAddress,
    token: massetToken,
    bAssets,
    fAssets,
    savingsContracts: {
      v2: {
        latestExchangeRate: { rate: saveExchangeRate } = {},
        address: saveAddress,
        boostedSavingsVault,
        boostedSavingsVault: { account } = {},
        token: saveToken,
      },
    },
  } = useSelectedMassetState() as MassetState

  const vaultAddress = boostedSavingsVault?.address ?? stakingRewards?.stakingRewardsContract?.address
  const vaultBalance = account?.rawBalance ?? stakingRewards.stakedBalance ?? BigDecimal.ZERO

  const inputOptions = useMemo<AddressOption[]>(
    () => [
      { address: saveAddress as string },
      {
        address: vaultAddress,
        label: `Vault`,
        balance: vaultBalance,
        custom: true,
        symbol: `v-${saveToken.symbol}`,
      } as AddressOption,
    ],
    [saveAddress, vaultAddress, vaultBalance, saveToken.symbol],
  )

  const [inputAddress, setInputAddress] = useState<string | undefined>(inputOptions?.[1].address)
  const inputToken = useTokenSubscription(inputAddress)
  const [inputAmount, inputFormValue, setInputFormValue] = useBigDecimalInput()

  const outputOptions = useMemo<AddressOption[]>(() => {
    const outputs = [
      massetToken,
      ...(saveToken ? [saveToken] : []),
      ...Object.values(bAssets).map(b => b.token),
      ...Object.values(fAssets).map(b => b.token),
    ]
    if (inputAddress === vaultAddress) return outputs.filter(v => v.address !== massetAddress)
    if (inputAddress === saveAddress) return outputs.filter(v => v.address !== saveAddress)
    return outputs
  }, [inputAddress, vaultAddress, saveAddress, massetAddress, massetToken, saveToken, bAssets, fAssets])

  const [outputAddress, setOutputAddress] = useState<string | undefined>(outputOptions?.[0].address)
  const outputDecimals = outputOptions.find(v => v.address === outputAddress)?.balance?.decimals

  const routerInfo = useMemo(() => {
    const isBassetOut = Object.keys(bAssets).find(v => v === outputAddress)
    if (isBassetOut) {
      return {
        address: massetAddress,
        isBassetOut: true,
      }
    } else {
      const feederAddress = Object.keys(fAssets).find(k => fAssets[k].token.address === outputAddress)
      if (!feederAddress) return
      return {
        address: feederAddress,
        isBassetOut: false,
      }
    }
  }, [bAssets, fAssets, massetAddress, outputAddress])

  const handleSetInputAddress = useCallback(
    (address: string) => {
      if (address === vaultAddress) setOutputAddress(saveAddress)
      if (address === saveAddress) setOutputAddress(massetAddress)
      setInputAddress(address)
    },
    [saveAddress, vaultAddress, massetAddress],
  )

  const handleSetOutputAddress = useCallback((address: string) => setOutputAddress(address), [])

  const saveRoute = useMemo(() => {
    if (inputAddress === vaultAddress) {
      if (outputAddress === saveAddress) return SaveRoutesOut.VaultWithdraw
      return SaveRoutesOut.VaultUnwrapAndRedeem
    }
    return outputAddress === massetAddress ? SaveRoutesOut.Withdraw : SaveRoutesOut.WithdrawAndRedeem
  }, [inputAddress, massetAddress, outputAddress, saveAddress, vaultAddress])

  const error = useMemo<string | undefined>(() => {
    if (!inputAmount?.simple) return
    if (inputAddress === vaultAddress && vaultBalance?.exact.lt(inputAmount.exact)) return 'Insufficient balance'
    if (inputAddress === saveAddress && inputToken?.balance?.exact.lt(inputAmount.exact)) return 'Insufficient balance'
  }, [inputAddress, inputAmount, inputToken, saveAddress, vaultAddress, vaultBalance])

  const isOutputMasset = outputAddress === massetAddress

  // Input as masset to calc swap exchange rate
  const { exchangeRate: swapExchangeRate, estimatedOutputAmount } = useEstimatedOutput(
    {
      address: massetAddress,
      amount: inputAmount,
    } as BigDecimalInputValue,
    !isOutputMasset
      ? ({
          address: outputAddress,
          decimals: outputDecimals,
        } as BigDecimalInputValue)
      : undefined,
    undefined,
    isOutputMasset,
  )

  const exchangeRate = useMemo(() => {
    if (!signer || !inputFormValue) return FetchInactive

    if (saveRoute === SaveRoutesOut.VaultWithdraw) return FetchResolve(1)

    const saveRateSimple = saveExchangeRate?.simple
    const swapRateSimple = swapExchangeRate?.value

    if (!saveRateSimple) return FetchActive

    if (saveRoute === SaveRoutesOut.Withdraw) return FetchResolve(saveRateSimple / 1)

    if (!swapRateSimple) return FetchActive

    // WithdrawAndRedeem || VaultUnwrapAndRedeem
    return FetchResolve(swapRateSimple * saveRateSimple)
  }, [signer, saveRoute, saveExchangeRate, inputFormValue, swapExchangeRate.value])

  const valid = !error && inputAmount?.simple > 0 && !exchangeRate?.fetching

  return (
    <AssetExchange
      inputAddressOptions={inputOptions}
      outputAddressOptions={outputOptions}
      inputAddress={inputAddress}
      inputFormValue={inputFormValue}
      outputAddress={outputAddress}
      exchangeRate={exchangeRate}
      handleSetInputAddress={handleSetInputAddress}
      handleSetOutputAddress={handleSetOutputAddress}
      handleSetInputAmount={setInputFormValue}
      isFetching={exchangeRate?.fetching}
      handleSetInputMax={() => {
        if (inputToken) {
          setInputFormValue(inputToken.balance.string)
        } else if (inputAddress === vaultAddress) {
          setInputFormValue(vaultBalance?.string)
        }
      }}
    >
      <SendButton
        valid={valid}
        title={error ?? titles[saveRoute]}
        handleSend={() => {
          if (!(signer && saveAddress && inputAmount && saveAddress)) return

          const purpose = purposes[saveRoute]

          // TODO: - Replace hardcoded 0.2% slippage
          const simpleOutput = (estimatedOutputAmount?.value?.simple ?? 0) * (saveExchangeRate?.simple ?? 0)
          const simpleMinOutput = simpleOutput * 0.998
          const minOutputAmount = BigDecimal.fromSimple(simpleMinOutput, outputDecimals)

          switch (saveRoute) {
            case SaveRoutesOut.VaultWithdraw:
              // imVault -> imAsset (Vault)
              if (!vaultAddress) return

              return propose<Interfaces.BoostedVault, 'withdraw'>(
                new TransactionManifest(
                  BoostedVault__factory.connect(vaultAddress, signer),
                  'withdraw',
                  [inputAmount.exact],
                  purpose,
                  formId,
                ),
              )
            case SaveRoutesOut.VaultUnwrapAndRedeem: {
              // imVault -> bAsset / fAsset (Vault)
              if (!routerInfo || !minOutputAmount) return

              return propose<Interfaces.BoostedVault, 'withdrawAndUnwrap'>(
                new TransactionManifest(
                  BoostedVault__factory.connect(vaultAddress, signer),
                  'withdrawAndUnwrap',
                  [inputAmount.exact, minOutputAmount.exact, outputAddress, userAddress, routerInfo.address, routerInfo.isBassetOut],
                  purpose,
                  formId,
                ),
              )
            }
            case SaveRoutesOut.WithdrawAndRedeem: {
              // imAsset -> bAsset / fAsset (Unwrapper)
              if (!routerInfo || !minOutputAmount) return

              return propose<Interfaces.SavingsContract, 'redeemAndUnwrap'>(
                new TransactionManifest(
                  ISavingsContractV3__factory.connect(saveAddress, signer),
                  'redeemAndUnwrap',
                  [inputAmount.exact, true, minOutputAmount.exact, outputAddress, userAddress, routerInfo.address, routerInfo.isBassetOut],
                  purpose,
                  formId,
                ),
              )
            }
            default:
              // imAsset -> mAsset (Save)
              return propose<Interfaces.SavingsContract, 'redeemCredits'>(
                new TransactionManifest(
                  ISavingsContractV3__factory.connect(saveAddress, signer),
                  'redeemCredits',
                  [inputAmount.exact],
                  purpose,
                  formId,
                ),
              )
          }
        }}
      />
    </AssetExchange>
  )
}
