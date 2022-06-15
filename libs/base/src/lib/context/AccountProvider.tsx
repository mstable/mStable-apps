/* eslint-disable new-cap */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import { composedComponent } from '@apps/react-utils'
import { APP_NAME } from '@apps/types'
import Onboard from 'bnc-onboard'
import { ethers, utils } from 'ethers'
import { createStateContext, useEffectOnce, useIdle } from 'react-use'

import { useBaseCtx } from '../BaseProviders'
import { useStakeSignatures } from '../hooks'
import { API_ENDPOINT } from '../utils'
import { NETWORKS, useChainIdCtx, useJsonRpcProviders, useNetwork } from './NetworkProvider'
import { ChainIds } from './NetworkProvider'

import type { BaseProvider as Provider, Web3Provider as EthersWeb3Provider } from '@ethersproject/providers'
import type { API, Wallet } from 'bnc-onboard/dist/src/interfaces'
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

export const useWallet = (): OnboardCtx['wallet'] => useContext(onboardCtx).wallet

export const useProvider = (): Provider | undefined => useSignerCtx()[0]?.provider

export const useWalletAddress = (): OnboardCtx['address'] => useContext(onboardCtx)?.address

export const useEnsName = (): OnboardCtx['ensName'] => useContext(onboardCtx)?.ensName

export const useEnsAvatar = (): OnboardCtx['ensAvatar'] => useContext(onboardCtx)?.ensAvatar

export const useConnect = (): OnboardCtx['connect'] => useContext(onboardCtx).connect

export const useSigner = (): ethers.Signer | undefined => useSignerCtx()[0]?.signer

export const useConnected = (): OnboardCtx['connected'] => useContext(onboardCtx).connected

export const useReset = (): OnboardCtx['reset'] => useContext(onboardCtx).reset

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

const [useInjectedChainIdCtx, InjectedChainIdProvider] = createStateContext<number | undefined>(undefined)
const [useInjectedProviderCtx, InjectedProviderProvider] = createStateContext<EthersWeb3Provider | undefined>(undefined)
export { useInjectedChainIdCtx, useInjectedProviderCtx }

