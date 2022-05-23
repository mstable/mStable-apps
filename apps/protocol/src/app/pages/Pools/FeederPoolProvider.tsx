import { createContext, useContext, useMemo } from 'react'

import { BoostedVault__factory, FeederPool__factory, FeederWrapper__factory } from '@apps/artifacts/typechain'
import { useSigner } from '@apps/base/context/account'
import { useNetworkAddresses } from '@apps/base/context/network'
import { useTokenSubscription } from '@apps/base/context/tokens'
import { useFeederPool, useSelectedMassetState } from '@apps/masset-hooks'

import type { BoostedVault, FeederPool, FeederWrapper } from '@apps/artifacts/typechain'
import type { FeederPoolState, MassetState } from '@apps/data-provider'
import type { UseBigDecimalInputsArg } from '@apps/hooks'
import type { AddressOption } from '@apps/types'
import type { FC } from 'react'

interface PoolState {
  poolAddress: string
  vaultAddress: string
  contracts?: {
    feederPool: FeederPool
    vault: BoostedVault
    feederWrapper: FeederWrapper
  }
}

const ctx = createContext<PoolState>(null as never)

export const useSelectedFeederPoolAddress = (): string => {
  return useContext(ctx).poolAddress
}

export const useSelectedFeederPoolState = (): FeederPoolState => {
  const { poolAddress } = useContext(ctx)
  // Should be mounted below a check for this state
  return useFeederPool(poolAddress) as FeederPoolState
}

export const useSelectedFeederPoolContracts = (): PoolState['contracts'] => useContext(ctx).contracts

export const useSelectedFeederPoolContract = (): FeederPool | undefined => {
  return useContext(ctx)?.contracts?.feederPool
}

export const useSelectedFeederPoolVaultContract = (): BoostedVault | undefined => {
  return useContext(ctx)?.contracts?.vault
}

export const useFPAssetAddressOptions = (includeFpToken?: boolean): AddressOption[] => {
  const { bAssets } = useSelectedMassetState() as MassetState
  const { fasset, masset, token } = useSelectedFeederPoolState()
  return useMemo(
    () => [
      masset.token,
      fasset.token,
      ...Object.values(bAssets).map(b => b.token),
      ...(includeFpToken
        ? [
            {
              ...token,
              custom: true,
              label: `Pool`,
              tip: `${token.symbol} Pool`,
            },
          ]
        : []),
    ],
    [bAssets, fasset.token, includeFpToken, masset.token, token],
  )
}

export const useFPVaultAddressOptions = (): AddressOption[] => {
  const { token, vault } = useSelectedFeederPoolState()
  return useMemo(
    () =>
      [
        {
          custom: true,
          label: `Vault`,
          address: vault?.address,
          symbol: `vault`,
          balance: vault?.account?.rawBalance,
          tip: `${token.symbol} Pool Vault`,
        },
        {
          address: token.address,
          label: `Pool`,
          custom: true,
          symbol: token.symbol,
          balance: token?.balance,
          tip: `${token.symbol} Pool`,
        },
      ].filter(v => !!v.address),
    [vault, token],
  )
}

export const useSelectedFeederPoolAssets = (): UseBigDecimalInputsArg => {
  const feederPool = useSelectedFeederPoolState()
  return useMemo(
    () => Object.fromEntries([feederPool.masset.token, feederPool.fasset.token].map(({ address, decimals }) => [address, { decimals }])),
    [feederPool],
  )
}

export const FeederPoolProvider: FC<{ poolAddress: string }> = ({ poolAddress, children }) => {
  // Should be mounted below a check for this state
  const feederPool = useFeederPool(poolAddress) as FeederPoolState
  const vaultAddress = feederPool.vault?.address

  // Subscribe at provider level so we can rely on the data being there
  // in child components
  useTokenSubscription(poolAddress)
  useTokenSubscription(feederPool.masset.address)
  useTokenSubscription(feederPool.fasset.address)

  const signer = useSigner()
  const networkAddresses = useNetworkAddresses()

  const poolState = useMemo<PoolState>(
    () => ({
      poolAddress,
      vaultAddress,
      contracts:
        signer && networkAddresses
          ? {
              feederPool: FeederPool__factory.connect(poolAddress, signer),
              feederWrapper: FeederWrapper__factory.connect(networkAddresses.FeederWrapper, signer),
              vault: vaultAddress && BoostedVault__factory.connect(vaultAddress, signer),
            }
          : undefined,
    }),
    [poolAddress, vaultAddress, signer, networkAddresses],
  )

  return <ctx.Provider value={poolState}>{children}</ctx.Provider>
}
