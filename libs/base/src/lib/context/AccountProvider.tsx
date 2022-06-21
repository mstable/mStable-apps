/* eslint-disable new-cap */
import { createContext, useContext, useMemo, useState } from 'react'

import { composedComponent } from '@apps/react-utils'
import { createStateContext, useIdle } from 'react-use'
import { useAccount as useWagmiAccount } from 'wagmi'

import type { BaseProvider as Provider } from '@ethersproject/providers'
import type { API, Wallet } from 'bnc-onboard/dist/src/interfaces'
import type { ethers } from 'ethers'
import type { FC } from 'react'

export interface OnboardCtx {
  onboard?: API
  connect: () => void
  reset: () => void
  connected: boolean
  address?: string
  balance?: string
  wallet?: Wallet
  ensName?: string
  ensAvatar?: string
}

interface UserAccountCtx {
  address?: string
  masqueradedAccount?: string
  idle: boolean
}

export interface StakeSignatures {
  [x: string]: string
}

type Masquerade = (account?: string) => void

export const onboardCtx = createContext<OnboardCtx>(null as never)

const [useSignerCtx, SignerProvider] = createStateContext<
  | {
      provider: Provider
      parentChainProvider?: Provider
      signer?: ethers.Signer
    }
  | undefined
>(undefined)

export { useSignerCtx }

const masqueradeCtx = createContext<Masquerade>(null as never)

export const userAccountCtx = createContext<UserAccountCtx>({
  idle: false,
  address: undefined,
  masqueradedAccount: undefined,
})

export const useProvider = (): Provider | undefined => useSignerCtx()[0]?.provider

export const useSigner = (): ethers.Signer | undefined => useSignerCtx()[0]?.signer

export const useSignerOrProvider = (): ethers.Signer | Provider | undefined => {
  const [signerProvider] = useSignerCtx()
  return signerProvider?.signer ?? signerProvider?.provider
}

export const useMasquerade = (): Masquerade => useContext(masqueradeCtx)

export const useUserState = (): UserAccountCtx => useContext(userAccountCtx)

export const useIsIdle = (): UserAccountCtx['idle'] => useUserState().idle

export const useAccount = (): UserAccountCtx['masqueradedAccount'] | UserAccountCtx['address'] => {
  const { address, masqueradedAccount } = useUserState()
  return masqueradedAccount || address
}

export const useOwnAccount = (): UserAccountCtx['address'] => useUserState().address

export const useIsMasquerading = (): boolean => Boolean(useUserState().masqueradedAccount)

const AccountState: FC = ({ children }) => {
  const { data } = useWagmiAccount()
  const idle = useIdle()
  const [masqueradedAccount, masquerade] = useState<UserAccountCtx['masqueradedAccount']>()

  const state = useMemo<UserAccountCtx>(
    () => ({
      address: data?.address,
      idle,
      masqueradedAccount: masqueradedAccount?.toLowerCase(),
    }),
    [data?.address, idle, masqueradedAccount],
  )

  return (
    <masqueradeCtx.Provider value={masquerade}>
      <userAccountCtx.Provider value={state}>{children}</userAccountCtx.Provider>
    </masqueradeCtx.Provider>
  )
}

export const AccountProvider = composedComponent(SignerProvider, AccountState)
