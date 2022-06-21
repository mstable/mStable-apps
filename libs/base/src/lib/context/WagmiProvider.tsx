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
  [infuraProvider({ infuraId: 'a6daf77ef0ae4b60af39259e435a40fe' }), publicProvider()],
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
        name: detectedName => `Injected (${typeof detectedName === 'string' ? detectedName : detectedName.join(', ')})`,
        shimDisconnect: true,
      },
    }),
  ],
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

export const WagmiProvider: FC = props => (
  <WagmiConfig client={client}>
    <AccountProvider {...props} />
  </WagmiConfig>
)
