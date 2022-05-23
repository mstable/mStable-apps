import { useMemo } from 'react'

import { ChainIds, useChainIdCtx, useNetworkAddresses } from '@apps/base/context/network'
import { useDataState } from '@apps/data-provider'

import { DashTable } from './Styled'
import { WalletRow } from './WalletRow'

import type { MassetState } from '@apps/data-provider'
import type { SubscribedToken } from '@apps/types'
import type { FC } from 'react'

const headerTitles = ['Asset', 'Balance'].map(t => ({ title: t }))

const tBTCV1 = '0x8daebade922df735c38c80c7ebd708af50815faa'

const hideList = [tBTCV1]

const useTokens = () => {
  const dataState = useDataState()
  const networkAddresses = useNetworkAddresses()
  const [chainId] = useChainIdCtx()

  const isMainnet = chainId === ChainIds.EthereumMainnet

  const massetTokens: SubscribedToken[] = Object.values(dataState).map(({ token: masset }: MassetState) => masset)

  const bassetTokens: SubscribedToken[] = Object.values(dataState)
    .map(({ bAssets }: MassetState) => Object.keys(bAssets).map(key => bAssets[key].token))
    .reduce((a, b) => [...a, ...b], [])

  const fassetTokens: SubscribedToken[] = Object.values(dataState)
    .map(({ fAssets }: MassetState) => Object.keys(fAssets).map(key => fAssets[key].token))
    .reduce((a, b) => [...a, ...b], [])
    .filter(v => !hideList.find(b => b === v.address))

  return useMemo(() => {
    if (!massetTokens || !bassetTokens || !fassetTokens)
      return {
        MTA: undefined,
        massetTokens: [],
        bassetTokens: [],
        fassetTokens: [],
      }

    const MTA =
      isMainnet &&
      ({
        name: `Meta (mStable Governance)`,
        symbol: `MTA`,
        address: networkAddresses.MTA,
        decimals: 18,
      } as SubscribedToken | undefined)

    return {
      MTA,
      massetTokens,
      bassetTokens,
      fassetTokens,
    }
  }, [bassetTokens, massetTokens, fassetTokens, isMainnet, networkAddresses.MTA])
}

export const WalletTable: FC = () => {
  const { MTA, massetTokens, bassetTokens, fassetTokens } = useTokens()

  return (
    <DashTable headerTitles={headerTitles}>
      {MTA && <WalletRow key={MTA.address} token={MTA} />}
      {massetTokens.map(masset => (
        <WalletRow key={masset?.address} token={masset} type="masset" />
      ))}
      {bassetTokens.map(basset => (
        <WalletRow key={basset?.address} token={basset} type="basset" />
      ))}
      {fassetTokens.map(fasset => (
        <WalletRow key={fasset?.address} token={fasset} type="fasset" />
      ))}
    </DashTable>
  )
}
