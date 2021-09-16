import { FC, createContext, useState, useContext, useEffect } from 'react'

import { providerFactory } from '@apps/hooks'
import { BigDecimal } from '@apps/bigdecimal'
import { IncentivisedVotingLockup__factory } from '@apps/artifacts/typechain'
import { useNetworkAddresses } from '@apps/base/context/network'
import { useOwnAccount, useSigner } from '@apps/base/context/account'

export interface State {
  hasWithdrawnV1Balance: boolean
  hasSelectedStakeOption: boolean
  lockedV1?: {
    balance: BigDecimal
    end: BigDecimal
  }
}

interface Dispatch {
  setSelectedOption: () => void
  setWithdrewV1Balance: () => void
}

const initialState: State = {
  hasWithdrawnV1Balance: false,
  hasSelectedStakeOption: false,
}

const dispatchContext = createContext<Dispatch>(null as never)
const stateContext = createContext<State>(null as never)

export const StakingStatusProvider: FC = ({ children }) => {
  const [state, setState] = useState<State>(initialState)
  const networkAddresses = useNetworkAddresses()
  const signer = useSigner()
  const account = useOwnAccount()

  // TODO: Query via graphql instead (?)
  useEffect(() => {
    if (!!state?.lockedV1 || !signer) return
    ;(async () => {
      const contract = IncentivisedVotingLockup__factory.connect(networkAddresses.vMTA, signer)
      const data = await contract.locked(account)
      if (data?.length === 2) {
        setState({ ...state, lockedV1: { balance: new BigDecimal(data[0]), end: new BigDecimal(data[1]) } })
      }
    })()
  }, [account, networkAddresses.vMTA, signer, state])

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
    providerFactory(stateContext, { value: state }, children),
  )
}

export const useStakingStatus = (): State => useContext(stateContext)

export const useStakingStatusDispatch = (): Dispatch => useContext(dispatchContext)
