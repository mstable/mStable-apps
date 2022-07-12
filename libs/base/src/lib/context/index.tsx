import { composedComponent } from '@apps/react-utils'

import { ApolloProvider } from './ApolloProvider'
import { BannerProvider } from './BannerProvider'
import { BlockProvider } from './BlockProvider'
import { ENSProvider } from './ENSProvider'
import { NetworkProvider } from './NetworkProvider'
import { NotificationsProvider } from './NotificationsProvider'
import { NetworkPricesProvider, PricesProvider } from './PricesProvider'
import { TokensProvider } from './TokensProvider'
import { TransactionsProvider } from './TransactionsProvider'
import { WagmiProvider } from './WagmiProvider'

const Providers = composedComponent(
  NetworkProvider,
  WagmiProvider,
  NotificationsProvider,
  ApolloProvider,
  BlockProvider,
  TransactionsProvider,
  TokensProvider,
  NetworkPricesProvider,
  PricesProvider,
  ENSProvider,
  BannerProvider,
)

export { Providers }
