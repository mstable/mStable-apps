import { FC, createContext, useState, useContext } from 'react'
import { useAsync } from 'react-use'

import { FetchState } from '@apps/types'
import { useFetchState } from '@apps/hooks'
import { providerFactory } from '@apps/context-utils'
import { BigDecimal } from '@apps/bigdecimal'
import { IncentivisedVotingLockup__factory } from '@apps/artifacts/typechain'
import { useNetworkAddresses } from '@apps/base/context/network'
import { useOwnAccount, useSigner } from '@apps/base/context/account'

export interface State {
  hasWithdrawnV1Balance: boolean
  hasSelectedStakeOption: boolean
  lockedV1: FetchState<{
    balance: BigDecimal
    end?: number
  }>
}

interface Dispatch {
  setSelectedOption: () => void
  setWithdrewV1Balance: () => void
}

const initialState: State = {
  hasWithdrawnV1Balance: false,
  hasSelectedStakeOption: false,
  lockedV1: {},
}

const dispatchContext = createContext<Dispatch>(null as never)
const stateContext = createContext<State>(null as never)

export const StakingStatusProvider: FC = ({ children }) => {
  const [state, setState] = useState<State>(initialState)
  const [lockedV1, setLockedV1] = useFetchState<{
    balance: BigDecimal
    end: number
  }>()

  const networkAddresses = useNetworkAddresses()
  const signer = useSigner()
  const account = useOwnAccount()

  // TODO: Query via graphql instead (?)
  useAsync(async () => {
    if (!signer || !account || !!lockedV1?.value) return
    setLockedV1.fetching()
    const contract = IncentivisedVotingLockup__factory.connect(networkAddresses.vMTA, signer)
    const data = await contract.locked(account)
    const balance = new BigDecimal(data?.amount ?? 0)
    const end = (data?.end?.toNumber() ?? 0) * 1e3
    setLockedV1.value({ balance, end })
  }, [account, lockedV1, networkAddresses.vMTA, setLockedV1, signer])

  return providerFactory(
    dispatchContext,
    {
      value: {
        setSelectedOption: () => {
          setState({ ...state, hasSelectedStakeOption: true })
        },
        setWithdrewV1Balance: () => {
          setState({ ...state, hasWithdrawnV1Balance: true })
        },
      },
    },
    providerFactory(stateContext, { value: { ...state, lockedV1 } }, children),
  )
}

export const useStakingStatus = (): State => useContext(stateContext)

export const useStakingStatusDispatch = (): Dispatch => useContext(dispatchContext)
