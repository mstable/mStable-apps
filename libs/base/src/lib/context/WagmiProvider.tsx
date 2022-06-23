import '@rainbow-me/rainbowkit/dist/index.css'

import { useEffect } from 'react'

import { useIsDarkMode } from '@apps/browser-settings'
import { rbkDarkTheme, rbkLightTheme } from '@apps/theme'
import { connectorsForWallets, RainbowKitProvider, wallet } from '@rainbow-me/rainbowkit'
import { chain, configureChains, createClient, useNetwork, WagmiConfig } from 'wagmi'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'

import { useChainIdCtx } from './NetworkProvider'

import type { FC } from 'react'

const infuraId = 'a6daf77ef0ae4b60af39259e435a40fe'

const { chains, provider, webSocketProvider } = configureChains(
  [chain.mainnet, chain.ropsten, chain.goerli, chain.kovan, chain.polygon, chain.polygonMumbai],
  [infuraProvider({ infuraId }), publicProvider()],
)

const needsInjectedWalletFallback =
  typeof window !== 'undefined' && window.ethereum && !window.ethereum.isMetaMask && !window.ethereum.isCoinbaseWallet

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [
      wallet.metaMask({ chains }),
      wallet.ledger({ chains }),
      wallet.walletConnect({ chains }),
      wallet.coinbase({ appName: 'mStable', chains }),
    ],
  },
  {
    groupName: 'Others',
    wallets: [
      wallet.rainbow({ chains }),
      wallet.brave({ chains, shimDisconnect: true }),
      wallet.argent({ chains }),
      wallet.imToken({ chains }),
      ...(needsInjectedWalletFallback ? [wallet.injected({ chains })] : []),
    ],
  },
])

const client = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
})

const AccountProvider: FC = ({ children }) => {
  const [, setChainId] = useChainIdCtx()
  const { activeChain } = useNetwork()

  useEffect(() => {
    if (activeChain?.id) {
      setChainId(activeChain.id)
    }
  }, [activeChain?.id, setChainId])

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
