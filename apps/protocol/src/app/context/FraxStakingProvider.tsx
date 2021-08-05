import React, { FC, createContext, useEffect, useRef, useMemo, useContext } from 'react'
import { BigNumber } from 'ethers'

import { ERC20, ERC20__factory, FraxCrossChainFarm, FraxCrossChainFarm__factory } from '@apps/artifacts/typechain'
import { FetchState, useFetchState } from '@apps/hooks'
import { BigDecimal } from '@apps/bigdecimal'

import { MaticMainnet, useNetworkAddresses } from '@apps/base/context/network'
import { useBlockNow } from '@apps/base/context/block'
import { useSignerOrProvider } from '@apps/base/context/account'

export interface StakeData {
  earned: { address: string; amount: BigDecimal }[]
  combinedWeight: BigNumber
  lockedLiquidity: BigDecimal
  lockedStakes: {
    kekId: string
    startTime: number
    endTime: number
    liquidity: BigDecimal
    lockMultiplier: BigDecimal
  }[]
  poolBalance: BigDecimal
}

interface StaticData {
  address: string
  lockMaxMultiplier: number
  lockTimeMax: number
  lockTimeMin: number
}

interface SubscribedData {
  // TODO probably more?
  lastUpdate?: number
  accountData?: StakeData
}

interface State {
  addresses: MaticMainnet['addresses']['FRAX']
  static: FetchState<StaticData>
  subscribed: FetchState<SubscribedData>
}

const contractCtx = createContext<FraxCrossChainFarm | undefined>(null as never)
const stateCtx = createContext<State>(null as never)

export const useFraxStakingContract = (): FraxCrossChainFarm | undefined => useContext(contractCtx)
export const useFraxStakingState = (): State => useContext(stateCtx)

export const FraxStakingProvider: FC = ({ children }) => {
  const addresses = useNetworkAddresses()
  const frax = (addresses as MaticMainnet['addresses'])['FRAX']

  const signerOrProvider = useSignerOrProvider()
  const blockNumber = useBlockNow()

  // TODO: - Change
  const account = '0x36a87d1e3200225f881488e4aeedf25303febcae' // useAccount()
  const feederPool = '0xb30a907084ac8a0d25dddab4e364827406fd09f0'

  const contract = useRef<FraxCrossChainFarm>()
  const feederPoolContract = useRef<ERC20>()
  const [staticData, setStaticData] = useFetchState<StaticData>()
  const [subscribedData, setSubscribedData] = useFetchState<SubscribedData>()

  // Set/reset on network/signer change
  useEffect(() => {
    if (frax) {
      const { stakingContract } = frax
      contract.current =
        stakingContract && signerOrProvider ? FraxCrossChainFarm__factory.connect(stakingContract, signerOrProvider) : undefined
      feederPoolContract.current = stakingContract && signerOrProvider ? ERC20__factory.connect(feederPool, signerOrProvider) : undefined
    } else {
      contract.current = undefined
      feederPoolContract.current = undefined
      setStaticData.value()
      setSubscribedData.value()
    }
  }, [frax, signerOrProvider, setStaticData, setSubscribedData])

  // Initial contract calls (once only)
  useEffect(() => {
    if (!contract.current || staticData.fetching || staticData.value) return

    setStaticData.fetching()

    Promise.all([contract.current.lock_max_multiplier(), contract.current.lock_time_for_max_multiplier(), contract.current.lock_time_min()])
      .then(([lockMaxMultiplier, lockTimeMax, lockTimeMin]) => {
        if (!contract.current) return
        setStaticData.value({
          address: contract.current.address,
          lockMaxMultiplier: parseFloat(lockMaxMultiplier.toString()) / 1e18,
          lockTimeMax: parseInt(lockTimeMax.toString()),
          lockTimeMin: parseInt(lockTimeMin.toString()),
        })
      })
      .catch(setStaticData.error)
  }, [setStaticData, staticData.fetching, staticData.value, frax])

  // Contract calls on every block
  useEffect(() => {
    if (!frax || !contract.current || subscribedData.fetching) return

    Promise.all([
      account
        ? Promise.all([
            contract.current.earned(account),
            contract.current.combinedWeightOf(account),
            contract.current.lockedStakesOf(account),
            contract.current.lockedLiquidityOf(account),
            feederPoolContract.current.balanceOf(account),
          ])
        : undefined,
    ])
      .then(([[earned, combinedWeight, lockedStakes, lockedLiquidity, poolBalance] = []]) => {
        let accountData: SubscribedData['accountData']
        if (earned && combinedWeight && lockedStakes && lockedLiquidity) {
          accountData = {
            earned: earned.map((amount, index) => {
              const address = index === 0 ? frax.rewardsTokens[0] : frax.rewardsTokens[1]
              return {
                address,
                amount: new BigDecimal(amount), // Assumed 18 decimals (so far, we know it will be)
              }
            }),
            combinedWeight: BigNumber.from(combinedWeight),
            lockedLiquidity: new BigDecimal(lockedLiquidity),
            lockedStakes: lockedStakes.map(({ kek_id, start_timestamp, ending_timestamp, liquidity, lock_multiplier }) => ({
              kekId: kek_id,
              startTime: new Date(parseInt(start_timestamp.toString())).getTime() * 1000, // ms
              endTime: new Date(parseInt(ending_timestamp.toString())).getTime() * 1000,
              liquidity: new BigDecimal(liquidity),
              lockMultiplier: new BigDecimal(lock_multiplier),
            })),
            poolBalance: new BigDecimal(poolBalance),
          }
        }
        setSubscribedData.value({ accountData, lastUpdate: blockNumber })
      })
      .catch(setSubscribedData.error)
  }, [blockNumber, account, setSubscribedData, frax, subscribedData.fetching])

  return (
    <contractCtx.Provider value={contract.current}>
      <stateCtx.Provider
        value={useMemo(
          () => ({
            addresses: frax,
            static: staticData,
            subscribed: subscribedData,
          }),
          [frax, staticData, subscribedData],
        )}
      >
        {children}
      </stateCtx.Provider>
    </contractCtx.Provider>
  )
}
