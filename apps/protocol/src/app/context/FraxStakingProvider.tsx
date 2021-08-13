import React, { FC, createContext, useEffect, useRef, useMemo, useContext } from 'react'
import { BigNumber } from 'ethers'

import { ERC20, ERC20__factory, FraxCrossChainFarm, FraxCrossChainFarm__factory } from '@apps/artifacts/typechain'
import { FetchState, useFetchState } from '@apps/hooks'
import { BigDecimal } from '@apps/bigdecimal'

import { MaticMainnet, useNetworkAddresses } from '@apps/base/context/network'
import { useBlockNow } from '@apps/base/context/block'
import { useAccount, useSignerOrProvider } from '@apps/base/context/account'

export interface StakeData {
  earned: { address: string; amount: BigDecimal; symbol: string }[]
  combinedWeight: BigDecimal
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
  stakingToken: string
  lockMaxMultiplier: number
  lockTimeMax: number
  lockTimeMin: number
  reward0ForDuration: BigDecimal
  reward1ForDuration: BigDecimal
  rewardRate0: BigNumber
  rewardRate1: BigNumber
  totalCombinedWeight: BigDecimal
  totalStaked: BigDecimal
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
  const fraxAddresses = (addresses as MaticMainnet['addresses'])['FRAX']

  const signerOrProvider = useSignerOrProvider()
  const blockNumber = useBlockNow()

  const account = useAccount()
  const stakingContract = useRef<FraxCrossChainFarm>()
  const stakingToken = useRef<ERC20>()
  const feederPool = useRef<ERC20>()
  const [staticData, setStaticData] = useFetchState<StaticData>()
  const [subscribedData, setSubscribedData] = useFetchState<SubscribedData>()

  // Set/reset on network/signer change
  useEffect(() => {
    if (fraxAddresses && signerOrProvider) {
      stakingContract.current = FraxCrossChainFarm__factory.connect(fraxAddresses.stakingContract, signerOrProvider)
      feederPool.current = ERC20__factory.connect(fraxAddresses.feederPool, signerOrProvider)
      stakingToken.current = ERC20__factory.connect(fraxAddresses.stakingToken, signerOrProvider)
    } else {
      stakingContract.current = undefined
      feederPool.current = undefined
      stakingToken.current = undefined
      setStaticData.value()
      setSubscribedData.value()
    }
  }, [fraxAddresses, signerOrProvider, setStaticData, setSubscribedData])

  // Initial contract calls (once only)
  useEffect(() => {
    if (!stakingContract.current || !stakingToken.current || staticData.fetching || staticData.value) return

    setStaticData.fetching()

    Promise.all([
      stakingContract.current.lock_max_multiplier(),
      stakingContract.current.lock_time_for_max_multiplier(),
      stakingContract.current.lock_time_min(),
      stakingContract.current.getRewardForDuration(),
      stakingContract.current.totalCombinedWeight(),
      stakingContract.current.rewardRate0(),
      stakingContract.current.rewardRate1(),
      stakingToken.current.balanceOf(stakingContract.current.address),
    ])
      .then(
        ([lockMaxMultiplier, lockTimeMax, lockTimeMin, rewardForDuration, totalCombinedWeight, rewardRate0, rewardRate1, totalStaked]) => {
          if (!stakingContract.current) return
          setStaticData.value({
            address: stakingContract.current.address,
            stakingToken: fraxAddresses.stakingToken,
            lockMaxMultiplier: parseFloat(lockMaxMultiplier.toString()) / 1e18,
            lockTimeMax: parseInt(lockTimeMax.toString()),
            lockTimeMin: parseInt(lockTimeMin.toString()),
            reward0ForDuration: new BigDecimal(rewardForDuration[0]),
            reward1ForDuration: new BigDecimal(rewardForDuration[1]),
            rewardRate0,
            rewardRate1,
            totalCombinedWeight: new BigDecimal(totalCombinedWeight),
            totalStaked: new BigDecimal(totalStaked),
          })
        },
      )
      .catch(setStaticData.error)
  }, [setStaticData, staticData.fetching, staticData.value, fraxAddresses])

  // Contract calls on every block
  useEffect(() => {
    if (!fraxAddresses || !stakingContract.current || subscribedData.fetching) return

    Promise.all([
      account
        ? Promise.all([
            stakingContract.current.earned(account),
            stakingContract.current.combinedWeightOf(account),
            stakingContract.current.lockedStakesOf(account),
            stakingContract.current.lockedLiquidityOf(account),
            feederPool.current.balanceOf(account),
          ])
        : undefined,
    ])
      .then(([[earned, combinedWeight, lockedStakes, lockedLiquidity, poolBalance] = []]) => {
        let accountData: SubscribedData['accountData']
        if (earned && combinedWeight && lockedStakes && lockedLiquidity) {
          accountData = {
            earned: earned.map((amount, index) => {
              const address = index === 0 ? fraxAddresses.rewardsTokens[0] : fraxAddresses.rewardsTokens[1]
              return {
                address,
                symbol: address === fraxAddresses.rewardsTokens[0] ? 'FXS' : 'MTA',
                amount: new BigDecimal(amount), // Assumed 18 decimals (so far, we know it will be)
              }
            }),
            combinedWeight: new BigDecimal(combinedWeight),
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
  }, [blockNumber, account, setSubscribedData, fraxAddresses, subscribedData.fetching])

  return (
    <contractCtx.Provider value={stakingContract.current}>
      <stateCtx.Provider
        value={useMemo(
          () => ({
            addresses: fraxAddresses,
            static: staticData,
            subscribed: subscribedData,
          }),
          [fraxAddresses, staticData, subscribedData],
        )}
      >
        {children}
      </stateCtx.Provider>
    </contractCtx.Provider>
  )
}
