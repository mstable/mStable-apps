import { BigNumber } from 'ethers';
import { BigDecimal } from '@apps/bigdecimal';
import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}

      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "Transaction": [
      "RewardPaidTransaction"
    ]
  }
};
      export default result;
    
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigDecimal: string;
  BigInt: string;
  BigNumber: BigNumber;
  Bytes: string;
  MstableBigDecimal: BigDecimal;
};




export type Account = {
  completedQuests: Array<CompletedQuest>;
  delegators: Array<StakedTokenAccount>;
  id: Scalars['ID'];
  lastAction: Scalars['Int'];
  permMultiplier: Scalars['Int'];
  permMultiplierSimple: Scalars['Float'];
  seasonMultiplier: Scalars['Int'];
  seasonMultiplierSimple: Scalars['Float'];
  stakedTokenAccounts: Array<StakedTokenAccount>;
  totalVotesAll: Scalars['BigInt'];
  totalVotesAllBD: Scalars['MstableBigDecimal'];
  totalVotesBPT: Scalars['BigInt'];
  totalVotesBPTBD: Scalars['MstableBigDecimal'];
  totalVotesMTA: Scalars['BigInt'];
  totalVotesMTABD: Scalars['MstableBigDecimal'];
};


export type AccountCompletedQuestsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<CompletedQuest_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<CompletedQuest_Filter>;
};


export type AccountDelegatorsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakedTokenAccount_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakedTokenAccount_Filter>;
};


export type AccountStakedTokenAccountsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakedTokenAccount_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakedTokenAccount_Filter>;
};

export type Account_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  totalVotesMTA?: Maybe<Scalars['BigInt']>;
  totalVotesMTA_not?: Maybe<Scalars['BigInt']>;
  totalVotesMTA_gt?: Maybe<Scalars['BigInt']>;
  totalVotesMTA_lt?: Maybe<Scalars['BigInt']>;
  totalVotesMTA_gte?: Maybe<Scalars['BigInt']>;
  totalVotesMTA_lte?: Maybe<Scalars['BigInt']>;
  totalVotesMTA_in?: Maybe<Array<Scalars['BigInt']>>;
  totalVotesMTA_not_in?: Maybe<Array<Scalars['BigInt']>>;
  totalVotesBPT?: Maybe<Scalars['BigInt']>;
  totalVotesBPT_not?: Maybe<Scalars['BigInt']>;
  totalVotesBPT_gt?: Maybe<Scalars['BigInt']>;
  totalVotesBPT_lt?: Maybe<Scalars['BigInt']>;
  totalVotesBPT_gte?: Maybe<Scalars['BigInt']>;
  totalVotesBPT_lte?: Maybe<Scalars['BigInt']>;
  totalVotesBPT_in?: Maybe<Array<Scalars['BigInt']>>;
  totalVotesBPT_not_in?: Maybe<Array<Scalars['BigInt']>>;
  totalVotesAll?: Maybe<Scalars['BigInt']>;
  totalVotesAll_not?: Maybe<Scalars['BigInt']>;
  totalVotesAll_gt?: Maybe<Scalars['BigInt']>;
  totalVotesAll_lt?: Maybe<Scalars['BigInt']>;
  totalVotesAll_gte?: Maybe<Scalars['BigInt']>;
  totalVotesAll_lte?: Maybe<Scalars['BigInt']>;
  totalVotesAll_in?: Maybe<Array<Scalars['BigInt']>>;
  totalVotesAll_not_in?: Maybe<Array<Scalars['BigInt']>>;
  lastAction?: Maybe<Scalars['Int']>;
  lastAction_not?: Maybe<Scalars['Int']>;
  lastAction_gt?: Maybe<Scalars['Int']>;
  lastAction_lt?: Maybe<Scalars['Int']>;
  lastAction_gte?: Maybe<Scalars['Int']>;
  lastAction_lte?: Maybe<Scalars['Int']>;
  lastAction_in?: Maybe<Array<Scalars['Int']>>;
  lastAction_not_in?: Maybe<Array<Scalars['Int']>>;
  permMultiplier?: Maybe<Scalars['Int']>;
  permMultiplier_not?: Maybe<Scalars['Int']>;
  permMultiplier_gt?: Maybe<Scalars['Int']>;
  permMultiplier_lt?: Maybe<Scalars['Int']>;
  permMultiplier_gte?: Maybe<Scalars['Int']>;
  permMultiplier_lte?: Maybe<Scalars['Int']>;
  permMultiplier_in?: Maybe<Array<Scalars['Int']>>;
  permMultiplier_not_in?: Maybe<Array<Scalars['Int']>>;
  seasonMultiplier?: Maybe<Scalars['Int']>;
  seasonMultiplier_not?: Maybe<Scalars['Int']>;
  seasonMultiplier_gt?: Maybe<Scalars['Int']>;
  seasonMultiplier_lt?: Maybe<Scalars['Int']>;
  seasonMultiplier_gte?: Maybe<Scalars['Int']>;
  seasonMultiplier_lte?: Maybe<Scalars['Int']>;
  seasonMultiplier_in?: Maybe<Array<Scalars['Int']>>;
  seasonMultiplier_not_in?: Maybe<Array<Scalars['Int']>>;
  completedQuests_?: Maybe<CompletedQuest_Filter>;
  stakedTokenAccounts_?: Maybe<StakedTokenAccount_Filter>;
  delegators_?: Maybe<StakedTokenAccount_Filter>;
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
};

export enum Account_OrderBy {
  Id = 'id',
  TotalVotesMta = 'totalVotesMTA',
  TotalVotesBpt = 'totalVotesBPT',
  TotalVotesAll = 'totalVotesAll',
  LastAction = 'lastAction',
  PermMultiplier = 'permMultiplier',
  SeasonMultiplier = 'seasonMultiplier',
  CompletedQuests = 'completedQuests',
  StakedTokenAccounts = 'stakedTokenAccounts',
  Delegators = 'delegators'
}




export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_Height = {
  hash?: Maybe<Scalars['Bytes']>;
  number?: Maybe<Scalars['Int']>;
  number_gte?: Maybe<Scalars['Int']>;
};


export type CompletedQuest = {
  id: Scalars['ID'];
  account: Account;
  quest: Quest;
  completedAt: Scalars['Int'];
};

export type CompletedQuest_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  account?: Maybe<Scalars['String']>;
  account_not?: Maybe<Scalars['String']>;
  account_gt?: Maybe<Scalars['String']>;
  account_lt?: Maybe<Scalars['String']>;
  account_gte?: Maybe<Scalars['String']>;
  account_lte?: Maybe<Scalars['String']>;
  account_in?: Maybe<Array<Scalars['String']>>;
  account_not_in?: Maybe<Array<Scalars['String']>>;
  account_contains?: Maybe<Scalars['String']>;
  account_contains_nocase?: Maybe<Scalars['String']>;
  account_not_contains?: Maybe<Scalars['String']>;
  account_not_contains_nocase?: Maybe<Scalars['String']>;
  account_starts_with?: Maybe<Scalars['String']>;
  account_starts_with_nocase?: Maybe<Scalars['String']>;
  account_not_starts_with?: Maybe<Scalars['String']>;
  account_not_starts_with_nocase?: Maybe<Scalars['String']>;
  account_ends_with?: Maybe<Scalars['String']>;
  account_ends_with_nocase?: Maybe<Scalars['String']>;
  account_not_ends_with?: Maybe<Scalars['String']>;
  account_not_ends_with_nocase?: Maybe<Scalars['String']>;
  account_?: Maybe<Account_Filter>;
  quest?: Maybe<Scalars['String']>;
  quest_not?: Maybe<Scalars['String']>;
  quest_gt?: Maybe<Scalars['String']>;
  quest_lt?: Maybe<Scalars['String']>;
  quest_gte?: Maybe<Scalars['String']>;
  quest_lte?: Maybe<Scalars['String']>;
  quest_in?: Maybe<Array<Scalars['String']>>;
  quest_not_in?: Maybe<Array<Scalars['String']>>;
  quest_contains?: Maybe<Scalars['String']>;
  quest_contains_nocase?: Maybe<Scalars['String']>;
  quest_not_contains?: Maybe<Scalars['String']>;
  quest_not_contains_nocase?: Maybe<Scalars['String']>;
  quest_starts_with?: Maybe<Scalars['String']>;
  quest_starts_with_nocase?: Maybe<Scalars['String']>;
  quest_not_starts_with?: Maybe<Scalars['String']>;
  quest_not_starts_with_nocase?: Maybe<Scalars['String']>;
  quest_ends_with?: Maybe<Scalars['String']>;
  quest_ends_with_nocase?: Maybe<Scalars['String']>;
  quest_not_ends_with?: Maybe<Scalars['String']>;
  quest_not_ends_with_nocase?: Maybe<Scalars['String']>;
  quest_?: Maybe<Quest_Filter>;
  completedAt?: Maybe<Scalars['Int']>;
  completedAt_not?: Maybe<Scalars['Int']>;
  completedAt_gt?: Maybe<Scalars['Int']>;
  completedAt_lt?: Maybe<Scalars['Int']>;
  completedAt_gte?: Maybe<Scalars['Int']>;
  completedAt_lte?: Maybe<Scalars['Int']>;
  completedAt_in?: Maybe<Array<Scalars['Int']>>;
  completedAt_not_in?: Maybe<Array<Scalars['Int']>>;
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
};

export enum CompletedQuest_OrderBy {
  Id = 'id',
  Account = 'account',
  Quest = 'quest',
  CompletedAt = 'completedAt'
}

export type Counter = {
  id: Scalars['ID'];
  /** Value of the counter; should be positive */
  value: Scalars['BigInt'];
};

export type Counter_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  value?: Maybe<Scalars['BigInt']>;
  value_not?: Maybe<Scalars['BigInt']>;
  value_gt?: Maybe<Scalars['BigInt']>;
  value_lt?: Maybe<Scalars['BigInt']>;
  value_gte?: Maybe<Scalars['BigInt']>;
  value_lte?: Maybe<Scalars['BigInt']>;
  value_in?: Maybe<Array<Scalars['BigInt']>>;
  value_not_in?: Maybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
};

export enum Counter_OrderBy {
  Id = 'id',
  Value = 'value'
}

export type Metric = {
  bigDecimal: Scalars['MstableBigDecimal'];
  /** Decimals used for the exact value (default: 18) */
  decimals: Scalars['Int'];
  /** Exact value of the metric, i.e. in base units as an integer */
  exact: Scalars['BigInt'];
  id: Scalars['ID'];
  /** Simple value of the metric, i.e. the exact value represented as a decimal */
  simple: Scalars['BigDecimal'];
};

export type Metric_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  exact?: Maybe<Scalars['BigInt']>;
  exact_not?: Maybe<Scalars['BigInt']>;
  exact_gt?: Maybe<Scalars['BigInt']>;
  exact_lt?: Maybe<Scalars['BigInt']>;
  exact_gte?: Maybe<Scalars['BigInt']>;
  exact_lte?: Maybe<Scalars['BigInt']>;
  exact_in?: Maybe<Array<Scalars['BigInt']>>;
  exact_not_in?: Maybe<Array<Scalars['BigInt']>>;
  decimals?: Maybe<Scalars['Int']>;
  decimals_not?: Maybe<Scalars['Int']>;
  decimals_gt?: Maybe<Scalars['Int']>;
  decimals_lt?: Maybe<Scalars['Int']>;
  decimals_gte?: Maybe<Scalars['Int']>;
  decimals_lte?: Maybe<Scalars['Int']>;
  decimals_in?: Maybe<Array<Scalars['Int']>>;
  decimals_not_in?: Maybe<Array<Scalars['Int']>>;
  simple?: Maybe<Scalars['BigDecimal']>;
  simple_not?: Maybe<Scalars['BigDecimal']>;
  simple_gt?: Maybe<Scalars['BigDecimal']>;
  simple_lt?: Maybe<Scalars['BigDecimal']>;
  simple_gte?: Maybe<Scalars['BigDecimal']>;
  simple_lte?: Maybe<Scalars['BigDecimal']>;
  simple_in?: Maybe<Array<Scalars['BigDecimal']>>;
  simple_not_in?: Maybe<Array<Scalars['BigDecimal']>>;
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
};

