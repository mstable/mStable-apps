import React, { FC, useCallback, useMemo, useState } from 'react'
import { ISavingsContractV2__factory, BoostedSavingsVault__factory } from '@apps/artifacts/typechain'

import { useSigner } from '@apps/base/context/account'
import { usePropose } from '@apps/base/context/transactions'
import { MassetState } from '@apps/data-provider'
import { useTokenSubscription } from '@apps/base/context/tokens'
import { BigDecimal } from '@apps/bigdecimal'
import { AddressOption, Interfaces } from '@apps/types'
import { TransactionManifest } from '@apps/transaction-manifest'
import { useBigDecimalInput } from '@apps/hooks'
import { useSelectedMassetState } from '@apps/masset-hooks'
import { AssetExchange, SendButton } from '@apps/base/components/forms'

import { SaveRoutesOut } from './types'

const formId = 'SaveRedeem'

const titles = {
  [SaveRoutesOut.Withdraw || SaveRoutesOut.WithdrawAndRedeem]: 'Withdraw',
  [SaveRoutesOut.VaultWithdraw || SaveRoutesOut.VaultUnwrap || SaveRoutesOut.VaultUnwrapAndRedeem]: 'Withdraw from Vault',
}

const purposes = {
  [SaveRoutesOut.Withdraw]: {
    past: 'Withdrew from Save',
    present: 'Withdrawing from Save',
  },
  [SaveRoutesOut.VaultWithdraw]: {
    past: 'Withdrew from Save Vault',
    present: 'Withdrawing from Save Vault',
  },
}

export const SaveRedeem: FC = () => {
  const signer = useSigner()
  const propose = usePropose()

  const {
    address: massetAddress,
    token: massetToken,
    bAssets,
    fAssets,
    savingsContracts: {
      v2: {
        latestExchangeRate: { rate: saveExchangeRate } = {},
        address: saveAddress,
        boostedSavingsVault: { address: vaultAddress, account } = {},
        token: saveToken,
      },
    },
  } = useSelectedMassetState() as MassetState

  const inputOptions = useMemo<AddressOption[]>(
    () => [
      { address: saveAddress as string },
      {
        address: vaultAddress as string,
        label: `${saveToken.symbol} Vault`,
        balance: account?.rawBalance,
        custom: true,
        symbol: `v-${saveToken.symbol}`,
      } as AddressOption,
    ],
    [account?.rawBalance, saveAddress, saveToken, vaultAddress],
  )

  const [inputAddress, setInputAddress] = useState<string | undefined>(inputOptions?.[0].address)
  const inputToken = useTokenSubscription(inputAddress)
  const [inputAmount, inputFormValue, setInputFormValue] = useBigDecimalInput()

  const outputOptions = useMemo<AddressOption[]>(() => {
    const outputs = [
      massetToken,
      ...(saveToken ? [saveToken] : []),
      ...Object.values(bAssets).map(b => b.token),
      ...Object.values(fAssets).map(b => b.token),
    ]
    if (inputAddress === saveAddress) return outputs.filter(v => v.address !== saveAddress)
    return outputs
  }, [massetToken, saveToken, bAssets, fAssets, inputAddress, saveAddress])

  const [outputAddress, setOutputAddress] = useState<string | undefined>(outputOptions?.[0].address)

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
      if (outputAddress === massetAddress) return SaveRoutesOut.VaultUnwrap
      return SaveRoutesOut.VaultUnwrapAndRedeem
    }
    return outputAddress === massetAddress ? SaveRoutesOut.Withdraw : SaveRoutesOut.WithdrawAndRedeem
  }, [inputAddress, massetAddress, outputAddress, saveAddress, vaultAddress])

  const error = useMemo<string | undefined>(() => {
    // TODO: - Remove this. Added for testing routes
    return `${SaveRoutesOut[saveRoute]}`

    if (inputAmount && inputToken && inputToken.balance.exact.lt(inputAmount.exact)) {
      return 'Insufficient balance'
    }
  }, [inputToken, inputAmount, saveRoute])

  const exchangeRate = useMemo(() => {
    if (saveRoute === SaveRoutesOut.VaultWithdraw) {
      return { value: BigDecimal.ONE }
    }
    const value = saveExchangeRate ? saveExchangeRate.divPrecisely(BigDecimal.ONE) : undefined
    return {
      value,
      fetching: !value,
    }
  }, [saveExchangeRate, saveRoute])

  const valid = !!(!error && inputAmount && inputAmount.simple > 0)

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
      handleSetInputMax={() => {
        if (inputToken) {
          setInputFormValue(inputToken.balance.string)
        } else if (inputAddress === vaultAddress && account?.rawBalance) {
          setInputFormValue(account.rawBalance.string)
        }
      }}
    >
      <SendButton
        valid={valid}
        title={error ?? titles[saveRoute]}
        handleSend={() => {
          if (!(signer && saveAddress && inputAmount && saveAddress)) return

          const purpose = purposes[saveRoute]

          switch (saveRoute) {
            case SaveRoutesOut.VaultWithdraw:
              if (!vaultAddress) return
              return propose<Interfaces.BoostedSavingsVault, 'withdraw'>(
                new TransactionManifest(
                  BoostedSavingsVault__factory.connect(vaultAddress, signer),
                  'withdraw',
                  [inputAmount.exact],
                  purpose,
                  formId,
                ),
              )
            case SaveRoutesOut.VaultUnwrap:
              // imVault -> mAsset (Vault)
              return {}
            case SaveRoutesOut.VaultUnwrapAndRedeem:
              // imVault -> bAsset / fAsset (Vault)
              return {}
            case SaveRoutesOut.WithdrawAndRedeem:
              // imAsset -> bAsset / fAsset (Unwrapper)
              return {}
            default:
              return propose<Interfaces.SavingsContract, 'redeemCredits'>(
                new TransactionManifest(
                  ISavingsContractV2__factory.connect(saveAddress, signer),
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
