import '@rainbow-me/rainbowkit/dist/index.css'

import { useEffect } from 'react'

import { useIsDarkMode } from '@apps/browser-settings'
import { isIframe } from '@apps/react-utils'
import { rbkDarkTheme, rbkLightTheme } from '@apps/theme'
import { SafeConnector } from '@gnosis.pm/safe-apps-wagmi'
import { connectorsForWallets, RainbowKitProvider, wallet } from '@rainbow-me/rainbowkit'
import { useEffectOnce } from 'react-use'
import {
  chain,
  configureChains,
  createClient,
  useAccount as useWagmiAccount,
  useConnect,
  useNetwork,
  useProvider as useWagmiProvider,
  useSigner as useWagmiSigner,
  WagmiConfig,
} from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'

import { useStakeSignatures } from '../hooks'
import { API_ENDPOINT } from '../utils'
import { useChainIdCtx } from './NetworkProvider'

import type { Wallet } from '@rainbow-me/rainbowkit'
import type { FC } from 'react'
import type { Chain } from 'wagmi'

const INFURA_ID = 'a6daf77ef0ae4b60af39259e435a40fe'
const AUTOCONNECTED_CONNECTOR_IDS = ['safe', 'metaMask', 'walletConnect', 'coinbaseWallet', 'injected']

const { chains, provider, webSocketProvider } = configureChains(
  [
    chain.mainnet,
    chain.ropsten,
    chain.goerli,
    chain.kovan,
    ...(process.env.NX_APP_NAME === 'protocol' ? [chain.polygon, chain.polygonMumbai] : []),
  ],
  [infuraProvider({ infuraId: INFURA_ID }), publicProvider()],
)

const needsInjectedWalletFallback =
  typeof window !== 'undefined' && window.ethereum && !window.ethereum.isMetaMask && !window.ethereum.isCoinbaseWallet

const safeWallet = ({ chains }: { chains: Chain[] }): Wallet => ({
  id: 'safe',
  name: 'Gnosis Safe',
  iconUrl: 'https://raw.githubusercontent.com/safe-global/safe-react/dev/src/assets/logo.svg',
  iconBackground: '#ffffff',
  createConnector: () => ({ connector: new SafeConnector({ chains }) }),
})

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      wallet.metaMask({ chains, shimDisconnect: true }),
      wallet.ledger({ chains }),
      wallet.walletConnect({ chains }),
      wallet.coinbase({ appName: 'mStable', chains }),
    ],
  },
  {
    groupName: 'Others',
    wallets: [
      safeWallet({ chains }),
      wallet.rainbow({ chains }),
      wallet.brave({ chains, shimDisconnect: true }),
      wallet.argent({ chains }),
      wallet.imToken({ chains }),
      ...(needsInjectedWalletFallback ? [wallet.injected({ chains, shimDisconnect: true })] : []),
    ],
  },
])

const client = createClient({
  autoConnect: !isIframe(),
  connectors,
  provider,
  webSocketProvider,
})

const AccountProvider: FC = ({ children }) => {
  const { data: account } = useWagmiAccount()
  const [, setChainId] = useChainIdCtx()
  const { activeChain } = useNetwork()
  const [, setStakeSignatures] = useStakeSignatures()
  const { connect, connectors } = useConnect()

  useEffect(() => {
    if (activeChain?.id) {
      setChainId(activeChain.id)
    }
  }, [activeChain?.id, setChainId])

  useEffectOnce(() => {
    if (process.env.NX_APP_NAME === 'governance') {
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
    if (process.env.NX_APP_NAME === 'governance' && account?.address) {
      fetch(`${API_ENDPOINT}/signature/${account?.address}`)
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
              [account.address ?? '']: json.signature,
            }
          })
        })
        .catch(console.warn)
    }
  }, [account?.address, setStakeSignatures])

  useEffect(() => {
    if (isIframe()) {
      for (const id of AUTOCONNECTED_CONNECTOR_IDS) {
        const connectorInstance = connectors.find(c => c.id === id && c.ready)

        if (connectorInstance) {
          connect(connectorInstance)
          return
        }
      }
    }
  }, [connect, connectors])

  return <>{children}</>
}

export const WagmiProvider: FC = props => {
  const isDarkMode = useIsDarkMode()

  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider
        chains={chains}
        appInfo={{
          appName: 'mStable',
          learnMoreUrl: 'https://mstable.org/',
        }}
        theme={isDarkMode ? rbkDarkTheme : rbkLightTheme}
      >
        <AccountProvider {...props} />
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export const useProvider = () => useWagmiProvider()

export const useWalletAddress = () => useWagmiAccount()?.data?.address?.toLowerCase()

export const useSigner = () => useWagmiSigner()?.data

export const useSignerOrProvider = () => useWagmiSigner()?.data

export const useAccount = () => useWagmiAccount()?.data?.address?.toLowerCase()

export const useIsIdle = () => {
  const { data, isLoading } = useWagmiAccount()

  return !isLoading && !!data?.address
}