export enum Metric_OrderBy {
  Id = 'id',
  Exact = 'exact',
  Decimals = 'decimals',
  Simple = 'simple'
}


/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Query = {
  token?: Maybe<Token>;
  tokens: Array<Token>;
  metric?: Maybe<Metric>;
  metrics: Array<Metric>;
  counter?: Maybe<Counter>;
  counters: Array<Counter>;
  stakedTokenBalance?: Maybe<StakedTokenBalance>;
  stakedTokenBalances: Array<StakedTokenBalance>;
  quest?: Maybe<Quest>;
  quests: Array<Quest>;
  season?: Maybe<Season>;
  seasons: Array<Season>;
  completedQuest?: Maybe<CompletedQuest>;
  completedQuests: Array<CompletedQuest>;
  stakedToken?: Maybe<StakedToken>;
  stakedTokens: Array<StakedToken>;
  stakingRewards: Array<StakingRewards>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  stakedTokenAccount?: Maybe<StakedTokenAccount>;
  stakedTokenAccounts: Array<StakedTokenAccount>;
  questManager?: Maybe<QuestManager>;
  questManagers: Array<QuestManager>;
  rewardPaidTransaction?: Maybe<RewardPaidTransaction>;
  rewardPaidTransactions: Array<RewardPaidTransaction>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type QueryTokenArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTokensArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Token_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Token_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMetricArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMetricsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Metric_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Metric_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryCounterArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryCountersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Counter_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Counter_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryStakedTokenBalanceArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryStakedTokenBalancesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakedTokenBalance_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakedTokenBalance_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryQuestArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryQuestsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Quest_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Quest_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySeasonArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerySeasonsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Season_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Season_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryCompletedQuestArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryCompletedQuestsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<CompletedQuest_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<CompletedQuest_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryStakedTokenArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryStakedTokensArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakedToken_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakedToken_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryStakingRewardsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakingRewards_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakingRewards_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAccountArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryAccountsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Account_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Account_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryStakedTokenAccountArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryStakedTokenAccountsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakedTokenAccount_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakedTokenAccount_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryQuestManagerArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryQuestManagersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<QuestManager_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<QuestManager_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRewardPaidTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryRewardPaidTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<RewardPaidTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<RewardPaidTransaction_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Transaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Transaction_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Query_MetaArgs = {
  block?: Maybe<Block_Height>;
};

export type Quest = {
  id: Scalars['ID'];
  type: QuestType;
  multiplier: Scalars['Int'];
  status: QuestStatus;
  expiry: Scalars['Int'];
  season?: Maybe<Season>;
  completions: Array<CompletedQuest>;
};


export type QuestCompletionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<CompletedQuest_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<CompletedQuest_Filter>;
};

export type QuestManager = {
  id: Scalars['ID'];
  season: Season;
  questMaster: Scalars['Bytes'];
  questSigner?: Maybe<Scalars['Bytes']>;
};

export type QuestManager_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  season?: Maybe<Scalars['String']>;
  season_not?: Maybe<Scalars['String']>;
  season_gt?: Maybe<Scalars['String']>;
  season_lt?: Maybe<Scalars['String']>;
  season_gte?: Maybe<Scalars['String']>;
  season_lte?: Maybe<Scalars['String']>;
  season_in?: Maybe<Array<Scalars['String']>>;
  season_not_in?: Maybe<Array<Scalars['String']>>;
  season_contains?: Maybe<Scalars['String']>;
  season_contains_nocase?: Maybe<Scalars['String']>;
  season_not_contains?: Maybe<Scalars['String']>;
  season_not_contains_nocase?: Maybe<Scalars['String']>;
  season_starts_with?: Maybe<Scalars['String']>;
  season_starts_with_nocase?: Maybe<Scalars['String']>;
  season_not_starts_with?: Maybe<Scalars['String']>;
  season_not_starts_with_nocase?: Maybe<Scalars['String']>;
  season_ends_with?: Maybe<Scalars['String']>;
  season_ends_with_nocase?: Maybe<Scalars['String']>;
  season_not_ends_with?: Maybe<Scalars['String']>;
  season_not_ends_with_nocase?: Maybe<Scalars['String']>;
  season_?: Maybe<Season_Filter>;
  questMaster?: Maybe<Scalars['Bytes']>;
  questMaster_not?: Maybe<Scalars['Bytes']>;
  questMaster_in?: Maybe<Array<Scalars['Bytes']>>;
  questMaster_not_in?: Maybe<Array<Scalars['Bytes']>>;
  questMaster_contains?: Maybe<Scalars['Bytes']>;
  questMaster_not_contains?: Maybe<Scalars['Bytes']>;
  questSigner?: Maybe<Scalars['Bytes']>;
  questSigner_not?: Maybe<Scalars['Bytes']>;
  questSigner_in?: Maybe<Array<Scalars['Bytes']>>;
  questSigner_not_in?: Maybe<Array<Scalars['Bytes']>>;
  questSigner_contains?: Maybe<Scalars['Bytes']>;
  questSigner_not_contains?: Maybe<Scalars['Bytes']>;
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
};

export enum QuestManager_OrderBy {
  Id = 'id',
  Season = 'season',
  QuestMaster = 'questMaster',
  QuestSigner = 'questSigner'
}

export enum QuestStatus {
  Active = 'ACTIVE',
  Expired = 'EXPIRED'
}

export enum QuestType {
  Permanent = 'PERMANENT',
  Seasonal = 'SEASONAL'
}

export type Quest_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  type?: Maybe<QuestType>;
  type_not?: Maybe<QuestType>;
  type_in?: Maybe<Array<QuestType>>;
  type_not_in?: Maybe<Array<QuestType>>;
  multiplier?: Maybe<Scalars['Int']>;
  multiplier_not?: Maybe<Scalars['Int']>;
  multiplier_gt?: Maybe<Scalars['Int']>;
  multiplier_lt?: Maybe<Scalars['Int']>;
  multiplier_gte?: Maybe<Scalars['Int']>;
  multiplier_lte?: Maybe<Scalars['Int']>;
  multiplier_in?: Maybe<Array<Scalars['Int']>>;
  multiplier_not_in?: Maybe<Array<Scalars['Int']>>;
  status?: Maybe<QuestStatus>;
  status_not?: Maybe<QuestStatus>;
  status_in?: Maybe<Array<QuestStatus>>;
  status_not_in?: Maybe<Array<QuestStatus>>;
  expiry?: Maybe<Scalars['Int']>;
  expiry_not?: Maybe<Scalars['Int']>;
  expiry_gt?: Maybe<Scalars['Int']>;
  expiry_lt?: Maybe<Scalars['Int']>;
  expiry_gte?: Maybe<Scalars['Int']>;
  expiry_lte?: Maybe<Scalars['Int']>;
  expiry_in?: Maybe<Array<Scalars['Int']>>;
  expiry_not_in?: Maybe<Array<Scalars['Int']>>;
  season?: Maybe<Scalars['String']>;
  season_not?: Maybe<Scalars['String']>;
  season_gt?: Maybe<Scalars['String']>;
  season_lt?: Maybe<Scalars['String']>;
  season_gte?: Maybe<Scalars['String']>;
  season_lte?: Maybe<Scalars['String']>;
  season_in?: Maybe<Array<Scalars['String']>>;
  season_not_in?: Maybe<Array<Scalars['String']>>;
  season_contains?: Maybe<Scalars['String']>;
  season_contains_nocase?: Maybe<Scalars['String']>;
  season_not_contains?: Maybe<Scalars['String']>;
  season_not_contains_nocase?: Maybe<Scalars['String']>;
  season_starts_with?: Maybe<Scalars['String']>;
  season_starts_with_nocase?: Maybe<Scalars['String']>;
  season_not_starts_with?: Maybe<Scalars['String']>;
  season_not_starts_with_nocase?: Maybe<Scalars['String']>;
  season_ends_with?: Maybe<Scalars['String']>;
  season_ends_with_nocase?: Maybe<Scalars['String']>;
  season_not_ends_with?: Maybe<Scalars['String']>;
  season_not_ends_with_nocase?: Maybe<Scalars['String']>;
  season_?: Maybe<Season_Filter>;
  completions_?: Maybe<CompletedQuest_Filter>;
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
};

export enum Quest_OrderBy {
  Id = 'id',
  Type = 'type',
  Multiplier = 'multiplier',
  Status = 'status',
  Expiry = 'expiry',
  Season = 'season',
  Completions = 'completions'
}

export type RewardPaidTransaction = Transaction & {
  id: Scalars['ID'];
  hash: Scalars['Bytes'];
  sender: Scalars['Bytes'];
  block: Scalars['Int'];
  timestamp: Scalars['BigInt'];
  amount: Scalars['BigInt'];
  stakingRewards: StakingRewards;
};

export type RewardPaidTransaction_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  hash?: Maybe<Scalars['Bytes']>;
  hash_not?: Maybe<Scalars['Bytes']>;
  hash_in?: Maybe<Array<Scalars['Bytes']>>;
  hash_not_in?: Maybe<Array<Scalars['Bytes']>>;
  hash_contains?: Maybe<Scalars['Bytes']>;
  hash_not_contains?: Maybe<Scalars['Bytes']>;
  sender?: Maybe<Scalars['Bytes']>;
  sender_not?: Maybe<Scalars['Bytes']>;
  sender_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_not_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_contains?: Maybe<Scalars['Bytes']>;
  sender_not_contains?: Maybe<Scalars['Bytes']>;
  block?: Maybe<Scalars['Int']>;
  block_not?: Maybe<Scalars['Int']>;
  block_gt?: Maybe<Scalars['Int']>;
  block_lt?: Maybe<Scalars['Int']>;
  block_gte?: Maybe<Scalars['Int']>;
  block_lte?: Maybe<Scalars['Int']>;
  block_in?: Maybe<Array<Scalars['Int']>>;
  block_not_in?: Maybe<Array<Scalars['Int']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  amount?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  stakingRewards?: Maybe<Scalars['String']>;
  stakingRewards_not?: Maybe<Scalars['String']>;
  stakingRewards_gt?: Maybe<Scalars['String']>;
  stakingRewards_lt?: Maybe<Scalars['String']>;
  stakingRewards_gte?: Maybe<Scalars['String']>;
  stakingRewards_lte?: Maybe<Scalars['String']>;
  stakingRewards_in?: Maybe<Array<Scalars['String']>>;
  stakingRewards_not_in?: Maybe<Array<Scalars['String']>>;
  stakingRewards_contains?: Maybe<Scalars['String']>;
  stakingRewards_contains_nocase?: Maybe<Scalars['String']>;
  stakingRewards_not_contains?: Maybe<Scalars['String']>;
  stakingRewards_not_contains_nocase?: Maybe<Scalars['String']>;
  stakingRewards_starts_with?: Maybe<Scalars['String']>;
  stakingRewards_starts_with_nocase?: Maybe<Scalars['String']>;
  stakingRewards_not_starts_with?: Maybe<Scalars['String']>;
  stakingRewards_not_starts_with_nocase?: Maybe<Scalars['String']>;
  stakingRewards_ends_with?: Maybe<Scalars['String']>;
  stakingRewards_ends_with_nocase?: Maybe<Scalars['String']>;
  stakingRewards_not_ends_with?: Maybe<Scalars['String']>;
  stakingRewards_not_ends_with_nocase?: Maybe<Scalars['String']>;
  stakingRewards_?: Maybe<StakingRewards_Filter>;
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
};

