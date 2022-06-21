import { useEffect } from 'react'

import { chain, configureChains, createClient, useNetwork, WagmiConfig } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'

import { useChainIdCtx } from './NetworkProvider'

import type { FC } from 'react'

const { chains, provider, webSocketProvider } = configureChains(
  [chain.mainnet, chain.ropsten, chain.goerli, chain.kovan, chain.polygon, chain.polygonMumbai],
  [infuraProvider(), publicProvider()],
)

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
})

const AccountProvider: FC = ({ children }) => {
  const [chainId, setChainId] = useChainIdCtx()
  const { activeChain } = useNetwork()

  useEffect(() => {
    if (activeChain?.id && chainId && activeChain?.id !== chainId) {
      setChainId(activeChain.id)
    }
  }, [activeChain?.id, chainId, setChainId])

  return <>{children}</>
}

export const WagmiProvider: FC = props => (
  <WagmiConfig client={client}>
    <AccountProvider {...props} />
  </WagmiConfig>
)
