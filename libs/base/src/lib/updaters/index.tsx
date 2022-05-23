import { ContractsUpdater } from './contractsUpdater'
import { ENSCacher } from './ensCacher'
import { QuestsUpdater } from './questsUpdater'
import { TokenFetcher } from './tokenFetcher'
import { TokenSubscriptionsUpdater } from './tokenSubscriptionsUpdater'
import { TransactionsUpdater } from './transactionsUpdater'

import type { FC } from 'react'

export const Updaters: FC<{}> = () => (
  <>
    <TokenFetcher />
    <TokenSubscriptionsUpdater />
    <TransactionsUpdater />
    <ContractsUpdater />
    <QuestsUpdater />
    <ENSCacher />
  </>
)