export enum RewardPaidTransaction_OrderBy {
  Id = 'id',
  Hash = 'hash',
  Sender = 'sender',
  Block = 'block',
  Timestamp = 'timestamp',
  Amount = 'amount',
  StakingRewards = 'stakingRewards'
}

export type Season = {
  id: Scalars['ID'];
  seasonNumber: Scalars['Int'];
  startedAt: Scalars['Int'];
  endedAt?: Maybe<Scalars['Int']>;
  quests: Array<Quest>;
};


export type SeasonQuestsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Quest_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Quest_Filter>;
};

export type Season_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  seasonNumber?: Maybe<Scalars['Int']>;
  seasonNumber_not?: Maybe<Scalars['Int']>;
  seasonNumber_gt?: Maybe<Scalars['Int']>;
  seasonNumber_lt?: Maybe<Scalars['Int']>;
  seasonNumber_gte?: Maybe<Scalars['Int']>;
  seasonNumber_lte?: Maybe<Scalars['Int']>;
  seasonNumber_in?: Maybe<Array<Scalars['Int']>>;
  seasonNumber_not_in?: Maybe<Array<Scalars['Int']>>;
  startedAt?: Maybe<Scalars['Int']>;
  startedAt_not?: Maybe<Scalars['Int']>;
  startedAt_gt?: Maybe<Scalars['Int']>;
  startedAt_lt?: Maybe<Scalars['Int']>;
  startedAt_gte?: Maybe<Scalars['Int']>;
  startedAt_lte?: Maybe<Scalars['Int']>;
  startedAt_in?: Maybe<Array<Scalars['Int']>>;
  startedAt_not_in?: Maybe<Array<Scalars['Int']>>;
  endedAt?: Maybe<Scalars['Int']>;
  endedAt_not?: Maybe<Scalars['Int']>;
  endedAt_gt?: Maybe<Scalars['Int']>;
  endedAt_lt?: Maybe<Scalars['Int']>;
  endedAt_gte?: Maybe<Scalars['Int']>;
  endedAt_lte?: Maybe<Scalars['Int']>;
  endedAt_in?: Maybe<Array<Scalars['Int']>>;
  endedAt_not_in?: Maybe<Array<Scalars['Int']>>;
  quests_?: Maybe<Quest_Filter>;
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
};

export enum Season_OrderBy {
  Id = 'id',
  SeasonNumber = 'seasonNumber',
  StartedAt = 'startedAt',
  EndedAt = 'endedAt',
  Quests = 'quests'
}

export type StakedToken = {
  id: Scalars['ID'];
  token: Token;
  stakingToken: Token;
  stakingRewards: StakingRewards;
  questManager: QuestManager;
  COOLDOWN_SECONDS: Scalars['BigInt'];
  UNSTAKE_WINDOW: Scalars['BigInt'];
  collateralisationRatio: Scalars['BigInt'];
  slashingPercentage: Scalars['BigInt'];
  priceCoefficient?: Maybe<Scalars['BigInt']>;
  isStakedTokenBPT: Scalars['Boolean'];
  isStakedTokenMTA: Scalars['Boolean'];
  accounts: Array<StakedTokenAccount>;
};


export type StakedTokenAccountsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakedTokenAccount_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakedTokenAccount_Filter>;
};

export type StakedTokenAccount = {
  id: Scalars['ID'];
  account: Account;
  stakedToken: StakedToken;
  balance: StakedTokenBalance;
  delegatee?: Maybe<Account>;
  rewardPerTokenPaid?: Maybe<Scalars['BigInt']>;
  rewards?: Maybe<Scalars['BigInt']>;
};

export type StakedTokenAccount_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  account?: Maybe<Scalars['String']>;
  account_not?: Maybe<Scalars['String']>;
  account_gt?: Maybe<Scalars['String']>;
  account_lt?: Maybe<Scalars['String']>;
  account_gte?: Maybe<Scalars['String']>;
  account_lte?: Maybe<Scalars['String']>;
  account_in?: Maybe<Array<Scalars['String']>>;
  account_not_in?: Maybe<Array<Scalars['String']>>;
  account_contains?: Maybe<Scalars['String']>;
  account_contains_nocase?: Maybe<Scalars['String']>;
  account_not_contains?: Maybe<Scalars['String']>;
  account_not_contains_nocase?: Maybe<Scalars['String']>;
  account_starts_with?: Maybe<Scalars['String']>;
  account_starts_with_nocase?: Maybe<Scalars['String']>;
  account_not_starts_with?: Maybe<Scalars['String']>;
  account_not_starts_with_nocase?: Maybe<Scalars['String']>;
  account_ends_with?: Maybe<Scalars['String']>;
  account_ends_with_nocase?: Maybe<Scalars['String']>;
  account_not_ends_with?: Maybe<Scalars['String']>;
  account_not_ends_with_nocase?: Maybe<Scalars['String']>;
  account_?: Maybe<Account_Filter>;
  stakedToken?: Maybe<Scalars['String']>;
  stakedToken_not?: Maybe<Scalars['String']>;
  stakedToken_gt?: Maybe<Scalars['String']>;
  stakedToken_lt?: Maybe<Scalars['String']>;
  stakedToken_gte?: Maybe<Scalars['String']>;
  stakedToken_lte?: Maybe<Scalars['String']>;
  stakedToken_in?: Maybe<Array<Scalars['String']>>;
  stakedToken_not_in?: Maybe<Array<Scalars['String']>>;
  stakedToken_contains?: Maybe<Scalars['String']>;
  stakedToken_contains_nocase?: Maybe<Scalars['String']>;
  stakedToken_not_contains?: Maybe<Scalars['String']>;
  stakedToken_not_contains_nocase?: Maybe<Scalars['String']>;
  stakedToken_starts_with?: Maybe<Scalars['String']>;
  stakedToken_starts_with_nocase?: Maybe<Scalars['String']>;
  stakedToken_not_starts_with?: Maybe<Scalars['String']>;
  stakedToken_not_starts_with_nocase?: Maybe<Scalars['String']>;
  stakedToken_ends_with?: Maybe<Scalars['String']>;
  stakedToken_ends_with_nocase?: Maybe<Scalars['String']>;
  stakedToken_not_ends_with?: Maybe<Scalars['String']>;
  stakedToken_not_ends_with_nocase?: Maybe<Scalars['String']>;
  stakedToken_?: Maybe<StakedToken_Filter>;
  balance?: Maybe<Scalars['String']>;
  balance_not?: Maybe<Scalars['String']>;
  balance_gt?: Maybe<Scalars['String']>;
  balance_lt?: Maybe<Scalars['String']>;
  balance_gte?: Maybe<Scalars['String']>;
  balance_lte?: Maybe<Scalars['String']>;
  balance_in?: Maybe<Array<Scalars['String']>>;
  balance_not_in?: Maybe<Array<Scalars['String']>>;
  balance_contains?: Maybe<Scalars['String']>;
  balance_contains_nocase?: Maybe<Scalars['String']>;
  balance_not_contains?: Maybe<Scalars['String']>;
  balance_not_contains_nocase?: Maybe<Scalars['String']>;
  balance_starts_with?: Maybe<Scalars['String']>;
  balance_starts_with_nocase?: Maybe<Scalars['String']>;
  balance_not_starts_with?: Maybe<Scalars['String']>;
  balance_not_starts_with_nocase?: Maybe<Scalars['String']>;
  balance_ends_with?: Maybe<Scalars['String']>;
  balance_ends_with_nocase?: Maybe<Scalars['String']>;
  balance_not_ends_with?: Maybe<Scalars['String']>;
  balance_not_ends_with_nocase?: Maybe<Scalars['String']>;
  balance_?: Maybe<StakedTokenBalance_Filter>;
  delegatee?: Maybe<Scalars['String']>;
  delegatee_not?: Maybe<Scalars['String']>;
  delegatee_gt?: Maybe<Scalars['String']>;
  delegatee_lt?: Maybe<Scalars['String']>;
  delegatee_gte?: Maybe<Scalars['String']>;
  delegatee_lte?: Maybe<Scalars['String']>;
  delegatee_in?: Maybe<Array<Scalars['String']>>;
  delegatee_not_in?: Maybe<Array<Scalars['String']>>;
  delegatee_contains?: Maybe<Scalars['String']>;
  delegatee_contains_nocase?: Maybe<Scalars['String']>;
  delegatee_not_contains?: Maybe<Scalars['String']>;
  delegatee_not_contains_nocase?: Maybe<Scalars['String']>;
  delegatee_starts_with?: Maybe<Scalars['String']>;
  delegatee_starts_with_nocase?: Maybe<Scalars['String']>;
  delegatee_not_starts_with?: Maybe<Scalars['String']>;
  delegatee_not_starts_with_nocase?: Maybe<Scalars['String']>;
  delegatee_ends_with?: Maybe<Scalars['String']>;
  delegatee_ends_with_nocase?: Maybe<Scalars['String']>;
  delegatee_not_ends_with?: Maybe<Scalars['String']>;
  delegatee_not_ends_with_nocase?: Maybe<Scalars['String']>;
  delegatee_?: Maybe<Account_Filter>;
  rewardPerTokenPaid?: Maybe<Scalars['BigInt']>;
  rewardPerTokenPaid_not?: Maybe<Scalars['BigInt']>;
  rewardPerTokenPaid_gt?: Maybe<Scalars['BigInt']>;
  rewardPerTokenPaid_lt?: Maybe<Scalars['BigInt']>;
  rewardPerTokenPaid_gte?: Maybe<Scalars['BigInt']>;
  rewardPerTokenPaid_lte?: Maybe<Scalars['BigInt']>;
  rewardPerTokenPaid_in?: Maybe<Array<Scalars['BigInt']>>;
  rewardPerTokenPaid_not_in?: Maybe<Array<Scalars['BigInt']>>;
  rewards?: Maybe<Scalars['BigInt']>;
  rewards_not?: Maybe<Scalars['BigInt']>;
  rewards_gt?: Maybe<Scalars['BigInt']>;
  rewards_lt?: Maybe<Scalars['BigInt']>;
  rewards_gte?: Maybe<Scalars['BigInt']>;
  rewards_lte?: Maybe<Scalars['BigInt']>;
  rewards_in?: Maybe<Array<Scalars['BigInt']>>;
  rewards_not_in?: Maybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
};

export enum StakedTokenAccount_OrderBy {
  Id = 'id',
  Account = 'account',
  StakedToken = 'stakedToken',
  Balance = 'balance',
  Delegatee = 'delegatee',
  RewardPerTokenPaid = 'rewardPerTokenPaid',
  Rewards = 'rewards'
}

export type StakedTokenBalance = {
  account: StakedTokenAccount;
  cooldownTimestamp: Scalars['Int'];
  cooldownUnits: Scalars['BigInt'];
  id: Scalars['ID'];
  questMultiplier: Scalars['Int'];
  questMultiplierSimple: Scalars['Float'];
  raw: Scalars['BigInt'];
  rawBD: Scalars['MstableBigDecimal'];
  stakedToken: StakedToken;
  timeMultiplier: Scalars['Int'];
  timeMultiplierSimple: Scalars['Float'];
  userPriceCoefficient: Scalars['BigInt'];
  votes: Scalars['BigInt'];
  votesBD: Scalars['MstableBigDecimal'];
  weightedTimestamp: Scalars['Int'];
};