const OnboardProvider: FC<{
  chainId: ChainIds
}> = ({ children, chainId }) => {
  const [address, setAddress] = useState<string | undefined>(undefined)
  const [ensName, setEnsName] = useState<string | undefined>(undefined)
  const [ensAvatar, setEnsAvatar] = useState<string | undefined>(undefined)
  const [balance, setBalance] = useState<string | undefined>(undefined)
  const [connected, setConnected] = useState<boolean>(false)
  const [wallet, setWallet] = useState<Wallet | undefined>(undefined)
  const [, setStakeSignatures] = useStakeSignatures()
  const [{ appName }] = useBaseCtx()

  const [, setChainId] = useChainIdCtx()
  const [injectedChainId, setInjectedChainId] = useInjectedChainIdCtx()
  const [injectedProvider, setInjectedProvider] = useInjectedProviderCtx()

  const network = useNetwork()
  const rpcUrl = network.rpcEndpoints[0]

  const isGovernance = appName === APP_NAME.GOVERNANCE

  const onboard = useMemo(
    () =>
      Onboard({
        hideBranding: true,
        networkId: parseInt(isNaN(chainId) ? '1' : (chainId as unknown as string)),
        subscriptions: {
          address: account => {
            if (account) {
              setAddress(account.toLowerCase())
            }
          },
          ens: ens => {
            setEnsName(ens?.name)
          },
          network: setInjectedChainId,
          balance: setBalance,
          wallet: walletInstance => {
            if (!walletInstance.provider) {
              setWallet(undefined)
              setInjectedProvider(undefined)
              setConnected(false)
              setAddress(undefined)
              setEnsName(undefined)
              setEnsAvatar(undefined)
              return
            }

            setWallet(walletInstance)
            const ethersProvider = new ethers.providers.Web3Provider(walletInstance.provider, 'any')
            setInjectedProvider(ethersProvider as never)
            setConnected(true)

            if (walletInstance.name) {
              localStorage.setItem('walletName', walletInstance.name)
            } else {
              localStorage.removeItem('walletName')
            }
          },
        },
        walletSelect: {
          agreement: {
            version: '0.1.0',
            termsUrl: 'https://docs.mstable.org/advanced/app-usage-terms-and-conditions',
          },
          wallets: [
            {
              walletName: 'metamask',
              preferred: true,
            },
            {
              walletName: 'walletConnect',
              rpc: {
                [chainId]: rpcUrl,
              },
              preferred: true,
            },
            {
              walletName: 'ledger',
              rpcUrl,
              preferred: true,
            },
            {
              walletName: 'trezor',
              appUrl: window.location.hostname,
              email: 'info@mstable.org',
              rpcUrl,
              preferred: true,
            },
            { walletName: 'tally' },
            { walletName: 'xdefi' },
            { walletName: 'trust', rpcUrl },
            { walletName: 'gnosis', preferred: true },
            {
              walletName: 'lattice',
              rpcUrl,
              appName: 'mStable',
            },
            {
              walletName: 'fortmatic',
              apiKey: 'pk_live_262AEBF77922D028',
            },
            {
              walletName: 'portis',
              apiKey: 'bd88165a-43d7-481f-91bb-7e2f21e95ce6',
            },
            { walletName: 'authereum' },
            { walletName: 'opera' },
            { walletName: 'operaTouch' },
            { walletName: 'torus' },
            { walletName: 'status' },
            { walletName: 'walletLink', rpcUrl, appName: 'mStable', preferred: true },
            { walletName: 'coinbase', rpcUrl, appName: 'mStable', preferred: true },
            { walletName: 'imToken', rpcUrl },
            { walletName: 'meetone' },
            { walletName: 'mykey', rpcUrl },
            { walletName: 'huobiwallet', rpcUrl },
            { walletName: 'hyperpay' },
            { walletName: 'wallet.io', rpcUrl },
          ],
        },

        walletCheck: [{ checkName: 'derivationPath' }, { checkName: 'connect' }, { checkName: 'accounts' }, { checkName: 'network' }],
      }),
    [chainId, rpcUrl, setInjectedChainId, setInjectedProvider],
  )

  const connect = useCallback(
    async (walletName?: string) => {
      try {
        const selected = await onboard.walletSelect(walletName)
        if (selected) {
          const checked = await onboard.walletCheck()
          if (!checked) {
            localStorage.removeItem('walletName')
            onboard.walletReset()
            setConnected(false)
            setWallet(undefined)
            setInjectedProvider(undefined)
            return
          }
          setConnected(true)
          if (walletName) localStorage.setItem('walletName', walletName)
          return
        }
      } catch (error) {
        console.error(error)
      }
    },
    [onboard, setInjectedProvider],
  )

  const reset = useCallback(() => {
    onboard.walletReset()
    localStorage.removeItem('walletName')
    setWallet(undefined)
    setConnected(false)
    setInjectedProvider(undefined)
  }, [onboard, setInjectedProvider])

  useEffect(() => {
    const check = async () => {
      if (connected && injectedChainId !== chainId) {
        if (NETWORKS.map(net => net.chainId).includes(injectedChainId as ChainIds)) {
          setChainId(injectedChainId)
        } else {
          try {
            const check = await onboard.walletCheck()
            if (!check) {
              reset()
            }
          } catch (error) {
            console.error(error)
            reset()
          }
        }
      }
    }
    check()
  }, [chainId, connected, injectedChainId, onboard, reset, setChainId])

  useEffectOnce(() => {
    const reconnect = async () => {
      const previouslySelectedWallet = localStorage.getItem('walletName')
      if (previouslySelectedWallet) {
        const select = await onboard.walletSelect(previouslySelectedWallet)
        if (select) {
          try {
            await connect(previouslySelectedWallet)
          } catch (error) {
            console.error(error)
          }
        }
      }
    }
    reconnect()
  })

  useEffectOnce(() => {
    if (isGovernance) {
      fetch(`${API_ENDPOINT}/signature`)
        .then(resp => resp.json())
        .then(json => {
          setStakeSignatures(prevSignatures => ({
            ...prevSignatures,
            message: json.message,
          }))
        })
        .catch(console.error)
    }
  })

  useEffect(() => {
    if (!address || !isGovernance) return

    fetch(`${API_ENDPOINT}/signature/${address}`)
      .then(resp => resp.json())
      .then(json => {
        if (json.error) return
        setStakeSignatures(prevSignatures => {
          // TODO: I'm getting a weird race condition here with the library, this fix the issue
          const prevHack = {
            ...JSON.parse(localStorage.getItem('stakeSignatures') || '{}'),
            ...prevSignatures,
          }
          return {
            ...prevHack,
            [address]: json.signature,
          }
        })
      })
      .catch(console.warn)
  }, [address, setStakeSignatures, isGovernance])

  useEffect(() => {
    if (!ensName || !injectedProvider) {
      setEnsAvatar(undefined)
      return
    }
    injectedProvider
      .getAvatar(ensName)
      .then(result => setEnsAvatar(result ?? undefined))
      .catch(console.error)
  }, [ensName, injectedProvider])

  return (
    <onboardCtx.Provider
      value={useMemo(
        () => ({
          onboard,
          address,
          ensName,
          ensAvatar,
          balance,
          wallet,
          connected,
          connect,
          reset,
        }),
        [onboard, address, ensName, ensAvatar, balance, wallet, connected, connect, reset],
      )}
    >
      {children}
    </onboardCtx.Provider>
  )
}

