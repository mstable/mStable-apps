import { BigDecimal } from '@apps/bigdecimal'
import { PoolType } from '@apps/types'
import { BigNumber } from 'ethers'

import type { BoostedSavingsVaultAllFragment } from '@apps/artifacts/graphql/feeders'
import type { TokenAllFragment } from '@apps/artifacts/graphql/protocol'
import type { Tokens } from '@apps/base/context/tokens'
import type { MassetName, SubscribedToken } from '@apps/types'

import type { RawData } from './DataProvider'
import type {
  BassetState,
  BassetStatus,
  BoostedVaultState,
  DataState,
  FeederPoolAccountState,
  FeederPoolState,
  MassetState,
  SavingsContractState,
} from './types'

type NonNullableMasset = NonNullable<RawData['massets']>['massets'][number]

type NonNullableFeederPools = NonNullable<RawData['feederPools']>['feederPools']

type SavingsContractV1QueryResult = NonNullableMasset['savingsContractsV1'][number]

type SavingsContractV2QueryResult = NonNullableMasset['savingsContractsV2'][number]

const transformBasset = (
  basset: NonNullableMasset['basket']['bassets'][0],
  vaultBalances: RawData['vaultBalances'],
  tokens: Tokens,
): BassetState => {
  const {
    ratio,
    status,
    maxWeight,
    vaultBalance,
    isTransferFeeCharged,
    token: { address, totalSupply, decimals, symbol },
  } = basset
  return {
    address,
    isTransferFeeCharged,
    maxWeight: maxWeight ? BigNumber.from(maxWeight) : undefined,
    ratio: BigNumber.from(ratio),
    status: status as BassetStatus,
    totalVault: new BigDecimal(vaultBalances[address] ?? vaultBalance.exact, decimals),
    token: {
      balance: new BigDecimal(0, decimals),
      allowances: {},
      ...tokens[address],
      totalSupply: BigDecimal.fromMetric(totalSupply),
      address,
      decimals,
      symbol: transformTokenSymbol(symbol),
    },

    // Initial values
    balanceInMasset: new BigDecimal(0),
    basketShare: new BigDecimal(0),
    maxWeightInMasset: new BigDecimal(0),
    overweight: false,
    totalVaultInMasset: new BigDecimal(0),
  }
}

const transformBassets = (
  bassets: NonNullableMasset['basket']['bassets'],
  vaultBalances: RawData['vaultBalances'],
  tokens: Tokens,
): MassetState['bAssets'] => {
  return Object.fromEntries(bassets.map(basset => [basset.id, transformBasset(basset, vaultBalances, tokens)]))
}

const transformSavingsContractV1 = (
  savingsContract: SavingsContractV1QueryResult,
  tokens: Tokens,
  massetAddress: string,
  current: boolean,
): Extract<SavingsContractState, { version: 1 }> => {
  const { active, creditBalances, dailyAPY, id, latestExchangeRate, totalCredits, totalSavings, version } = savingsContract
  const creditBalance = creditBalances?.[0]

  return {
    active,
    current,
    address: id,
    creditBalance: creditBalance ? new BigDecimal(creditBalance.amount) : undefined,
    dailyAPY: parseFloat(dailyAPY),
    latestExchangeRate: latestExchangeRate
      ? {
          rate: BigDecimal.parse(latestExchangeRate.rate),
          timestamp: latestExchangeRate.timestamp,
        }
      : undefined,
    massetAddress,
    massetAllowance: tokens[massetAddress]?.allowances?.[id] ?? new BigDecimal(0),
    savingsBalance: {},
    totalCredits: BigDecimal.fromMetric(totalCredits as NonNullable<typeof totalCredits>),
    totalSavings: BigDecimal.fromMetric(totalSavings),
    version: version as 1,
  }
}

