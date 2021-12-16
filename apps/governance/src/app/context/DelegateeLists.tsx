import React, { createContext, useEffect, FC, useContext } from 'react'
import { DelegateeInfo, DelegateeList } from '@mstable/delegatee-lists'

import { useFetchState } from '@apps/hooks'
import { providerFactory } from '@apps/context-utils'
import { useProvider } from '@apps/base/context/account'
import { useNetwork } from '@apps/base/context/network'

interface State {
  lists: { [url: string]: DelegateeList }
  all: { [address: string]: DelegateeInfo }
}

// TODO
interface Dispatch {}

const dispatchContext = createContext<Dispatch>(null as never)
const stateContext = createContext<State>(null as never)

const DEFAULT_LIST_OF_LISTS: string[] = ['delegatees.mstable.eth']
const initialState: State = { lists: {}, all: {} }

export const DelegateeListsProvider: FC = ({ children }) => {
  const [state, setState] = useFetchState<State>()

  const network = useNetwork()
  const provider = useProvider()

  useEffect(() => {
    if (!provider || state.fetching || state.value || state.error) return

    setState.fetching()
    Promise.all(
      // TODO support https etc
      DEFAULT_LIST_OF_LISTS.map(async ensName => {
        // TODO reinstate me when on mainnet
        // const ipfsHash = await resolveENSContentHash(ensName, provider)
        // const url = `https://cloudflare-ipfs.com/ipfs/${ipfsHash ? ipfsHash.slice(7) : ''}/`
        const url = 'https://gateway.pinata.cloud/ipfs/QmXjUHzohugdqsnUTjmaHMgxYFnHEQN8zPrhrK63eS2Tp7'

        const response = await fetch(url)
        const list = (await response.json()) as DelegateeList
        return [ensName, list]
      }),
    )
      .then(entries => {
        const lists = Object.fromEntries(entries)
        const all = Object.fromEntries(
          // For now, ignore conflicts and flat map by address; just one list
          entries.flatMap(([, list]: [string, DelegateeList]) =>
            // @ts-ignore
            list.delegatees.map(delegate => [delegate.address?.toLowerCase() ?? delegate.ensName, delegate]),
          ),
        )
        setState.value({ lists, all })
      })
      .catch(setState.error)
  }, [network, provider, setState, state])

  return providerFactory(dispatchContext, { value: {} }, providerFactory(stateContext, { value: state.value ?? initialState }, children))
}

export const useDelegateesAll = () => useContext(stateContext).all