const AccountState: FC = ({ children }) => {
  const address = useWalletAddress()
  const idle = useIdle()
  const [masqueradedAccount, masquerade] = useState<UserAccountCtx['masqueradedAccount']>()

  const state = useMemo<UserAccountCtx>(
    () => ({
      address,
      idle,
      masqueradedAccount: masqueradedAccount?.toLowerCase(),
    }),
    [address, idle, masqueradedAccount],
  )

  return (
    <masqueradeCtx.Provider value={masquerade}>
      <userAccountCtx.Provider value={state}>{children}</userAccountCtx.Provider>
    </masqueradeCtx.Provider>
  )
}

const OnboardConnection: FC = ({ children }) => {
  const network = useNetwork()
  const [chainId] = useChainIdCtx()
  const [injectedChainId] = useInjectedChainIdCtx()
  const jsonRpcProviders = useJsonRpcProviders()
  const [injectedProvider] = useInjectedProviderCtx()
  const [, setSigners] = useSignerCtx()

  const injectedMismatching = injectedChainId !== chainId

  useEffect(() => {
    const inject = async () => {
      if (!injectedProvider || injectedMismatching) return

      const method = network.isMetaMaskDefault ? 'wallet_switchEthereumChain' : 'wallet_addEthereumChain'
      const data = [
        {
          chainId: utils.hexStripZeros(utils.hexlify(network.chainId)),
          ...(!network.isMetaMaskDefault && {
            chainName: `${network.protocolName} (${network.chainName})`,
            nativeCurrency: network.nativeToken,
            rpcUrls: network.rpcEndpoints,
            blockExplorerUrls: [network.getExplorerUrl()],
          }),
        },
      ]

      try {
        await injectedProvider.send(method, data)
      } catch (error) {
        console.warn(error)
      }
    }
    inject()
  }, [injectedMismatching, injectedProvider, network])

  useEffect(() => {
    if (!jsonRpcProviders) return setSigners(undefined)

    if (injectedMismatching) {
      return setSigners({
        provider: jsonRpcProviders.provider as never,
      })
    }

    setSigners({
      provider: injectedProvider ?? (jsonRpcProviders?.provider as never),
      signer: injectedProvider?.getSigner() as never,
    })
  }, [injectedMismatching, injectedProvider, jsonRpcProviders, setSigners])

  // Remount Onboard when the chainId changes
  // Necessitated by Onboard's design and internal state
  return (
    <OnboardProvider key={chainId} chainId={chainId ?? ChainIds.EthereumMainnet}>
      {children}
    </OnboardProvider>
  )
}

export const AccountProvider = composedComponent(
  SignerProvider,
  InjectedChainIdProvider,
  InjectedProviderProvider,
  OnboardConnection,
  AccountState,
)