const transformBoostedSavingsVault = ({
  id: address,
  accounts,
  lastUpdateTime,
  lockupDuration,
  periodDuration,
  periodFinish,
  rewardPerTokenStored,
  rewardRate,
  rewardsToken,
  rewardAddedTransactions,
  stakingContract,
  stakingToken,
  totalStakingRewards,
  priceCoeff,
  boostCoeff,
  totalSupply,
  unlockPercentage,
  totalRaw,
  platformRewardPerTokenStored,
  platformRewardRate,
  platformRewardsToken,
}: NonNullable<
  BoostedSavingsVaultAllFragment & {
    priceCoeff?: string | null
    boostCoeff?: string | null
  }
>): BoostedVaultState => {
  let account: BoostedVaultState['account']

  // FIXME: - Replace this with something better
  const isImusd = address === '0x78befca7de27d07dc6e71da295cc2946681a6c7b' // imUSD vault address

  if (accounts?.[0]) {
    const [
      {
        boostedBalance: _boostedBalance,
        lastAction,
        lastClaim,
        rawBalance: _rawBalance,
        rewardCount,
        rewardEntries,
        rewardPerTokenPaid,
        rewards,
        platformRewards,
        platformRewardPerTokenPaid,
      },
    ] = accounts
    const boostedBalance = new BigDecimal(_boostedBalance)
    const rawBalance = new BigDecimal(_rawBalance)
    const boostMultiplier = !!boostedBalance.simple && !!rawBalance.simple ? boostedBalance.simple / rawBalance.simple : 1
    account = {
      boostedBalance,
      boostMultiplier: isImusd ? boostMultiplier * 2 : boostMultiplier,
      lastAction,
      lastClaim,
      rawBalance,
      rewardCount,
      rewardPerTokenPaid: BigNumber.from(rewardPerTokenPaid),
      rewards: BigNumber.from(rewards),
      rewardEntries: rewardEntries.map(({ rate, finish, index, start }) => ({
        rate: BigNumber.from(rate),
        finish,
        index,
        start,
      })),
      ...(platformRewards && platformRewardPerTokenPaid
        ? {
            platformRewardPerTokenPaid: BigNumber.from(platformRewardPerTokenPaid),
            platformRewards: BigNumber.from(platformRewards),
          }
        : {}),
    }
  }

  return {
    account,
    address,
    lastUpdateTime,
    lockupDuration,
    periodDuration,
    periodFinish,
    rewardPerTokenStored: BigNumber.from(rewardPerTokenStored),
    rewardRate: BigNumber.from(rewardRate),
    rewardAddedTransactions,
    stakingContract,
    stakingToken: {
      address: stakingToken.address,
      symbol: stakingToken.symbol,
    },
    rewardsToken: {
      address: rewardsToken.address,
      symbol: rewardsToken.symbol,
    },
    totalStakingRewards: BigDecimal.parse(totalStakingRewards),
    totalSupply: new BigDecimal(totalSupply),
    totalRaw: new BigDecimal(totalRaw ?? '0'),
    unlockPercentage: BigNumber.from(unlockPercentage),
    boostCoeff: boostCoeff ? parseFloat(boostCoeff) : undefined,
    priceCoeff: priceCoeff ? parseFloat(priceCoeff) : undefined,
    isImusd,
    ...(platformRewardsToken && platformRewardPerTokenStored && platformRewardRate
      ? {
          platformRewardsToken: {
            address: platformRewardsToken.address,
            symbol: platformRewardsToken.symbol,
          },
          platformRewardRate: BigNumber.from(platformRewardRate),
          platformRewardPerTokenStored: BigNumber.from(platformRewardPerTokenStored),
        }
      : {}),
  }
}

const transformSavingsContractV2 = (
  savingsContract: SavingsContractV2QueryResult & { boostedSavingsVaults: BoostedSavingsVaultAllFragment[] },
  tokens: Tokens,
  massetAddress: string,
  current: boolean,
): Extract<SavingsContractState, { version: 2 }> => {
  const { dailyAPY, id, latestExchangeRate, totalSavings, version, boostedSavingsVaults } = savingsContract

  return {
    active: true,
    current,
    address: id,
    dailyAPY: parseFloat(dailyAPY),
    latestExchangeRate: latestExchangeRate
      ? {
          rate: BigDecimal.parse(latestExchangeRate.rate),
          timestamp: latestExchangeRate.timestamp,
        }
      : {
          rate: BigDecimal.fromSimple(0.1),
          timestamp: Date.now(),
        },
    massetAddress,
    savingsBalance: {},
    token: tokens[id],
    totalSavings: BigDecimal.fromMetric(totalSavings),
    version: version as 2,
    boostedSavingsVault: boostedSavingsVaults[0] ? transformBoostedSavingsVault(boostedSavingsVaults[0]) : undefined,
  }
}

