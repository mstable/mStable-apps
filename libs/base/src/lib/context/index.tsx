import { composedComponent } from '@apps/react-utils'

import { AppProvider } from './AppProvider'
import { MassetProvider } from './MassetProvider'
import { NotificationsProvider } from './NotificationsProvider'
import { TransactionsProvider } from './TransactionsProvider'
import { ThemeProvider } from './ThemeProvider'
import { TokensProvider } from './TokensProvider'
import { BlockProvider } from './BlockProvider'
import { DataProvider } from './DataProvider'
import { ApolloProvider } from './ApolloProvider'
import { NetworkProvider } from './NetworkProvider'
import { AccountProvider } from './AccountProvider'
import { PricesProvider } from './PricesProvider'

const Providers = composedComponent(
  NetworkProvider, // contains a lot of config, but should be able to share it
  MassetProvider, // NOT generic
  NotificationsProvider,
  ApolloProvider,
  AccountProvider,
  BlockProvider,
  TransactionsProvider,
  TokensProvider,
  DataProvider, // NOT generic
  PricesProvider,
  AppProvider,
  ThemeProvider,
)

export { Providers }