export type StakedTokenBalance_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  account?: Maybe<Scalars['String']>;
  account_not?: Maybe<Scalars['String']>;
  account_gt?: Maybe<Scalars['String']>;
  account_lt?: Maybe<Scalars['String']>;
  account_gte?: Maybe<Scalars['String']>;
  account_lte?: Maybe<Scalars['String']>;
  account_in?: Maybe<Array<Scalars['String']>>;
  account_not_in?: Maybe<Array<Scalars['String']>>;
  account_contains?: Maybe<Scalars['String']>;
  account_contains_nocase?: Maybe<Scalars['String']>;
  account_not_contains?: Maybe<Scalars['String']>;
  account_not_contains_nocase?: Maybe<Scalars['String']>;
  account_starts_with?: Maybe<Scalars['String']>;
  account_starts_with_nocase?: Maybe<Scalars['String']>;
  account_not_starts_with?: Maybe<Scalars['String']>;
  account_not_starts_with_nocase?: Maybe<Scalars['String']>;
  account_ends_with?: Maybe<Scalars['String']>;
  account_ends_with_nocase?: Maybe<Scalars['String']>;
  account_not_ends_with?: Maybe<Scalars['String']>;
  account_not_ends_with_nocase?: Maybe<Scalars['String']>;
  account_?: Maybe<StakedTokenAccount_Filter>;
  stakedToken?: Maybe<Scalars['String']>;
  stakedToken_not?: Maybe<Scalars['String']>;
  stakedToken_gt?: Maybe<Scalars['String']>;
  stakedToken_lt?: Maybe<Scalars['String']>;
  stakedToken_gte?: Maybe<Scalars['String']>;
  stakedToken_lte?: Maybe<Scalars['String']>;
  stakedToken_in?: Maybe<Array<Scalars['String']>>;
  stakedToken_not_in?: Maybe<Array<Scalars['String']>>;
  stakedToken_contains?: Maybe<Scalars['String']>;
  stakedToken_contains_nocase?: Maybe<Scalars['String']>;
  stakedToken_not_contains?: Maybe<Scalars['String']>;
  stakedToken_not_contains_nocase?: Maybe<Scalars['String']>;
  stakedToken_starts_with?: Maybe<Scalars['String']>;
  stakedToken_starts_with_nocase?: Maybe<Scalars['String']>;
  stakedToken_not_starts_with?: Maybe<Scalars['String']>;
  stakedToken_not_starts_with_nocase?: Maybe<Scalars['String']>;
  stakedToken_ends_with?: Maybe<Scalars['String']>;
  stakedToken_ends_with_nocase?: Maybe<Scalars['String']>;
  stakedToken_not_ends_with?: Maybe<Scalars['String']>;
  stakedToken_not_ends_with_nocase?: Maybe<Scalars['String']>;
  stakedToken_?: Maybe<StakedToken_Filter>;
  raw?: Maybe<Scalars['BigInt']>;
  raw_not?: Maybe<Scalars['BigInt']>;
  raw_gt?: Maybe<Scalars['BigInt']>;
  raw_lt?: Maybe<Scalars['BigInt']>;
  raw_gte?: Maybe<Scalars['BigInt']>;
  raw_lte?: Maybe<Scalars['BigInt']>;
  raw_in?: Maybe<Array<Scalars['BigInt']>>;
  raw_not_in?: Maybe<Array<Scalars['BigInt']>>;
  weightedTimestamp?: Maybe<Scalars['Int']>;
  weightedTimestamp_not?: Maybe<Scalars['Int']>;
  weightedTimestamp_gt?: Maybe<Scalars['Int']>;
  weightedTimestamp_lt?: Maybe<Scalars['Int']>;
  weightedTimestamp_gte?: Maybe<Scalars['Int']>;
  weightedTimestamp_lte?: Maybe<Scalars['Int']>;
  weightedTimestamp_in?: Maybe<Array<Scalars['Int']>>;
  weightedTimestamp_not_in?: Maybe<Array<Scalars['Int']>>;
  questMultiplier?: Maybe<Scalars['Int']>;
  questMultiplier_not?: Maybe<Scalars['Int']>;
  questMultiplier_gt?: Maybe<Scalars['Int']>;
  questMultiplier_lt?: Maybe<Scalars['Int']>;
  questMultiplier_gte?: Maybe<Scalars['Int']>;
  questMultiplier_lte?: Maybe<Scalars['Int']>;
  questMultiplier_in?: Maybe<Array<Scalars['Int']>>;
  questMultiplier_not_in?: Maybe<Array<Scalars['Int']>>;
  timeMultiplier?: Maybe<Scalars['Int']>;
  timeMultiplier_not?: Maybe<Scalars['Int']>;
  timeMultiplier_gt?: Maybe<Scalars['Int']>;
  timeMultiplier_lt?: Maybe<Scalars['Int']>;
  timeMultiplier_gte?: Maybe<Scalars['Int']>;
  timeMultiplier_lte?: Maybe<Scalars['Int']>;
  timeMultiplier_in?: Maybe<Array<Scalars['Int']>>;
  timeMultiplier_not_in?: Maybe<Array<Scalars['Int']>>;
  cooldownTimestamp?: Maybe<Scalars['Int']>;
  cooldownTimestamp_not?: Maybe<Scalars['Int']>;
  cooldownTimestamp_gt?: Maybe<Scalars['Int']>;
  cooldownTimestamp_lt?: Maybe<Scalars['Int']>;
  cooldownTimestamp_gte?: Maybe<Scalars['Int']>;
  cooldownTimestamp_lte?: Maybe<Scalars['Int']>;
  cooldownTimestamp_in?: Maybe<Array<Scalars['Int']>>;
  cooldownTimestamp_not_in?: Maybe<Array<Scalars['Int']>>;
  cooldownUnits?: Maybe<Scalars['BigInt']>;
  cooldownUnits_not?: Maybe<Scalars['BigInt']>;
  cooldownUnits_gt?: Maybe<Scalars['BigInt']>;
  cooldownUnits_lt?: Maybe<Scalars['BigInt']>;
  cooldownUnits_gte?: Maybe<Scalars['BigInt']>;
  cooldownUnits_lte?: Maybe<Scalars['BigInt']>;
  cooldownUnits_in?: Maybe<Array<Scalars['BigInt']>>;
  cooldownUnits_not_in?: Maybe<Array<Scalars['BigInt']>>;
  votes?: Maybe<Scalars['BigInt']>;
  votes_not?: Maybe<Scalars['BigInt']>;
  votes_gt?: Maybe<Scalars['BigInt']>;
  votes_lt?: Maybe<Scalars['BigInt']>;
  votes_gte?: Maybe<Scalars['BigInt']>;
  votes_lte?: Maybe<Scalars['BigInt']>;
  votes_in?: Maybe<Array<Scalars['BigInt']>>;
  votes_not_in?: Maybe<Array<Scalars['BigInt']>>;
  userPriceCoefficient?: Maybe<Scalars['BigInt']>;
  userPriceCoefficient_not?: Maybe<Scalars['BigInt']>;
  userPriceCoefficient_gt?: Maybe<Scalars['BigInt']>;
  userPriceCoefficient_lt?: Maybe<Scalars['BigInt']>;
  userPriceCoefficient_gte?: Maybe<Scalars['BigInt']>;
  userPriceCoefficient_lte?: Maybe<Scalars['BigInt']>;
  userPriceCoefficient_in?: Maybe<Array<Scalars['BigInt']>>;
  userPriceCoefficient_not_in?: Maybe<Array<Scalars['BigInt']>>;
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
};

export enum StakedTokenBalance_OrderBy {
  Id = 'id',
  Account = 'account',
  StakedToken = 'stakedToken',
  Raw = 'raw',
  WeightedTimestamp = 'weightedTimestamp',
  QuestMultiplier = 'questMultiplier',
  TimeMultiplier = 'timeMultiplier',
  CooldownTimestamp = 'cooldownTimestamp',
  CooldownUnits = 'cooldownUnits',
  Votes = 'votes',
  UserPriceCoefficient = 'userPriceCoefficient'
}

