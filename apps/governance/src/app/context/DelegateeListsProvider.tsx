import React, { createContext, useEffect, FC, useState, useContext, useMemo } from 'react'
import { DelegateeList } from '@mstable/delegatee-lists'

import { providerFactory, resolveENSContentHash } from '@apps/hooks'
import { useProvider } from '@apps/base/context/account'
import { useNetwork } from '@apps/base/context/network'

interface State {
  lists: { [url: string]: DelegateeList }
}

// TODO
interface Dispatch {}

const dispatchContext = createContext<Dispatch>(null as never)
const stateContext = createContext<State>(null as never)

const DEFAULT_LIST_OF_LISTS: string[] = ['delegatees.mstable.eth']
const initialState: State = { lists: {} }

export const DelegateeListsProvider: FC = ({ children }) => {
  const [state, setState] = useState<State>(initialState)

  const network = useNetwork()
  const provider = useProvider()

  useEffect(() => {
    if (!provider) return

    Promise.all(
      // TODO support https etc
      DEFAULT_LIST_OF_LISTS.map(async ensName => {
        const ipfsHash = await resolveENSContentHash(ensName, provider)
        const url = `https://cloudflare-ipfs.com/ipfs/${ipfsHash.replace('ipfs://', '')}/`
        const response = await fetch(url)
        const list = (await response.json()) as DelegateeList
        return [ensName, list]
      }),
    ).then(lists => {
      setState({ lists: Object.fromEntries(lists) })
    })
  }, [network, provider])

  return providerFactory(dispatchContext, { value: {} }, providerFactory(stateContext, { value: state }, children))
}

export const useDelegatesAll = () => {
  const state = useContext(stateContext)

  return useMemo(
    () =>
      Object.fromEntries(
        // For now, ignore conflicts and flat map by address; just one list
        (Object.values(state.lists) as DelegateeList[]).flatMap(list =>
          list.delegatees.map(delegate => [delegate.address.toLowerCase(), delegate]),
        ),
      ),
    [state],
  )
}
