import { createContext, useContext, useEffect, useMemo, useRef } from 'react'

import { ERC20__factory, FraxCrossChainFarm__factory } from '@apps/artifacts/typechain'
import { useAccount, useSignerOrProvider } from '@apps/base/context/account'
import { useNetworkAddresses } from '@apps/base/context/network'
import { BigDecimal } from '@apps/bigdecimal'
import { useFetchState } from '@apps/hooks'
import { useEffectOnce, usePrevious } from 'react-use'
import { useBlockNumber } from 'wagmi'

import type { ERC20, FraxCrossChainFarm } from '@apps/artifacts/typechain'
import type { MaticMainnet } from '@apps/base/context/network'
import type { BoostedAPY } from '@apps/types'
import type { FetchState } from '@apps/types'
import type { FC } from 'react'

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
  staticData: FetchState<StaticData>
  subscribedData: FetchState<SubscribedData>
  rewards: FetchState<BoostedAPY>
}

const contractCtx = createContext<FraxCrossChainFarm | undefined>(null as never)
const stateCtx = createContext<State>({ staticData: {}, subscribedData: {}, rewards: {} })

export const useFraxStakingContract = (): FraxCrossChainFarm | undefined => useContext(contractCtx)
export const useFraxStakingState = (): State => useContext(stateCtx)

export const FraxStakingProvider: FC = ({ children }) => {
  const addresses = useNetworkAddresses()
  const fraxAddresses = (addresses as MaticMainnet['addresses'])['FRAX']

  const signerOrProvider = useSignerOrProvider()
  const { data: block } = useBlockNumber({ watch: true })
  const prevBlock = usePrevious(block)

  const account = useAccount()
  const stakingContract = useRef<FraxCrossChainFarm>()
  const feederPool = useRef<ERC20>()
  const [staticData, setStaticData] = useFetchState<StaticData>()
  const [subscribedData, setSubscribedData] = useFetchState<SubscribedData>()
  const [rewards, setRewards] = useFetchState<BoostedAPY>()

  // console.log('FraxStakingProvider ', account, feederPool.current, signerOrProvider, fraxAddresses)

  // Set/reset on network/signer change
  useEffect(() => {
    if (fraxAddresses && signerOrProvider) {
      stakingContract.current = FraxCrossChainFarm__factory.connect(fraxAddresses.stakingContract, signerOrProvider)
      feederPool.current = ERC20__factory.connect(fraxAddresses.feederPool, signerOrProvider)
    } else {
      stakingContract.current = undefined
      feederPool.current = undefined
      setStaticData.value()
      setSubscribedData.value()
    }
  }, [fraxAddresses, signerOrProvider, setStaticData, setSubscribedData])

  // Frax API call for rewards APYs
  useEffectOnce(() => {
    setRewards.fetching()
    fetch('https://api.frax.finance/pools')
      .then(res => {
        res
          .json()
          .then((json: { identifier: string; pairLink: string; apy?: string; apy_max?: string }[]) => {
            const poolData = json.find(p => p.identifier === 'mStable FRAX/mUSD')
            if (poolData) {
              setRewards.value({
                base: parseFloat(poolData.apy ?? '0'),
                maxBoost: parseFloat(poolData.apy_max ?? '0'),
                userBoost: 0,
              })
            }
          })
          .catch(setRewards.error)
      })
      .catch(setRewards.error)
  })

  // Initial contract calls (once only)
  useEffectOnce(() => {
    if (!stakingContract.current || staticData.fetching || staticData.value) return

    setStaticData.fetching()

    Promise.all([
      stakingContract.current.lock_max_multiplier(),
      stakingContract.current.lock_time_for_max_multiplier(),
      stakingContract.current.lock_time_min(),
    ])
      .then(([lockMaxMultiplier, lockTimeMax, lockTimeMin]) => {
        if (!stakingContract.current) return
        setStaticData.value({
          lockMaxMultiplier: parseFloat(lockMaxMultiplier.toString()) / 1e18,
          lockTimeMax: parseInt(lockTimeMax.toString()),
          lockTimeMin: parseInt(lockTimeMin.toString()),
        })
      })
      .catch(setStaticData.error)
  })

  // Contract calls on every block
  useEffect(() => {
    if (!fraxAddresses || !stakingContract.current || subscribedData.fetching || block === prevBlock) return

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
        setSubscribedData.value({ accountData, lastUpdate: block })
      })
      .catch(setSubscribedData.error)
  }, [account, block, fraxAddresses, prevBlock, setSubscribedData, subscribedData.fetching])

  return (
    <contractCtx.Provider value={stakingContract.current}>
      <stateCtx.Provider
        value={useMemo(
          () => ({
            staticData,
            subscribedData,
            rewards,
          }),
          [rewards, staticData, subscribedData],
        )}
      >
        {children}
      </stateCtx.Provider>
    </contractCtx.Provider>
  )
}