export type StakedToken_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  token?: Maybe<Scalars['String']>;
  token_not?: Maybe<Scalars['String']>;
  token_gt?: Maybe<Scalars['String']>;
  token_lt?: Maybe<Scalars['String']>;
  token_gte?: Maybe<Scalars['String']>;
  token_lte?: Maybe<Scalars['String']>;
  token_in?: Maybe<Array<Scalars['String']>>;
  token_not_in?: Maybe<Array<Scalars['String']>>;
  token_contains?: Maybe<Scalars['String']>;
  token_contains_nocase?: Maybe<Scalars['String']>;
  token_not_contains?: Maybe<Scalars['String']>;
  token_not_contains_nocase?: Maybe<Scalars['String']>;
  token_starts_with?: Maybe<Scalars['String']>;
  token_starts_with_nocase?: Maybe<Scalars['String']>;
  token_not_starts_with?: Maybe<Scalars['String']>;
  token_not_starts_with_nocase?: Maybe<Scalars['String']>;
  token_ends_with?: Maybe<Scalars['String']>;
  token_ends_with_nocase?: Maybe<Scalars['String']>;
  token_not_ends_with?: Maybe<Scalars['String']>;
  token_not_ends_with_nocase?: Maybe<Scalars['String']>;
  token_?: Maybe<Token_Filter>;
  stakingToken?: Maybe<Scalars['String']>;
  stakingToken_not?: Maybe<Scalars['String']>;
  stakingToken_gt?: Maybe<Scalars['String']>;
  stakingToken_lt?: Maybe<Scalars['String']>;
  stakingToken_gte?: Maybe<Scalars['String']>;
  stakingToken_lte?: Maybe<Scalars['String']>;
  stakingToken_in?: Maybe<Array<Scalars['String']>>;
  stakingToken_not_in?: Maybe<Array<Scalars['String']>>;
  stakingToken_contains?: Maybe<Scalars['String']>;
  stakingToken_contains_nocase?: Maybe<Scalars['String']>;
  stakingToken_not_contains?: Maybe<Scalars['String']>;
  stakingToken_not_contains_nocase?: Maybe<Scalars['String']>;
  stakingToken_starts_with?: Maybe<Scalars['String']>;
  stakingToken_starts_with_nocase?: Maybe<Scalars['String']>;
  stakingToken_not_starts_with?: Maybe<Scalars['String']>;
  stakingToken_not_starts_with_nocase?: Maybe<Scalars['String']>;
  stakingToken_ends_with?: Maybe<Scalars['String']>;
  stakingToken_ends_with_nocase?: Maybe<Scalars['String']>;
  stakingToken_not_ends_with?: Maybe<Scalars['String']>;
  stakingToken_not_ends_with_nocase?: Maybe<Scalars['String']>;
  stakingToken_?: Maybe<Token_Filter>;
  stakingRewards?: Maybe<Scalars['String']>;
  stakingRewards_not?: Maybe<Scalars['String']>;
  stakingRewards_gt?: Maybe<Scalars['String']>;
  stakingRewards_lt?: Maybe<Scalars['String']>;
  stakingRewards_gte?: Maybe<Scalars['String']>;
  stakingRewards_lte?: Maybe<Scalars['String']>;
  stakingRewards_in?: Maybe<Array<Scalars['String']>>;
  stakingRewards_not_in?: Maybe<Array<Scalars['String']>>;
  stakingRewards_contains?: Maybe<Scalars['String']>;
  stakingRewards_contains_nocase?: Maybe<Scalars['String']>;
  stakingRewards_not_contains?: Maybe<Scalars['String']>;
  stakingRewards_not_contains_nocase?: Maybe<Scalars['String']>;
  stakingRewards_starts_with?: Maybe<Scalars['String']>;
  stakingRewards_starts_with_nocase?: Maybe<Scalars['String']>;
  stakingRewards_not_starts_with?: Maybe<Scalars['String']>;
  stakingRewards_not_starts_with_nocase?: Maybe<Scalars['String']>;
  stakingRewards_ends_with?: Maybe<Scalars['String']>;
  stakingRewards_ends_with_nocase?: Maybe<Scalars['String']>;
  stakingRewards_not_ends_with?: Maybe<Scalars['String']>;
  stakingRewards_not_ends_with_nocase?: Maybe<Scalars['String']>;
  stakingRewards_?: Maybe<StakingRewards_Filter>;
  questManager?: Maybe<Scalars['String']>;
  questManager_not?: Maybe<Scalars['String']>;
  questManager_gt?: Maybe<Scalars['String']>;
  questManager_lt?: Maybe<Scalars['String']>;
  questManager_gte?: Maybe<Scalars['String']>;
  questManager_lte?: Maybe<Scalars['String']>;
  questManager_in?: Maybe<Array<Scalars['String']>>;
  questManager_not_in?: Maybe<Array<Scalars['String']>>;
  questManager_contains?: Maybe<Scalars['String']>;
  questManager_contains_nocase?: Maybe<Scalars['String']>;
  questManager_not_contains?: Maybe<Scalars['String']>;
  questManager_not_contains_nocase?: Maybe<Scalars['String']>;
  questManager_starts_with?: Maybe<Scalars['String']>;
  questManager_starts_with_nocase?: Maybe<Scalars['String']>;
  questManager_not_starts_with?: Maybe<Scalars['String']>;
  questManager_not_starts_with_nocase?: Maybe<Scalars['String']>;
  questManager_ends_with?: Maybe<Scalars['String']>;
  questManager_ends_with_nocase?: Maybe<Scalars['String']>;
  questManager_not_ends_with?: Maybe<Scalars['String']>;
  questManager_not_ends_with_nocase?: Maybe<Scalars['String']>;
  questManager_?: Maybe<QuestManager_Filter>;
  COOLDOWN_SECONDS?: Maybe<Scalars['BigInt']>;
  COOLDOWN_SECONDS_not?: Maybe<Scalars['BigInt']>;
  COOLDOWN_SECONDS_gt?: Maybe<Scalars['BigInt']>;
  COOLDOWN_SECONDS_lt?: Maybe<Scalars['BigInt']>;
  COOLDOWN_SECONDS_gte?: Maybe<Scalars['BigInt']>;
  COOLDOWN_SECONDS_lte?: Maybe<Scalars['BigInt']>;
  COOLDOWN_SECONDS_in?: Maybe<Array<Scalars['BigInt']>>;
  COOLDOWN_SECONDS_not_in?: Maybe<Array<Scalars['BigInt']>>;
  UNSTAKE_WINDOW?: Maybe<Scalars['BigInt']>;
  UNSTAKE_WINDOW_not?: Maybe<Scalars['BigInt']>;
  UNSTAKE_WINDOW_gt?: Maybe<Scalars['BigInt']>;
  UNSTAKE_WINDOW_lt?: Maybe<Scalars['BigInt']>;
  UNSTAKE_WINDOW_gte?: Maybe<Scalars['BigInt']>;
  UNSTAKE_WINDOW_lte?: Maybe<Scalars['BigInt']>;
  UNSTAKE_WINDOW_in?: Maybe<Array<Scalars['BigInt']>>;
  UNSTAKE_WINDOW_not_in?: Maybe<Array<Scalars['BigInt']>>;
  collateralisationRatio?: Maybe<Scalars['BigInt']>;
  collateralisationRatio_not?: Maybe<Scalars['BigInt']>;
  collateralisationRatio_gt?: Maybe<Scalars['BigInt']>;
  collateralisationRatio_lt?: Maybe<Scalars['BigInt']>;
  collateralisationRatio_gte?: Maybe<Scalars['BigInt']>;
  collateralisationRatio_lte?: Maybe<Scalars['BigInt']>;
  collateralisationRatio_in?: Maybe<Array<Scalars['BigInt']>>;
  collateralisationRatio_not_in?: Maybe<Array<Scalars['BigInt']>>;
  slashingPercentage?: Maybe<Scalars['BigInt']>;
  slashingPercentage_not?: Maybe<Scalars['BigInt']>;
  slashingPercentage_gt?: Maybe<Scalars['BigInt']>;
  slashingPercentage_lt?: Maybe<Scalars['BigInt']>;
  slashingPercentage_gte?: Maybe<Scalars['BigInt']>;
  slashingPercentage_lte?: Maybe<Scalars['BigInt']>;
  slashingPercentage_in?: Maybe<Array<Scalars['BigInt']>>;
  slashingPercentage_not_in?: Maybe<Array<Scalars['BigInt']>>;
  priceCoefficient?: Maybe<Scalars['BigInt']>;
  priceCoefficient_not?: Maybe<Scalars['BigInt']>;
  priceCoefficient_gt?: Maybe<Scalars['BigInt']>;
  priceCoefficient_lt?: Maybe<Scalars['BigInt']>;
  priceCoefficient_gte?: Maybe<Scalars['BigInt']>;
  priceCoefficient_lte?: Maybe<Scalars['BigInt']>;
  priceCoefficient_in?: Maybe<Array<Scalars['BigInt']>>;
  priceCoefficient_not_in?: Maybe<Array<Scalars['BigInt']>>;
  isStakedTokenBPT?: Maybe<Scalars['Boolean']>;
  isStakedTokenBPT_not?: Maybe<Scalars['Boolean']>;
  isStakedTokenBPT_in?: Maybe<Array<Scalars['Boolean']>>;
  isStakedTokenBPT_not_in?: Maybe<Array<Scalars['Boolean']>>;
  isStakedTokenMTA?: Maybe<Scalars['Boolean']>;
  isStakedTokenMTA_not?: Maybe<Scalars['Boolean']>;
  isStakedTokenMTA_in?: Maybe<Array<Scalars['Boolean']>>;
  isStakedTokenMTA_not_in?: Maybe<Array<Scalars['Boolean']>>;
  accounts_?: Maybe<StakedTokenAccount_Filter>;
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
};

export enum StakedToken_OrderBy {
  Id = 'id',
  Token = 'token',
  StakingToken = 'stakingToken',
  StakingRewards = 'stakingRewards',
  QuestManager = 'questManager',
  CooldownSeconds = 'COOLDOWN_SECONDS',
  UnstakeWindow = 'UNSTAKE_WINDOW',
  CollateralisationRatio = 'collateralisationRatio',
  SlashingPercentage = 'slashingPercentage',
  PriceCoefficient = 'priceCoefficient',
  IsStakedTokenBpt = 'isStakedTokenBPT',
  IsStakedTokenMta = 'isStakedTokenMTA',
  Accounts = 'accounts'
}

export type StakingRewards = {
  id: Scalars['ID'];
  periodFinish: Scalars['Int'];
  lastUpdateTime: Scalars['Int'];
  rewardRate: Scalars['BigInt'];
  rewardPerTokenStored: Scalars['BigInt'];
  rewardsToken: Token;
  rewardsTokenVendor: Scalars['Bytes'];
  rewardsDistributor: Scalars['Bytes'];
  pendingAdditionalReward: Scalars['BigInt'];
  DURATION?: Maybe<Scalars['Int']>;
  rewardPaidTransactions: Array<RewardPaidTransaction>;
};


export type StakingRewardsRewardPaidTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<RewardPaidTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<RewardPaidTransaction_Filter>;
};

export type StakingRewards_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  periodFinish?: Maybe<Scalars['Int']>;
  periodFinish_not?: Maybe<Scalars['Int']>;
  periodFinish_gt?: Maybe<Scalars['Int']>;
  periodFinish_lt?: Maybe<Scalars['Int']>;
  periodFinish_gte?: Maybe<Scalars['Int']>;
  periodFinish_lte?: Maybe<Scalars['Int']>;
  periodFinish_in?: Maybe<Array<Scalars['Int']>>;
  periodFinish_not_in?: Maybe<Array<Scalars['Int']>>;
  lastUpdateTime?: Maybe<Scalars['Int']>;
  lastUpdateTime_not?: Maybe<Scalars['Int']>;
  lastUpdateTime_gt?: Maybe<Scalars['Int']>;
  lastUpdateTime_lt?: Maybe<Scalars['Int']>;
  lastUpdateTime_gte?: Maybe<Scalars['Int']>;
  lastUpdateTime_lte?: Maybe<Scalars['Int']>;
  lastUpdateTime_in?: Maybe<Array<Scalars['Int']>>;
  lastUpdateTime_not_in?: Maybe<Array<Scalars['Int']>>;
  rewardRate?: Maybe<Scalars['BigInt']>;
  rewardRate_not?: Maybe<Scalars['BigInt']>;
  rewardRate_gt?: Maybe<Scalars['BigInt']>;
  rewardRate_lt?: Maybe<Scalars['BigInt']>;
  rewardRate_gte?: Maybe<Scalars['BigInt']>;
  rewardRate_lte?: Maybe<Scalars['BigInt']>;
  rewardRate_in?: Maybe<Array<Scalars['BigInt']>>;
  rewardRate_not_in?: Maybe<Array<Scalars['BigInt']>>;
  rewardPerTokenStored?: Maybe<Scalars['BigInt']>;
  rewardPerTokenStored_not?: Maybe<Scalars['BigInt']>;
  rewardPerTokenStored_gt?: Maybe<Scalars['BigInt']>;
  rewardPerTokenStored_lt?: Maybe<Scalars['BigInt']>;
  rewardPerTokenStored_gte?: Maybe<Scalars['BigInt']>;
  rewardPerTokenStored_lte?: Maybe<Scalars['BigInt']>;
  rewardPerTokenStored_in?: Maybe<Array<Scalars['BigInt']>>;
  rewardPerTokenStored_not_in?: Maybe<Array<Scalars['BigInt']>>;
  rewardsToken?: Maybe<Scalars['String']>;
  rewardsToken_not?: Maybe<Scalars['String']>;
  rewardsToken_gt?: Maybe<Scalars['String']>;
  rewardsToken_lt?: Maybe<Scalars['String']>;
  rewardsToken_gte?: Maybe<Scalars['String']>;
  rewardsToken_lte?: Maybe<Scalars['String']>;
  rewardsToken_in?: Maybe<Array<Scalars['String']>>;
  rewardsToken_not_in?: Maybe<Array<Scalars['String']>>;
  rewardsToken_contains?: Maybe<Scalars['String']>;
  rewardsToken_contains_nocase?: Maybe<Scalars['String']>;
  rewardsToken_not_contains?: Maybe<Scalars['String']>;
  rewardsToken_not_contains_nocase?: Maybe<Scalars['String']>;
  rewardsToken_starts_with?: Maybe<Scalars['String']>;
  rewardsToken_starts_with_nocase?: Maybe<Scalars['String']>;
  rewardsToken_not_starts_with?: Maybe<Scalars['String']>;
  rewardsToken_not_starts_with_nocase?: Maybe<Scalars['String']>;
  rewardsToken_ends_with?: Maybe<Scalars['String']>;
  rewardsToken_ends_with_nocase?: Maybe<Scalars['String']>;
  rewardsToken_not_ends_with?: Maybe<Scalars['String']>;
  rewardsToken_not_ends_with_nocase?: Maybe<Scalars['String']>;
  rewardsToken_?: Maybe<Token_Filter>;
  rewardsTokenVendor?: Maybe<Scalars['Bytes']>;
  rewardsTokenVendor_not?: Maybe<Scalars['Bytes']>;
  rewardsTokenVendor_in?: Maybe<Array<Scalars['Bytes']>>;
  rewardsTokenVendor_not_in?: Maybe<Array<Scalars['Bytes']>>;
  rewardsTokenVendor_contains?: Maybe<Scalars['Bytes']>;
  rewardsTokenVendor_not_contains?: Maybe<Scalars['Bytes']>;
  rewardsDistributor?: Maybe<Scalars['Bytes']>;
  rewardsDistributor_not?: Maybe<Scalars['Bytes']>;
  rewardsDistributor_in?: Maybe<Array<Scalars['Bytes']>>;
  rewardsDistributor_not_in?: Maybe<Array<Scalars['Bytes']>>;
  rewardsDistributor_contains?: Maybe<Scalars['Bytes']>;
  rewardsDistributor_not_contains?: Maybe<Scalars['Bytes']>;
  pendingAdditionalReward?: Maybe<Scalars['BigInt']>;
  pendingAdditionalReward_not?: Maybe<Scalars['BigInt']>;
  pendingAdditionalReward_gt?: Maybe<Scalars['BigInt']>;
  pendingAdditionalReward_lt?: Maybe<Scalars['BigInt']>;
  pendingAdditionalReward_gte?: Maybe<Scalars['BigInt']>;
  pendingAdditionalReward_lte?: Maybe<Scalars['BigInt']>;
  pendingAdditionalReward_in?: Maybe<Array<Scalars['BigInt']>>;
  pendingAdditionalReward_not_in?: Maybe<Array<Scalars['BigInt']>>;
  DURATION?: Maybe<Scalars['Int']>;
  DURATION_not?: Maybe<Scalars['Int']>;
  DURATION_gt?: Maybe<Scalars['Int']>;
  DURATION_lt?: Maybe<Scalars['Int']>;
  DURATION_gte?: Maybe<Scalars['Int']>;
  DURATION_lte?: Maybe<Scalars['Int']>;
  DURATION_in?: Maybe<Array<Scalars['Int']>>;
  DURATION_not_in?: Maybe<Array<Scalars['Int']>>;
  rewardPaidTransactions_?: Maybe<RewardPaidTransaction_Filter>;
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
};

