import '@rainbow-me/rainbowkit/dist/index.css'

import { Fragment, useEffect } from 'react'

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
import { InjectedConnector } from 'wagmi/connectors/injected'
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

const exodusWallet = ({ chains }: { chains: Chain[] }): Wallet => ({
  id: 'exodus',
  name: 'Exodus',
  iconUrl:
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTU2IiBoZWlnaHQ9IjMyIiB2aWV3Qm94PSIwIDAgMTU2IDMyIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMzEuODA4IDguOTM0ODhMMTguMTgwOSAwVjQuOTk1NTRMMjYuOTIyOCAxMC42NzYyTDI1Ljg5NDMgMTMuOTMwNEgxOC4xODA5VjE4LjA2OTZIMjUuODk0M0wyNi45MjI4IDIxLjMyMzhMMTguMTgwOSAyNy4wMDQ1VjMyTDMxLjgwOCAyMy4wOTM3TDI5LjU3OTYgMTYuMDE0M0wzMS44MDggOC45MzQ4OFoiIGZpbGw9InVybCgjcGFpbnQwX2xpbmVhcl81MzZfODQ5MikiLz4KPHBhdGggZD0iTTYuMzI1MDIgMTguMDY5NkgxNC4wMDk5VjEzLjkzMDRINi4yOTY0NUw1LjI5NjU2IDEwLjY3NjJMMTQuMDA5OSA0Ljk5NTU0VjBMMC4zODI4MTIgOC45MzQ4OEwyLjYxMTE0IDE2LjAxNDNMMC4zODI4MTIgMjMuMDkzN0wxNC4wMzg1IDMyVjI3LjAwNDVMNS4yOTY1NiAyMS4zMjM4TDYuMzI1MDIgMTguMDY5NloiIGZpbGw9InVybCgjcGFpbnQxX2xpbmVhcl81MzZfODQ5MikiLz4KPG1hc2sgaWQ9Im1hc2swXzUzNl84NDkyIiBzdHlsZT0ibWFzay10eXBlOmFscGhhIiBtYXNrVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4PSIwIiB5PSIwIiB3aWR0aD0iMzIiIGhlaWdodD0iMzIiPgo8cGF0aCBkPSJNMzEuODA4IDguOTM0ODhMMTguMTgwOSAwVjQuOTk1NTRMMjYuOTIyOCAxMC42NzYyTDI1Ljg5NDMgMTMuOTMwNEgxOC4xODA5VjE4LjA2OTZIMjUuODk0M0wyNi45MjI4IDIxLjMyMzhMMTguMTgwOSAyNy4wMDQ1VjMyTDMxLjgwOCAyMy4wOTM3TDI5LjU3OTYgMTYuMDE0M0wzMS44MDggOC45MzQ4OFoiIGZpbGw9InVybCgjcGFpbnQyX2xpbmVhcl81MzZfODQ5MikiLz4KPHBhdGggZD0iTTYuMzI1MDIgMTguMDY5NkgxNC4wMDk5VjEzLjkzMDRINi4yOTY0NUw1LjI5NjU2IDEwLjY3NjJMMTQuMDA5OSA0Ljk5NTU0VjBMMC4zODI4MTIgOC45MzQ4OEwyLjYxMTE0IDE2LjAxNDNMMC4zODI4MTIgMjMuMDkzN0wxNC4wMzg1IDMyVjI3LjAwNDVMNS4yOTY1NiAyMS4zMjM4TDYuMzI1MDIgMTguMDY5NloiIGZpbGw9InVybCgjcGFpbnQzX2xpbmVhcl81MzZfODQ5MikiLz4KPC9tYXNrPgo8ZyBtYXNrPSJ1cmwoI21hc2swXzUzNl84NDkyKSI+CjxyZWN0IHg9IjAuNDAwMzkxIiB3aWR0aD0iMzEuMiIgaGVpZ2h0PSIzMiIgZmlsbD0idXJsKCNwYWludDRfbGluZWFyXzUzNl84NDkyKSIvPgo8L2c+CjxwYXRoIGQ9Ik01OC45MjA3IDguNzk5OFYxMS41OTc0SDQ2LjAyODFWMTQuNDZINTYuOTgyNlYxNy4yNTc2SDQ2LjAyODFWMjAuNDAyMkg1OC45MjA3VjIzLjE5OThINDIuNzIwN1Y4Ljc5OThINTguOTIwN1oiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik02MC43NSAyMy4xOTk4TDY4LjE1NzIgMTUuOTEzMUw2MC45NTk4IDguNzk5OEg2NS41MTMzTDcwLjU5MTMgMTMuOTM5Nkw3NS40NTk1IDguNzk5OEg3OS43MTkyTDcyLjU0MjggMTUuOTEzMUw3OS45NSAyMy4xOTk4SDc1LjM1NDZMNzAuNTkxMyAxNy45MDgyTDY1LjE1NjYgMjMuMTk5OEg2MC43NVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik04OC44MzE5IDguNzk5OEM5NC44MzMyIDguNzk5OCA5OC40NDIyIDExLjgwNSA5OC40NDIyIDE1Ljk5OThDOTguNDQyMiAyMC4xOTQ2IDk0LjgzMzIgMjMuMTk5OCA4OC44MzE5IDIzLjE5OThDODIuODMwNiAyMy4xOTk4IDc5LjI0MjIgMjAuMTk0NiA3OS4yNDIyIDE1Ljk5OThDNzkuMjQyMiAxMS44MDUgODIuODMwNiA4Ljc5OTggODguODMxOSA4Ljc5OThaTTg4LjgzMTkgMTEuNDkyQzg1LjIyMjkgMTEuNDkyIDgyLjU2MjUgMTMuMzA3NiA4Mi41NjI1IDE1Ljk5OThDODIuNTYyNSAxOC42OTIgODUuMjIyOSAyMC41MDc2IDg4LjgzMTkgMjAuNTA3NkM5Mi40NjE1IDIwLjUwNzYgOTUuMTIxOSAxOC42OTIgOTUuMTIxOSAxNS45OTk4Qzk1LjEyMTkgMTMuMzA3NiA5Mi40NjE1IDExLjQ5MiA4OC44MzE5IDExLjQ5MloiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMTAuNDA0IDguNzk5OEMxMTUuMjExIDguNzk5OCAxMTguMTA3IDExLjQ2NzMgMTE4LjEwNyAxNS45NzgxQzExOC4xMDcgMjAuNTMyMyAxMTUuMjMyIDIzLjE5OTggMTEwLjQ0NiAyMy4xOTk4SDEwMC43MDdWOC43OTk4SDExMC40MDRaTTExNC43MDcgMTUuOTc4MUMxMTQuNzA3IDEzLjE1ODggMTEzLjAyOCAxMS41OTc0IDEwOS45ODQgMTEuNTk3NEgxMDQuMDAyVjIwLjQwMjJIMTA5Ljk4NEMxMTMuMDI4IDIwLjQwMjIgMTE0LjcwNyAxOC44MTkxIDExNC43MDcgMTUuOTc4MVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMjkuMDA1IDIzLjE5OThDMTIzLjk0NCAyMy4xOTk4IDEyMC4xMDUgMjAuOTAyNiAxMjAuMTA1IDE2LjY2OThWOC43OTk4SDEyMy40MTdWMTYuMzUwOEMxMjMuNDE3IDE4Ljk2NyAxMjYuMTM3IDIwLjE3OTQgMTI5LjAwNSAyMC4xNzk0QzEzMS44OTUgMjAuMTc5NCAxMzQuNjE1IDE4Ljk4ODMgMTM0LjYxNSAxNi4zNTA4VjguNzk5OEgxMzcuOTA1VjE2LjY2OThDMTM3LjkwNSAyMC45MDI2IDEzNC4wODggMjMuMTk5OCAxMjkuMDA1IDIzLjE5OThaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTQ3LjE3NCAyMy4xOTk4QzE0NC40NTUgMjMuMTk5OCAxNDEuNTIzIDIyLjY5ODkgMTM5LjQ0MSAyMS43NTk4TDE0MC41MjUgMTkuMDg4NUMxNDIuMzk0IDE5Ljk0NDIgMTQ0Ljk2NSAyMC40ODY4IDE0Ny4yOCAyMC40ODY4QzE0OS45MzYgMjAuNDg2OCAxNTIuNDIxIDE5LjkyMzMgMTUyLjQyMSAxOC45MjE1QzE1Mi40MjEgMTguMTkxMSAxNTEuNjM1IDE3Ljg3ODEgMTQ5Ljk5OSAxNy42Mjc2TDE0NS4zNjggMTcuMTI2OEMxNDEuNzk5IDE2LjY0NjggMTQwLjA1NyAxNS40MTU1IDE0MC4wNTcgMTMuMjQ1QzE0MC4wNTcgMTAuNDQ4NSAxNDMuMDEgOC43OTk4IDE0Ny4zNDQgOC43OTk4QzE0OS45NTcgOC43OTk4IDE1My41NDcgOS4yNzk4IDE1NS4zOTUgMTAuMTE0NkwxNTQuMzEyIDEyLjY2MDdDMTUyLjQ4NSAxMS45MDk0IDE0OS4zODMgMTEuNTMzNyAxNDcuMTk1IDExLjUzMzdDMTQ0Ljk0MyAxMS41MzM3IDE0My40NTYgMTIuMDU1NSAxNDMuNDU2IDEzLjAxNTVDMTQzLjQ1NiAxMy42ODMzIDE0NC4yIDE0LjAxNzIgMTQ2LjExMiAxNC4yODg1TDE1MC42MTUgMTQuNzg5NEMxNTQuMDU3IDE1LjI2OTQgMTU1Ljg0MSAxNi40MzgxIDE1NS44NDEgMTguNzEyOEMxNTUuODQxIDIxLjU5MjggMTUyLjA2IDIzLjE5OTggMTQ3LjE3NCAyMy4xOTk4WiIgZmlsbD0id2hpdGUiLz4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQwX2xpbmVhcl81MzZfODQ5MiIgeDE9IjI3LjM5OTYiIHkxPSIzNC4yIiB4Mj0iMTguMjcxNiIgeTI9Ii0zLjUxNDIzIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiMwQjQ2RjkiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjQkJGQkUwIi8+CjwvbGluZWFyR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQxX2xpbmVhcl81MzZfODQ5MiIgeDE9IjI3LjM5OTYiIHkxPSIzNC4yIiB4Mj0iMTguMjcxNiIgeTI9Ii0zLjUxNDIzIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiMwQjQ2RjkiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjQkJGQkUwIi8+CjwvbGluZWFyR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQyX2xpbmVhcl81MzZfODQ5MiIgeDE9IjI3LjM5OTYiIHkxPSIzNC4yIiB4Mj0iMTguMjcxNiIgeTI9Ii0zLjUxNDIzIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiMwQjQ2RjkiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjQkJGQkUwIi8+CjwvbGluZWFyR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQzX2xpbmVhcl81MzZfODQ5MiIgeDE9IjI3LjM5OTYiIHkxPSIzNC4yIiB4Mj0iMTguMjcxNiIgeTI9Ii0zLjUxNDIzIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+CjxzdG9wIHN0b3AtY29sb3I9IiMwQjQ2RjkiLz4KPHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjQkJGQkUwIi8+CjwvbGluZWFyR3JhZGllbnQ+CjxsaW5lYXJHcmFkaWVudCBpZD0icGFpbnQ0X2xpbmVhcl81MzZfODQ5MiIgeDE9IjIuNDAwMzkiIHkxPSI3LjIiIHgyPSIxOC4yMDA0IiB5Mj0iMTkiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KPHN0b3Agb2Zmc2V0PSIwLjExOTc5MiIgc3RvcC1jb2xvcj0iIzg5NTJGRiIgc3RvcC1vcGFjaXR5PSIwLjg3Ii8+CjxzdG9wIG9mZnNldD0iMSIgc3RvcC1jb2xvcj0iI0RBQkRGRiIgc3RvcC1vcGFjaXR5PSIwIi8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPC9zdmc+Cg==',
  iconBackground: '#ffffff',
  createConnector: () => ({
    connector: new InjectedConnector({
      chains,
      options: { name: 'exodus' },
    }),
  }),
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
      exodusWallet({ chains }),
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
  const { address, connector } = useWagmiAccount()
  const [, setChainId] = useChainIdCtx()
  const { chain } = useNetwork()
  const [, setStakeSignatures] = useStakeSignatures()
  const { connect, connectors } = useConnect()

  useEffect(() => {
    if (chain?.id) {
      setChainId(chain.id)
    }
  }, [chain?.id, setChainId])

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
    if (process.env.NX_APP_NAME === 'governance' && address) {
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
              [address ?? '']: json.signature,
            }
          })
        })
        .catch(console.warn)
    }
  }, [address, setStakeSignatures])

  useEffect(() => {
    if (isIframe()) {
      for (const id of AUTOCONNECTED_CONNECTOR_IDS) {
        const connectorInstance = connectors.find(c => c.id === id && c.ready)

        if (connectorInstance) {
          connect({ connector })
          return
        }
      }
    }
  }, [connect, connector, connectors])

  // Remount when the chainId changes
  // Necessitated for internal state reset
  return <Fragment key={chain?.id ?? 'none'}>{children}</Fragment>
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

export const useWalletAddress = () => useWagmiAccount()?.address?.toLowerCase()

export const useSigner = () => useWagmiSigner()?.data

export const useSignerOrProvider = () => useWagmiSigner()?.data

export const useAccount = () => useWagmiAccount()?.address?.toLowerCase()

export const useIsIdle = () => {
  const { isConnected, isConnecting, isReconnecting } = useWagmiAccount()

  return isConnected && (!isConnecting || !isReconnecting)
}
