import { composedComponent } from '@apps/react-utils'

import { AccountProvider } from './AccountProvider'
import { ApolloProvider } from './ApolloProvider'
import { BannerProvider } from './BannerProvider'
import { BlockProvider } from './BlockProvider'
import { ENSProvider } from './ENSProvider'
import { NetworkProvider } from './NetworkProvider'
import { NotificationsProvider } from './NotificationsProvider'
import { PricesProvider } from './PricesProvider'
import { TokensProvider } from './TokensProvider'
import { TransactionsProvider } from './TransactionsProvider'

const Providers = composedComponent(
  NetworkProvider,
  NotificationsProvider,
  ApolloProvider,
  AccountProvider,
  BlockProvider,
  TransactionsProvider,
  TokensProvider,
  PricesProvider,
  ENSProvider,
  BannerProvider,
)

export { Providers }