export enum StakingRewards_OrderBy {
  Id = 'id',
  PeriodFinish = 'periodFinish',
  LastUpdateTime = 'lastUpdateTime',
  RewardRate = 'rewardRate',
  RewardPerTokenStored = 'rewardPerTokenStored',
  RewardsToken = 'rewardsToken',
  RewardsTokenVendor = 'rewardsTokenVendor',
  RewardsDistributor = 'rewardsDistributor',
  PendingAdditionalReward = 'pendingAdditionalReward',
  Duration = 'DURATION',
  RewardPaidTransactions = 'rewardPaidTransactions'
}

export type Subscription = {
  token?: Maybe<Token>;
  tokens: Array<Token>;
  metric?: Maybe<Metric>;
  metrics: Array<Metric>;
  counter?: Maybe<Counter>;
  counters: Array<Counter>;
  stakedTokenBalance?: Maybe<StakedTokenBalance>;
  stakedTokenBalances: Array<StakedTokenBalance>;
  quest?: Maybe<Quest>;
  quests: Array<Quest>;
  season?: Maybe<Season>;
  seasons: Array<Season>;
  completedQuest?: Maybe<CompletedQuest>;
  completedQuests: Array<CompletedQuest>;
  stakedToken?: Maybe<StakedToken>;
  stakedTokens: Array<StakedToken>;
  stakingRewards: Array<StakingRewards>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  stakedTokenAccount?: Maybe<StakedTokenAccount>;
  stakedTokenAccounts: Array<StakedTokenAccount>;
  questManager?: Maybe<QuestManager>;
  questManagers: Array<QuestManager>;
  rewardPaidTransaction?: Maybe<RewardPaidTransaction>;
  rewardPaidTransactions: Array<RewardPaidTransaction>;
  transaction?: Maybe<Transaction>;
  transactions: Array<Transaction>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type SubscriptionTokenArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTokensArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Token_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Token_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMetricArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMetricsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Metric_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Metric_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionCounterArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionCountersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Counter_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Counter_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionStakedTokenBalanceArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionStakedTokenBalancesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakedTokenBalance_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakedTokenBalance_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionQuestArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionQuestsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Quest_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Quest_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSeasonArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionSeasonsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Season_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Season_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionCompletedQuestArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionCompletedQuestsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<CompletedQuest_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<CompletedQuest_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionStakedTokenArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionStakedTokensArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakedToken_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakedToken_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionStakingRewardsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakingRewards_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakingRewards_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAccountArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionAccountsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Account_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Account_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionStakedTokenAccountArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionStakedTokenAccountsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakedTokenAccount_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakedTokenAccount_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionQuestManagerArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionQuestManagersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<QuestManager_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<QuestManager_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionRewardPaidTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionRewardPaidTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<RewardPaidTransaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<RewardPaidTransaction_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTransactionArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTransactionsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Transaction_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Transaction_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscription_MetaArgs = {
  block?: Maybe<Block_Height>;
};

/** An ERC20-compatible token */
export type Token = {
  id: Scalars['ID'];
  /** Token address */
  address: Scalars['Bytes'];
  /** Token decimals */
  decimals: Scalars['Int'];
  /** Token name */
  name: Scalars['String'];
  /** Token symbol */
  symbol: Scalars['String'];
  /** Total supply of the token */
  totalSupply: Metric;
  /** Total quantity of tokens burned */
  totalBurned: Metric;
  /** Total quantity of tokens minted */
  totalMinted: Metric;
  /** Count of transfer transactions */
  totalTransfers: Counter;
  /** Count of transfer transactions that minted the token */
  totalMints: Counter;
  /** Count of transfer transactions that burned the token */
  totalBurns: Counter;
};

export type Token_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  address?: Maybe<Scalars['Bytes']>;
  address_not?: Maybe<Scalars['Bytes']>;
  address_in?: Maybe<Array<Scalars['Bytes']>>;
  address_not_in?: Maybe<Array<Scalars['Bytes']>>;
  address_contains?: Maybe<Scalars['Bytes']>;
  address_not_contains?: Maybe<Scalars['Bytes']>;
  decimals?: Maybe<Scalars['Int']>;
  decimals_not?: Maybe<Scalars['Int']>;
  decimals_gt?: Maybe<Scalars['Int']>;
  decimals_lt?: Maybe<Scalars['Int']>;
  decimals_gte?: Maybe<Scalars['Int']>;
  decimals_lte?: Maybe<Scalars['Int']>;
  decimals_in?: Maybe<Array<Scalars['Int']>>;
  decimals_not_in?: Maybe<Array<Scalars['Int']>>;
  name?: Maybe<Scalars['String']>;
  name_not?: Maybe<Scalars['String']>;
  name_gt?: Maybe<Scalars['String']>;
  name_lt?: Maybe<Scalars['String']>;
  name_gte?: Maybe<Scalars['String']>;
  name_lte?: Maybe<Scalars['String']>;
  name_in?: Maybe<Array<Scalars['String']>>;
  name_not_in?: Maybe<Array<Scalars['String']>>;
  name_contains?: Maybe<Scalars['String']>;
  name_contains_nocase?: Maybe<Scalars['String']>;
  name_not_contains?: Maybe<Scalars['String']>;
  name_not_contains_nocase?: Maybe<Scalars['String']>;
  name_starts_with?: Maybe<Scalars['String']>;
  name_starts_with_nocase?: Maybe<Scalars['String']>;
  name_not_starts_with?: Maybe<Scalars['String']>;
  name_not_starts_with_nocase?: Maybe<Scalars['String']>;
  name_ends_with?: Maybe<Scalars['String']>;
  name_ends_with_nocase?: Maybe<Scalars['String']>;
  name_not_ends_with?: Maybe<Scalars['String']>;
  name_not_ends_with_nocase?: Maybe<Scalars['String']>;
  symbol?: Maybe<Scalars['String']>;
  symbol_not?: Maybe<Scalars['String']>;
  symbol_gt?: Maybe<Scalars['String']>;
  symbol_lt?: Maybe<Scalars['String']>;
  symbol_gte?: Maybe<Scalars['String']>;
  symbol_lte?: Maybe<Scalars['String']>;
  symbol_in?: Maybe<Array<Scalars['String']>>;
  symbol_not_in?: Maybe<Array<Scalars['String']>>;
  symbol_contains?: Maybe<Scalars['String']>;
  symbol_contains_nocase?: Maybe<Scalars['String']>;
  symbol_not_contains?: Maybe<Scalars['String']>;
  symbol_not_contains_nocase?: Maybe<Scalars['String']>;
  symbol_starts_with?: Maybe<Scalars['String']>;
  symbol_starts_with_nocase?: Maybe<Scalars['String']>;
  symbol_not_starts_with?: Maybe<Scalars['String']>;
  symbol_not_starts_with_nocase?: Maybe<Scalars['String']>;
  symbol_ends_with?: Maybe<Scalars['String']>;
  symbol_ends_with_nocase?: Maybe<Scalars['String']>;
  symbol_not_ends_with?: Maybe<Scalars['String']>;
  symbol_not_ends_with_nocase?: Maybe<Scalars['String']>;
  totalSupply?: Maybe<Scalars['String']>;
  totalSupply_not?: Maybe<Scalars['String']>;
  totalSupply_gt?: Maybe<Scalars['String']>;
  totalSupply_lt?: Maybe<Scalars['String']>;
  totalSupply_gte?: Maybe<Scalars['String']>;
  totalSupply_lte?: Maybe<Scalars['String']>;
  totalSupply_in?: Maybe<Array<Scalars['String']>>;
  totalSupply_not_in?: Maybe<Array<Scalars['String']>>;
  totalSupply_contains?: Maybe<Scalars['String']>;
  totalSupply_contains_nocase?: Maybe<Scalars['String']>;
  totalSupply_not_contains?: Maybe<Scalars['String']>;
  totalSupply_not_contains_nocase?: Maybe<Scalars['String']>;
  totalSupply_starts_with?: Maybe<Scalars['String']>;
  totalSupply_starts_with_nocase?: Maybe<Scalars['String']>;
  totalSupply_not_starts_with?: Maybe<Scalars['String']>;
  totalSupply_not_starts_with_nocase?: Maybe<Scalars['String']>;
  totalSupply_ends_with?: Maybe<Scalars['String']>;
  totalSupply_ends_with_nocase?: Maybe<Scalars['String']>;
  totalSupply_not_ends_with?: Maybe<Scalars['String']>;
  totalSupply_not_ends_with_nocase?: Maybe<Scalars['String']>;
  totalSupply_?: Maybe<Metric_Filter>;
  totalBurned?: Maybe<Scalars['String']>;
  totalBurned_not?: Maybe<Scalars['String']>;
  totalBurned_gt?: Maybe<Scalars['String']>;
  totalBurned_lt?: Maybe<Scalars['String']>;
  totalBurned_gte?: Maybe<Scalars['String']>;
  totalBurned_lte?: Maybe<Scalars['String']>;
  totalBurned_in?: Maybe<Array<Scalars['String']>>;
  totalBurned_not_in?: Maybe<Array<Scalars['String']>>;
  totalBurned_contains?: Maybe<Scalars['String']>;
  totalBurned_contains_nocase?: Maybe<Scalars['String']>;
  totalBurned_not_contains?: Maybe<Scalars['String']>;
  totalBurned_not_contains_nocase?: Maybe<Scalars['String']>;
  totalBurned_starts_with?: Maybe<Scalars['String']>;
  totalBurned_starts_with_nocase?: Maybe<Scalars['String']>;
  totalBurned_not_starts_with?: Maybe<Scalars['String']>;
  totalBurned_not_starts_with_nocase?: Maybe<Scalars['String']>;
  totalBurned_ends_with?: Maybe<Scalars['String']>;
  totalBurned_ends_with_nocase?: Maybe<Scalars['String']>;
  totalBurned_not_ends_with?: Maybe<Scalars['String']>;
  totalBurned_not_ends_with_nocase?: Maybe<Scalars['String']>;
  totalBurned_?: Maybe<Metric_Filter>;
  totalMinted?: Maybe<Scalars['String']>;
  totalMinted_not?: Maybe<Scalars['String']>;
  totalMinted_gt?: Maybe<Scalars['String']>;
  totalMinted_lt?: Maybe<Scalars['String']>;
  totalMinted_gte?: Maybe<Scalars['String']>;
  totalMinted_lte?: Maybe<Scalars['String']>;
  totalMinted_in?: Maybe<Array<Scalars['String']>>;
  totalMinted_not_in?: Maybe<Array<Scalars['String']>>;
  totalMinted_contains?: Maybe<Scalars['String']>;
  totalMinted_contains_nocase?: Maybe<Scalars['String']>;
  totalMinted_not_contains?: Maybe<Scalars['String']>;
  totalMinted_not_contains_nocase?: Maybe<Scalars['String']>;
  totalMinted_starts_with?: Maybe<Scalars['String']>;
  totalMinted_starts_with_nocase?: Maybe<Scalars['String']>;
  totalMinted_not_starts_with?: Maybe<Scalars['String']>;
  totalMinted_not_starts_with_nocase?: Maybe<Scalars['String']>;
  totalMinted_ends_with?: Maybe<Scalars['String']>;
  totalMinted_ends_with_nocase?: Maybe<Scalars['String']>;
  totalMinted_not_ends_with?: Maybe<Scalars['String']>;
  totalMinted_not_ends_with_nocase?: Maybe<Scalars['String']>;
  totalMinted_?: Maybe<Metric_Filter>;
  totalTransfers?: Maybe<Scalars['String']>;
  totalTransfers_not?: Maybe<Scalars['String']>;
  totalTransfers_gt?: Maybe<Scalars['String']>;
  totalTransfers_lt?: Maybe<Scalars['String']>;
  totalTransfers_gte?: Maybe<Scalars['String']>;
  totalTransfers_lte?: Maybe<Scalars['String']>;
  totalTransfers_in?: Maybe<Array<Scalars['String']>>;
  totalTransfers_not_in?: Maybe<Array<Scalars['String']>>;
  totalTransfers_contains?: Maybe<Scalars['String']>;
  totalTransfers_contains_nocase?: Maybe<Scalars['String']>;
  totalTransfers_not_contains?: Maybe<Scalars['String']>;
  totalTransfers_not_contains_nocase?: Maybe<Scalars['String']>;
  totalTransfers_starts_with?: Maybe<Scalars['String']>;
  totalTransfers_starts_with_nocase?: Maybe<Scalars['String']>;
  totalTransfers_not_starts_with?: Maybe<Scalars['String']>;
  totalTransfers_not_starts_with_nocase?: Maybe<Scalars['String']>;
  totalTransfers_ends_with?: Maybe<Scalars['String']>;
  totalTransfers_ends_with_nocase?: Maybe<Scalars['String']>;
  totalTransfers_not_ends_with?: Maybe<Scalars['String']>;
  totalTransfers_not_ends_with_nocase?: Maybe<Scalars['String']>;
  totalTransfers_?: Maybe<Counter_Filter>;
  totalMints?: Maybe<Scalars['String']>;
  totalMints_not?: Maybe<Scalars['String']>;
  totalMints_gt?: Maybe<Scalars['String']>;
  totalMints_lt?: Maybe<Scalars['String']>;
  totalMints_gte?: Maybe<Scalars['String']>;
  totalMints_lte?: Maybe<Scalars['String']>;
  totalMints_in?: Maybe<Array<Scalars['String']>>;
  totalMints_not_in?: Maybe<Array<Scalars['String']>>;
  totalMints_contains?: Maybe<Scalars['String']>;
  totalMints_contains_nocase?: Maybe<Scalars['String']>;
  totalMints_not_contains?: Maybe<Scalars['String']>;
  totalMints_not_contains_nocase?: Maybe<Scalars['String']>;
  totalMints_starts_with?: Maybe<Scalars['String']>;
  totalMints_starts_with_nocase?: Maybe<Scalars['String']>;
  totalMints_not_starts_with?: Maybe<Scalars['String']>;
  totalMints_not_starts_with_nocase?: Maybe<Scalars['String']>;
  totalMints_ends_with?: Maybe<Scalars['String']>;
  totalMints_ends_with_nocase?: Maybe<Scalars['String']>;
  totalMints_not_ends_with?: Maybe<Scalars['String']>;
  totalMints_not_ends_with_nocase?: Maybe<Scalars['String']>;
  totalMints_?: Maybe<Counter_Filter>;
  totalBurns?: Maybe<Scalars['String']>;
  totalBurns_not?: Maybe<Scalars['String']>;
  totalBurns_gt?: Maybe<Scalars['String']>;
  totalBurns_lt?: Maybe<Scalars['String']>;
  totalBurns_gte?: Maybe<Scalars['String']>;
  totalBurns_lte?: Maybe<Scalars['String']>;
  totalBurns_in?: Maybe<Array<Scalars['String']>>;
  totalBurns_not_in?: Maybe<Array<Scalars['String']>>;
  totalBurns_contains?: Maybe<Scalars['String']>;
  totalBurns_contains_nocase?: Maybe<Scalars['String']>;
  totalBurns_not_contains?: Maybe<Scalars['String']>;
  totalBurns_not_contains_nocase?: Maybe<Scalars['String']>;
  totalBurns_starts_with?: Maybe<Scalars['String']>;
  totalBurns_starts_with_nocase?: Maybe<Scalars['String']>;
  totalBurns_not_starts_with?: Maybe<Scalars['String']>;
  totalBurns_not_starts_with_nocase?: Maybe<Scalars['String']>;
  totalBurns_ends_with?: Maybe<Scalars['String']>;
  totalBurns_ends_with_nocase?: Maybe<Scalars['String']>;
  totalBurns_not_ends_with?: Maybe<Scalars['String']>;
  totalBurns_not_ends_with_nocase?: Maybe<Scalars['String']>;
  totalBurns_?: Maybe<Counter_Filter>;
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
};

