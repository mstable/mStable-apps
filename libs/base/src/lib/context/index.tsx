import { composedComponent } from '@apps/react-utils'

import { BannerProvider } from './BannerProvider'
import { NotificationsProvider } from './NotificationsProvider'
import { TransactionsProvider } from './TransactionsProvider'
import { TokensProvider } from './TokensProvider'
import { BlockProvider } from './BlockProvider'
import { ApolloProvider } from './ApolloProvider'
import { NetworkProvider } from './NetworkProvider'
import { AccountProvider } from './AccountProvider'
import { PricesProvider } from './PricesProvider'
import { ENSProvider } from './ENSProvider'

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
