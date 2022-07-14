/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useEffect, useRef, useState } from 'react'

import { Multicall } from 'ethereum-multicall'

import { useNetwork } from './NetworkProvider'
import { useAccount, useProvider } from './WagmiProvider'

import type { Dispatch, FC, SetStateAction } from 'react'

const ctx = createContext<[{}, Dispatch<SetStateAction<{}>>]>([{}, () => {}])

const mapToCall = (address: string) => {}

export const TokenProvider: FC = ({ children }) => {
  const account = useAccount()
  const network = useNetwork()
  const provider = useProvider()
  const multicall = useRef(new Multicall({ ethersProvider: provider }))
  const [tokensCallContext, setTokensCallContext] = useState([])

  useEffect(() => {}, [])

  return <ctx.Provider value={useState({})}>{children}</ctx.Provider>
}
