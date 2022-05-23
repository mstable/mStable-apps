import type {
  BoostDirector,
  BoostedVault,
  EmissionsController,
  ERC20,
  FeederPool,
  FeederWrapper,
  FraxCrossChainFarm,
  ISavingsContractV3,
  IUniswapV2Router02,
  Masset,
  MerkleDrop,
  SaveWrapper,
  StakingRewardsWithPlatformToken,
} from '@apps/artifacts/typechain'
import type { BigDecimal } from '@apps/bigdecimal'
import type { BigNumber } from 'ethers'

export type MassetName = 'musd' | 'mbtc'

export enum PoolType {
  User = 'user',
  Active = 'active',
  Deprecated = 'deprecated',
  Hidden = 'hidden',
}

export interface Purpose {
  present: string
  past: string
}

/* eslint-disable @typescript-eslint/no-shadow */
export enum Interfaces {
  Masset,
  ERC20,
  SavingsContract,
  SaveWrapper,
  UniswapRouter02,
  FeederPool,
  FeederWrapper,
  BoostDirector,
  FraxCrossChainFarm,
  StakingRewardsWithPlatformToken,
  MerkleDrop,
  EmissionsController,
  BoostedVault,
}

export interface Instances {
  [Interfaces.Masset]: Masset
  [Interfaces.ERC20]: ERC20
  [Interfaces.SavingsContract]: ISavingsContractV3
  [Interfaces.SaveWrapper]: SaveWrapper
  [Interfaces.UniswapRouter02]: IUniswapV2Router02
  [Interfaces.FeederPool]: FeederPool
  [Interfaces.FeederWrapper]: FeederWrapper
  [Interfaces.BoostedVault]: BoostedVault
  [Interfaces.BoostDirector]: BoostDirector
  [Interfaces.FraxCrossChainFarm]: FraxCrossChainFarm
  [Interfaces.StakingRewardsWithPlatformToken]: StakingRewardsWithPlatformToken
  [Interfaces.MerkleDrop]: MerkleDrop
  [Interfaces.EmissionsController]: EmissionsController
}

export interface Token {
  address: string
  decimals: number
  symbol: string
  name?: string
  totalSupply: BigDecimal
  price?: BigDecimal
}

export interface Allowances {
  [spender: string]: BigDecimal
}

export interface SubscribedToken extends Token {
  balance: BigDecimal
  allowances: Allowances
}

export interface AddressOption {
  address: string
  balance?: BigDecimal
  symbol?: string
  label?: string
  custom?: boolean
  tip?: string
}

export interface BoostedAPY {
  base: number
  maxBoost: number
  userBoost: number
}

export interface BoostedCombinedAPY {
  rewards: BoostedAPY
  platformRewards?: number
  base?: number
}

export interface FetchState<T> {
  fetching?: boolean
  value?: T
  error?: string
}

export interface LPPriceAdjustment {
  price: BigDecimal
  isInput: boolean
}

export interface PriceImpact {
  distancePercentage?: number
  impactPercentage: number
  showImpactWarning: boolean
}

export interface InputRatios {
  [address: string]: BigNumber
}

export interface ScaledInput {
  low: BigDecimal
  high: BigDecimal
  scaledLow: BigDecimal
  scaledHigh: BigDecimal
}

export interface ScaledInputs {
  values: { [address: string]: ScaledInput }
  lowTotal: BigDecimal
  highTotal: BigDecimal
  scaledHighTotal: BigDecimal
  scaledLowTotal: BigDecimal
}