const transformTokenSymbol = (symbol: string): string => {
  const match = symbol.match(/^(\w+\/)?(?:(?:\(pos\) mstable (\w+))|(?:mstable (\w+) \(polygon pos\)))$/i)
  if (match) return `${match[1] ?? ''}m${match[2] ?? match[3]}`

  return symbol
}

const transformTokenData = ({ address, totalSupply, symbol, decimals }: TokenAllFragment, tokens: Tokens): SubscribedToken => ({
  balance: new BigDecimal(0, decimals),
  allowances: {},
  ...tokens[address],
  totalSupply: BigDecimal.fromMetric(totalSupply),
  address,
  decimals,
  symbol: transformTokenSymbol(symbol),
})

const transformFeederPoolAccountData = ({
  cumulativeEarned,
  cumulativeEarnedVault,
  balance,
  balanceVault,
  price,
  priceVault,
  lastUpdate,
  lastUpdateVault,
}: NonNullable<NonNullableFeederPools[number]['accounts']>[number]): FeederPoolAccountState => ({
  cumulativeEarned: BigDecimal.fromMetric(cumulativeEarned),
  cumulativeEarnedVault: BigDecimal.fromMetric(cumulativeEarnedVault),
  balance: new BigDecimal(balance),
  balanceVault: new BigDecimal(balanceVault),
  price: new BigDecimal(price),
  priceVault: new BigDecimal(priceVault),
  lastUpdate,
  lastUpdateVault,
})

const transformFeederPoolsData = (feederPools: NonNullableFeederPools, tokens: Tokens): MassetState['feederPools'] => {
  return Object.fromEntries(
    feederPools.map<[string, FeederPoolState]>(
      ({
        id: address,
        basket: { bassets, failed, undergoingRecol },
        fasset: fassetToken,
        masset: massetToken,
        price: priceStr = 0,
        token,
        dailyAPY,
        governanceFeeRate,
        invariantK,
        redemptionFeeRate,
        swapFeeRate,
        vault,
        accounts,
      }) => {
        const masset = transformBasset(
          bassets.find(b => b.token.address === massetToken.id) as NonNullableMasset['basket']['bassets'][0],
          {},
          tokens,
        )
        const fasset = transformBasset(
          bassets.find(b => b.token.address === fassetToken.id) as NonNullableMasset['basket']['bassets'][0],
          {},
          tokens,
        )

        const price = new BigDecimal(priceStr)

        const massetPrice = BigDecimal.ONE

        // Currently just for RAI
        const fassetPrice = fasset.token.symbol === 'RAI' ? massetPrice.mulRatioTruncate(fasset.ratio) : massetPrice

        let title = bassets
          .map(b => transformTokenSymbol(b.token.symbol))
          .sort(s => (s === 'mUSD' || s === 'mBTC' ? -1 : 1))
          .join('/')

        // fpMBTC/tBTCv2
        if (address === '0xc3280306b6218031e61752d060b091278d45c329') {
          title = `${title}v2`
        }

        let poolType: PoolType = PoolType.Active

        // Put tBTC to deprecated
        if (address === '0xb61a6f928b3f069a68469ddb670f20eeeb4921e0') {
          poolType = PoolType.Deprecated
        }

        return [
          address,
          {
            address,
            masset: { ...masset, feederPoolAddress: address },
            fasset: { ...fasset, feederPoolAddress: address, price: fassetPrice },
            token: { ...token, ...tokens[address] } as SubscribedToken,
            totalSupply: BigDecimal.fromMetric(fassetToken.totalSupply),
            governanceFeeRate: BigNumber.from(governanceFeeRate),
            liquidity: new BigDecimal(invariantK).mulTruncate(price.exact),
            feeRate: BigNumber.from(swapFeeRate),
            redemptionFeeRate: BigNumber.from(redemptionFeeRate),
            invariantK: BigNumber.from(invariantK),
            dailyApy: poolType === PoolType.Deprecated ? 0 : parseFloat(dailyAPY),
            price,
            failed,
            title,
            undergoingRecol,
            vault: vault && transformBoostedSavingsVault(vault),
            account: accounts?.length ? transformFeederPoolAccountData(accounts[0]) : undefined,
            poolType,
          },
        ]
      },
    ),
  )
}