export enum Token_OrderBy {
  Id = 'id',
  Address = 'address',
  Decimals = 'decimals',
  Name = 'name',
  Symbol = 'symbol',
  TotalSupply = 'totalSupply',
  TotalBurned = 'totalBurned',
  TotalMinted = 'totalMinted',
  TotalTransfers = 'totalTransfers',
  TotalMints = 'totalMints',
  TotalBurns = 'totalBurns'
}

export type Transaction = {
  /** Transaction hash + log index */
  id: Scalars['ID'];
  /** Transaction hash */
  hash: Scalars['Bytes'];
  /** Block number the transaction is in */
  block: Scalars['Int'];
  /** Timestamp of the block the transaction is in */
  timestamp: Scalars['BigInt'];
  /** Address of the sender of the transaction */
  sender: Scalars['Bytes'];
};

export type Transaction_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  hash?: Maybe<Scalars['Bytes']>;
  hash_not?: Maybe<Scalars['Bytes']>;
  hash_in?: Maybe<Array<Scalars['Bytes']>>;
  hash_not_in?: Maybe<Array<Scalars['Bytes']>>;
  hash_contains?: Maybe<Scalars['Bytes']>;
  hash_not_contains?: Maybe<Scalars['Bytes']>;
  block?: Maybe<Scalars['Int']>;
  block_not?: Maybe<Scalars['Int']>;
  block_gt?: Maybe<Scalars['Int']>;
  block_lt?: Maybe<Scalars['Int']>;
  block_gte?: Maybe<Scalars['Int']>;
  block_lte?: Maybe<Scalars['Int']>;
  block_in?: Maybe<Array<Scalars['Int']>>;
  block_not_in?: Maybe<Array<Scalars['Int']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  sender?: Maybe<Scalars['Bytes']>;
  sender_not?: Maybe<Scalars['Bytes']>;
  sender_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_not_in?: Maybe<Array<Scalars['Bytes']>>;
  sender_contains?: Maybe<Scalars['Bytes']>;
  sender_not_contains?: Maybe<Scalars['Bytes']>;
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
};

export enum Transaction_OrderBy {
  Id = 'id',
  Hash = 'hash',
  Block = 'block',
  Timestamp = 'timestamp',
  Sender = 'sender'
}

export type _Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
  /** Timestamp of the block if available, format depends on the chain */
  timestamp?: Maybe<Scalars['String']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean'];
};

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = 'allow',
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = 'deny'
}

export type MetricFieldsFragment = { id: string, exact: string, decimals: number, simple: string, bigDecimal: BigDecimal };

export type TokenAllFragment = { id: string, address: string, decimals: number, symbol: string, totalSupply: { id: string, exact: string, decimals: number, simple: string, bigDecimal: BigDecimal } };

export type StakingQueryVariables = Exact<{ [key: string]: never; }>;


export type StakingQuery = { stakedTokens: Array<{ id: string, stakingToken: { id: string, address: string, decimals: number, symbol: string, totalSupply: { id: string, exact: string, decimals: number, simple: string, bigDecimal: BigDecimal } }, token: { id: string, address: string, decimals: number, symbol: string, totalSupply: { id: string, exact: string, decimals: number, simple: string, bigDecimal: BigDecimal } } }> };

export type TokensQueryVariables = Exact<{ [key: string]: never; }>;


export type TokensQuery = { tokens: Array<{ id: string, address: string, decimals: number, symbol: string, totalSupply: { id: string, exact: string, decimals: number, simple: string, bigDecimal: BigDecimal } }> };

export type LeaderboardQueryVariables = Exact<{
  count: Scalars['Int'];
  skip: Scalars['Int'];
}>;


export type LeaderboardQuery = { accounts: Array<{ id: string, totalVotesAll: string, totalVotesAllBD: BigDecimal }> };

export type AccountQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type AccountQuery = { account?: { id: string, lastAction: number, seasonMultiplier: number, permMultiplier: number, totalVotesAll: string, totalVotesMTA: string, totalVotesBPT: string, totalVotesBPTBD: BigDecimal, totalVotesMTABD: BigDecimal, totalVotesAllBD: BigDecimal, seasonMultiplierSimple: number, permMultiplierSimple: number, completedQuests: Array<{ id: string, completedAt: number, quest: { id: string } }>, delegators: Array<{ id: string }>, stakedTokenAccounts: Array<{ id: string, stakedToken: { id: string, stakingToken: { symbol: string } }, delegatee?: { id: string, totalVotesAll: string, totalVotesAllBD: BigDecimal } | null | undefined, balance: { id: string, raw: string, votes: string, timeMultiplier: number, questMultiplier: number, cooldownTimestamp: number, weightedTimestamp: number, cooldownUnits: string, rawBD: BigDecimal, votesBD: BigDecimal, timeMultiplierSimple: number, questMultiplierSimple: number, userPriceCoefficient: string } }> } | null | undefined };

export type StakedTokenQueryVariables = Exact<{
  id: Scalars['ID'];
  account: Scalars['String'];
  hasAccount: Scalars['Boolean'];
}>;


