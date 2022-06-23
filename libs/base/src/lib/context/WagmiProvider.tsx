import { useEffect } from 'react'

import { chain, configureChains, createClient, useNetwork, WagmiConfig } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { infuraProvider } from 'wagmi/providers/infura'
import { publicProvider } from 'wagmi/providers/public'

import { useChainIdCtx } from './NetworkProvider'

import type { FC } from 'react'

const infuraId = 'a6daf77ef0ae4b60af39259e435a40fe'

const { chains, provider, webSocketProvider } = configureChains(
  [chain.mainnet, chain.ropsten, chain.goerli, chain.kovan, chain.polygon, chain.polygonMumbai],
  [infuraProvider({ infuraId }), publicProvider()],
)

const client = createClient({
  autoConnect: true,
  connectors({ chainId }) {
    return [
      new InjectedConnector({
        chains,
      }),
      new WalletConnectConnector({
        chains,
        options: {
          chainId,
          infuraId,
          qrcode: true,
        },
      }),
      new CoinbaseWalletConnector({
        chains,
        options: {
          appName: 'mStable',
          appLogoUrl: 'https://raw.githubusercontent.com/mstable/mStable-apps/master/libs/icons/src/lib/mstable-small.svg',
        },
      }),
    ]
  },
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