const transformMassetData = (
  {
    redemptionFeeRate,
    invariantStartTime,
    invariantStartingCap,
    invariantCapFactor,
    token: { address },
    token,
    basket: { bassets: _bassets, collateralisationRatio, failed, removedBassets, undergoingRecol },
    savingsContractsV1: [savingsContractV1],
    savingsContractsV2: [savingsContractV2],
  }: NonNullable<RawData['massets']>['massets'][0],
  {
    boostDirectors,
    feederPools: allFeederPools,
    saveVaults,
    userVaults: _userVaults,
    vaultIds: _vaultIds,
  }: NonNullable<RawData['feederPools']>,
  vaultBalances: RawData['vaultBalances'],
  tokens: Tokens,
): MassetState => {
  const bAssets = transformBassets(_bassets, vaultBalances, tokens)

  const feederPools = transformFeederPoolsData(
    allFeederPools.filter(fp => fp.masset?.id === address),
    tokens,
  )

  // Vaults are on the feeder pools subgraph
  const boostedSavingsVaults = saveVaults.filter(v => v.stakingToken.address === savingsContractV2.id)

  const boostDirector = boostDirectors.length > 0 ? boostDirectors[0].id : undefined
  const userVaults = Object.fromEntries(_userVaults.map(v => [v.id, v.boostDirection.map(b => b.directorVaultId as number)]))
  const vaultIds = Object.fromEntries(_vaultIds.map(v => [v.directorVaultId ?? 0, v.id]))

  return {
    address,
    failed,
    invariantStartTime: invariantStartTime || undefined,
    invariantStartingCap: invariantStartingCap ? BigNumber.from(invariantStartingCap) : undefined,
    invariantCapFactor: invariantCapFactor ? BigNumber.from(invariantCapFactor) : undefined,
    undergoingRecol,
    token: transformTokenData(token, tokens),
    bAssets,
    removedBassets: Object.fromEntries(removedBassets.map(b => [b.token.address, transformTokenData(b.token, tokens)])),
    collateralisationRatio: collateralisationRatio ? BigNumber.from(collateralisationRatio) : undefined,
    feeRate: BigNumber.from(200000000000000),
    redemptionFeeRate: BigNumber.from(redemptionFeeRate),
    feederPools,
    hasFeederPools: Object.keys(feederPools).length > 0,
    savingsContracts: {
      v1: savingsContractV1 ? transformSavingsContractV1(savingsContractV1, tokens, address, false) : undefined,
      v2: transformSavingsContractV2({ ...savingsContractV2, boostedSavingsVaults }, tokens, address, true),
    },
    bassetRatios: Object.fromEntries(Object.values(bAssets).map(b => [b.address, b.ratio])),
    userVaults,
    vaultIds,
    boostDirector,
    // Initial values, set in recalculateState
    fAssets: {},
  }
}

export const transformRawData = ({ massets, feederPools, vaultBalances, tokens }: RawData): DataState => {
  if (!massets || !feederPools) return {}

  return Object.fromEntries(
    massets.massets.map(masset => {
      const massetName = transformTokenSymbol(masset.token.symbol).toLowerCase() as MassetName
      return [massetName, transformMassetData(masset, feederPools, vaultBalances, tokens)]
    }),
  )
}
