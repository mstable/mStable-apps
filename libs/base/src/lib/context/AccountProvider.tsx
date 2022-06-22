/* eslint-disable new-cap */
import { createContext, useContext, useMemo, useState } from 'react'

import { composedComponent } from '@apps/react-utils'
import { useIdle } from 'react-use'
import { useAccount as useWagmiAccount, useProvider as useWagmiProvider, useSigner as useWagmiSigner } from 'wagmi'

import type { FC } from 'react'

interface UserAccountCtx {
  address?: string
  masqueradedAccount?: string
  idle: boolean
}

export interface StakeSignatures {
  [x: string]: string
}

type Masquerade = (account?: string) => void

// const [useSignerCtx, SignerProvider] = createStateContext<
//   | {
//       provider: Provider
//       parentChainProvider?: Provider
//       signer?: ethers.Signer
//     }
//   | undefined
// >(undefined)

// export { useSignerCtx }

const masqueradeCtx = createContext<Masquerade>(null as never)

export const userAccountCtx = createContext<UserAccountCtx>({
  idle: false,
  address: undefined,
  masqueradedAccount: undefined,
})

export const useProvider = () => useWagmiProvider()

export const useSigner = () => {
  const { data } = useWagmiSigner()

  return data
}

export const useSignerOrProvider = () => {
  const { data } = useWagmiSigner()

  return data
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

export const AccountProvider = composedComponent(AccountState)
