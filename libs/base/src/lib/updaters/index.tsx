import React, { FC } from 'react'

import { TransactionsUpdater } from './transactionsUpdater'
import { TokenSubscriptionsUpdater } from './tokenSubscriptionsUpdater'
import { TokenFetcher } from './tokenFetcher'
import { ContractsUpdater } from './contractsUpdater'
import { ENSCacher } from './ensCacher'

export const Updaters: FC<{}> = () => (
  <>
    <TokenFetcher />
    <TokenSubscriptionsUpdater />
    <TransactionsUpdater />
    <ContractsUpdater />
    <ENSCacher />
  </>
)