export type StakedTokenQuery = { stakedToken?: { id: string, UNSTAKE_WINDOW: string, COOLDOWN_SECONDS: string, collateralisationRatio: string, slashingPercentage: string, priceCoefficient?: string | null | undefined, token: { id: string, address: string, decimals: number, symbol: string, totalSupply: { id: string, exact: string, decimals: number, simple: string, bigDecimal: BigDecimal } }, stakingToken: { id: string, address: string, decimals: number, symbol: string, totalSupply: { id: string, exact: string, decimals: number, simple: string, bigDecimal: BigDecimal } }, stakingRewards: { DURATION?: number | null | undefined, periodFinish: number, lastUpdateTime: number, rewardRate: string, rewardPerTokenStored: string, rewardsTokenVendor: string, rewardsDistributor: string, pendingAdditionalReward: string, rewardsToken: { id: string, address: string, decimals: number, symbol: string, totalSupply: { id: string, exact: string, decimals: number, simple: string, bigDecimal: BigDecimal } } }, accounts?: Array<{ id: string, rewardPerTokenPaid?: string | null | undefined, rewards?: string | null | undefined, delegatee?: { id: string } | null | undefined, balance: { timeMultiplier: number, cooldownTimestamp: number, cooldownUnits: string, questMultiplier: number, raw: string, votes: string, weightedTimestamp: number, rawBD: BigDecimal, votesBD: BigDecimal, timeMultiplierSimple: number, questMultiplierSimple: number, userPriceCoefficient: string } }> } | null | undefined };

export type QuestAllFragment = { id: string, expiry: number, multiplier: number, status: QuestStatus, type: QuestType, season?: { id: string } | null | undefined };

export type QuestsQueryVariables = Exact<{ [key: string]: never; }>;


export type QuestsQuery = { questManagers: Array<{ id: string, questMaster: string, questSigner?: string | null | undefined }>, seasons: Array<{ id: string, seasonNumber: number, startedAt: number, endedAt?: number | null | undefined }>, quests: Array<{ id: string, expiry: number, multiplier: number, status: QuestStatus, type: QuestType, season?: { id: string } | null | undefined }> };

export type QuestQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type QuestQuery = { quest?: { id: string, expiry: number, multiplier: number, status: QuestStatus, type: QuestType, season?: { id: string } | null | undefined } | null | undefined };

export const MetricFieldsFragmentDoc = gql`
    fragment MetricFields on Metric {
  id
  exact
  decimals
  simple
  bigDecimal @client
}
    `;
export const TokenAllFragmentDoc = gql`
    fragment TokenAll on Token {
  id
  address
  decimals
  symbol
  totalSupply {
    ...MetricFields
  }
}
    ${MetricFieldsFragmentDoc}`;
export const QuestAllFragmentDoc = gql`
    fragment QuestAll on Quest {
  id
  expiry
  multiplier
  status
  type
  season {
    id
  }
}
    `;
export const StakingDocument = gql`
    query Staking {
  stakedTokens {
    id
    stakingToken {
      ...TokenAll
    }
    token {
      ...TokenAll
    }
  }
}
    ${TokenAllFragmentDoc}`;

/**
 * __useStakingQuery__
 *
 * To run a query within a React component, call `useStakingQuery` and pass it any options that fit your needs.
 * When your component renders, `useStakingQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStakingQuery({
 *   variables: {
 *   },
 * });
 */
export function useStakingQuery(baseOptions?: Apollo.QueryHookOptions<StakingQuery, StakingQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StakingQuery, StakingQueryVariables>(StakingDocument, options);
      }
export function useStakingLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StakingQuery, StakingQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StakingQuery, StakingQueryVariables>(StakingDocument, options);
        }
export type StakingQueryHookResult = ReturnType<typeof useStakingQuery>;
export type StakingLazyQueryHookResult = ReturnType<typeof useStakingLazyQuery>;
export type StakingQueryResult = Apollo.QueryResult<StakingQuery, StakingQueryVariables>;
export const TokensDocument = gql`
    query Tokens {
  tokens {
    ...TokenAll
  }
}
    ${TokenAllFragmentDoc}`;

/**
 * __useTokensQuery__
 *
 * To run a query within a React component, call `useTokensQuery` and pass it any options that fit your needs.
 * When your component renders, `useTokensQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTokensQuery({
 *   variables: {
 *   },
 * });
 */
export function useTokensQuery(baseOptions?: Apollo.QueryHookOptions<TokensQuery, TokensQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TokensQuery, TokensQueryVariables>(TokensDocument, options);
      }
export function useTokensLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TokensQuery, TokensQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TokensQuery, TokensQueryVariables>(TokensDocument, options);
        }
export type TokensQueryHookResult = ReturnType<typeof useTokensQuery>;
export type TokensLazyQueryHookResult = ReturnType<typeof useTokensLazyQuery>;
export type TokensQueryResult = Apollo.QueryResult<TokensQuery, TokensQueryVariables>;
export const LeaderboardDocument = gql`
    query Leaderboard($count: Int!, $skip: Int!) {
  accounts(
    first: $count
    skip: $skip
    orderBy: totalVotesAll
    orderDirection: desc
  ) {
    id
    totalVotesAll
    totalVotesAllBD @client
  }
}
    `;

/**
 * __useLeaderboardQuery__
 *
 * To run a query within a React component, call `useLeaderboardQuery` and pass it any options that fit your needs.
 * When your component renders, `useLeaderboardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLeaderboardQuery({
 *   variables: {
 *      count: // value for 'count'
 *      skip: // value for 'skip'
 *   },
 * });
 */
export function useLeaderboardQuery(baseOptions: Apollo.QueryHookOptions<LeaderboardQuery, LeaderboardQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LeaderboardQuery, LeaderboardQueryVariables>(LeaderboardDocument, options);
      }
export function useLeaderboardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LeaderboardQuery, LeaderboardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LeaderboardQuery, LeaderboardQueryVariables>(LeaderboardDocument, options);
        }
export type LeaderboardQueryHookResult = ReturnType<typeof useLeaderboardQuery>;
export type LeaderboardLazyQueryHookResult = ReturnType<typeof useLeaderboardLazyQuery>;
export type LeaderboardQueryResult = Apollo.QueryResult<LeaderboardQuery, LeaderboardQueryVariables>;
export const AccountDocument = gql`
    query Account($id: ID!) {
  account(id: $id) {
    id
    lastAction
    seasonMultiplier
    permMultiplier
    totalVotesAll
    totalVotesMTA
    totalVotesBPT
    totalVotesBPTBD @client
    totalVotesMTABD @client
    totalVotesAllBD @client
    seasonMultiplierSimple @client
    permMultiplierSimple @client
    completedQuests {
      id
      completedAt
      quest {
        id
      }
    }
    delegators {
      id
    }
    stakedTokenAccounts {
      id
      stakedToken {
        id
        stakingToken {
          symbol
        }
      }
      delegatee {
        id
        totalVotesAll
        totalVotesAllBD @client
      }
      balance {
        id
        raw
        votes
        timeMultiplier
        questMultiplier
        cooldownTimestamp
        weightedTimestamp
        cooldownUnits
        rawBD @client
        votesBD @client
        timeMultiplierSimple @client
        questMultiplierSimple @client
        userPriceCoefficient
      }
    }
  }
}
    `;

/**
 * __useAccountQuery__
 *
 * To run a query within a React component, call `useAccountQuery` and pass it any options that fit your needs.
 * When your component renders, `useAccountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAccountQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useAccountQuery(baseOptions: Apollo.QueryHookOptions<AccountQuery, AccountQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AccountQuery, AccountQueryVariables>(AccountDocument, options);
      }
export function useAccountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AccountQuery, AccountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AccountQuery, AccountQueryVariables>(AccountDocument, options);
        }
export type AccountQueryHookResult = ReturnType<typeof useAccountQuery>;
export type AccountLazyQueryHookResult = ReturnType<typeof useAccountLazyQuery>;
export type AccountQueryResult = Apollo.QueryResult<AccountQuery, AccountQueryVariables>;
export const StakedTokenDocument = gql`
    query StakedToken($id: ID!, $account: String!, $hasAccount: Boolean!) {
  stakedToken(id: $id) {
    id
    token {
      ...TokenAll
    }
    stakingToken {
      ...TokenAll
    }
    stakingRewards {
      DURATION
      periodFinish
      lastUpdateTime
      rewardRate
      rewardPerTokenStored
      rewardsToken {
        ...TokenAll
      }
      rewardsTokenVendor
      rewardsDistributor
      pendingAdditionalReward
    }
    UNSTAKE_WINDOW
    COOLDOWN_SECONDS
    collateralisationRatio
    slashingPercentage
    priceCoefficient
    accounts(where: {account: $account}) @include(if: $hasAccount) {
      id
      delegatee {
        id
      }
      rewardPerTokenPaid
      rewards
      balance {
        timeMultiplier
        cooldownTimestamp
        cooldownUnits
        questMultiplier
        raw
        votes
        weightedTimestamp
        rawBD @client
        votesBD @client
        timeMultiplierSimple @client
        questMultiplierSimple @client
        userPriceCoefficient
      }
    }
  }
}
    ${TokenAllFragmentDoc}`;

/**
 * __useStakedTokenQuery__
 *
 * To run a query within a React component, call `useStakedTokenQuery` and pass it any options that fit your needs.
 * When your component renders, `useStakedTokenQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStakedTokenQuery({
 *   variables: {
 *      id: // value for 'id'
 *      account: // value for 'account'
 *      hasAccount: // value for 'hasAccount'
 *   },
 * });
 */
export function useStakedTokenQuery(baseOptions: Apollo.QueryHookOptions<StakedTokenQuery, StakedTokenQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StakedTokenQuery, StakedTokenQueryVariables>(StakedTokenDocument, options);
      }
export function useStakedTokenLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StakedTokenQuery, StakedTokenQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StakedTokenQuery, StakedTokenQueryVariables>(StakedTokenDocument, options);
        }
export type StakedTokenQueryHookResult = ReturnType<typeof useStakedTokenQuery>;
export type StakedTokenLazyQueryHookResult = ReturnType<typeof useStakedTokenLazyQuery>;
export type StakedTokenQueryResult = Apollo.QueryResult<StakedTokenQuery, StakedTokenQueryVariables>;
export const QuestsDocument = gql`
    query Quests {
  questManagers {
    id
    questMaster
    questSigner
  }
  seasons {
    id
    seasonNumber
    startedAt
    endedAt
  }
  quests {
    ...QuestAll
  }
}
    ${QuestAllFragmentDoc}`;

/**
 * __useQuestsQuery__
 *
 * To run a query within a React component, call `useQuestsQuery` and pass it any options that fit your needs.
 * When your component renders, `useQuestsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQuestsQuery({
 *   variables: {
 *   },
 * });
 */
export function useQuestsQuery(baseOptions?: Apollo.QueryHookOptions<QuestsQuery, QuestsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<QuestsQuery, QuestsQueryVariables>(QuestsDocument, options);
      }
export function useQuestsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<QuestsQuery, QuestsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<QuestsQuery, QuestsQueryVariables>(QuestsDocument, options);
        }
export type QuestsQueryHookResult = ReturnType<typeof useQuestsQuery>;
export type QuestsLazyQueryHookResult = ReturnType<typeof useQuestsLazyQuery>;
export type QuestsQueryResult = Apollo.QueryResult<QuestsQuery, QuestsQueryVariables>;
export const QuestDocument = gql`
    query Quest($id: ID!) {
  quest(id: $id) {
    ...QuestAll
  }
}
    ${QuestAllFragmentDoc}`;

/**
 * __useQuestQuery__
 *
 * To run a query within a React component, call `useQuestQuery` and pass it any options that fit your needs.
 * When your component renders, `useQuestQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useQuestQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useQuestQuery(baseOptions: Apollo.QueryHookOptions<QuestQuery, QuestQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<QuestQuery, QuestQueryVariables>(QuestDocument, options);
      }
export function useQuestLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<QuestQuery, QuestQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<QuestQuery, QuestQueryVariables>(QuestDocument, options);
        }
export type QuestQueryHookResult = ReturnType<typeof useQuestQuery>;
export type QuestLazyQueryHookResult = ReturnType<typeof useQuestLazyQuery>;
export type QuestQueryResult = Apollo.QueryResult<QuestQuery, QuestQueryVariables>;