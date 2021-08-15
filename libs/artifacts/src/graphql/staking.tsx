import gql from 'graphql-tag';
import * as ApolloReactCommon from '@apollo/react-common';
import * as ApolloReactHooks from '@apollo/react-hooks';
export type Maybe<T> = T | null;

      export interface IntrospectionResultData {
        __schema: {
          types: {
            kind: string;
            name: string;
            possibleTypes: {
              name: string;
            }[];
          }[];
        };
      }
      const result: IntrospectionResultData = {
  "__schema": {
    "types": []
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
  Bytes: string;
};

export type Account = {
  id: Scalars['ID'];
  balance: Balance;
  delegatee?: Maybe<Account>;
  rewardPerTokenPaid?: Maybe<Scalars['BigInt']>;
  rewards?: Maybe<Scalars['BigInt']>;
  delegators: Array<Account>;
  cooldownTimestamp?: Maybe<Scalars['BigInt']>;
  cooldownPercentage?: Maybe<Scalars['BigInt']>;
  completedQuests: Array<CompletedQuest>;
};


export type AccountDelegatorsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Account_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Account_Filter>;
};


export type AccountCompletedQuestsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<CompletedQuest_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<CompletedQuest_Filter>;
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
  balance?: Maybe<Scalars['String']>;
  balance_not?: Maybe<Scalars['String']>;
  balance_gt?: Maybe<Scalars['String']>;
  balance_lt?: Maybe<Scalars['String']>;
  balance_gte?: Maybe<Scalars['String']>;
  balance_lte?: Maybe<Scalars['String']>;
  balance_in?: Maybe<Array<Scalars['String']>>;
  balance_not_in?: Maybe<Array<Scalars['String']>>;
  balance_contains?: Maybe<Scalars['String']>;
  balance_not_contains?: Maybe<Scalars['String']>;
  balance_starts_with?: Maybe<Scalars['String']>;
  balance_not_starts_with?: Maybe<Scalars['String']>;
  balance_ends_with?: Maybe<Scalars['String']>;
  balance_not_ends_with?: Maybe<Scalars['String']>;
  delegatee?: Maybe<Scalars['String']>;
  delegatee_not?: Maybe<Scalars['String']>;
  delegatee_gt?: Maybe<Scalars['String']>;
  delegatee_lt?: Maybe<Scalars['String']>;
  delegatee_gte?: Maybe<Scalars['String']>;
  delegatee_lte?: Maybe<Scalars['String']>;
  delegatee_in?: Maybe<Array<Scalars['String']>>;
  delegatee_not_in?: Maybe<Array<Scalars['String']>>;
  delegatee_contains?: Maybe<Scalars['String']>;
  delegatee_not_contains?: Maybe<Scalars['String']>;
  delegatee_starts_with?: Maybe<Scalars['String']>;
  delegatee_not_starts_with?: Maybe<Scalars['String']>;
  delegatee_ends_with?: Maybe<Scalars['String']>;
  delegatee_not_ends_with?: Maybe<Scalars['String']>;
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
  cooldownTimestamp?: Maybe<Scalars['BigInt']>;
  cooldownTimestamp_not?: Maybe<Scalars['BigInt']>;
  cooldownTimestamp_gt?: Maybe<Scalars['BigInt']>;
  cooldownTimestamp_lt?: Maybe<Scalars['BigInt']>;
  cooldownTimestamp_gte?: Maybe<Scalars['BigInt']>;
  cooldownTimestamp_lte?: Maybe<Scalars['BigInt']>;
  cooldownTimestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  cooldownTimestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  cooldownPercentage?: Maybe<Scalars['BigInt']>;
  cooldownPercentage_not?: Maybe<Scalars['BigInt']>;
  cooldownPercentage_gt?: Maybe<Scalars['BigInt']>;
  cooldownPercentage_lt?: Maybe<Scalars['BigInt']>;
  cooldownPercentage_gte?: Maybe<Scalars['BigInt']>;
  cooldownPercentage_lte?: Maybe<Scalars['BigInt']>;
  cooldownPercentage_in?: Maybe<Array<Scalars['BigInt']>>;
  cooldownPercentage_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum Account_OrderBy {
  Id = 'id',
  Balance = 'balance',
  Delegatee = 'delegatee',
  RewardPerTokenPaid = 'rewardPerTokenPaid',
  Rewards = 'rewards',
  Delegators = 'delegators',
  CooldownTimestamp = 'cooldownTimestamp',
  CooldownPercentage = 'cooldownPercentage',
  CompletedQuests = 'completedQuests'
}

export type Balance = {
  id: Scalars['ID'];
  account: Account;
  raw: Scalars['BigInt'];
  weightedTimestamp: Scalars['Int'];
  lastAction: Scalars['Int'];
  permMultiplier: Scalars['Int'];
  seasonMultiplier: Scalars['Int'];
  timeMultiplier: Scalars['Int'];
  cooldownMultiplier: Scalars['Int'];
  votes: Scalars['BigInt'];
};

export type Balance_Filter = {
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
  account_not_contains?: Maybe<Scalars['String']>;
  account_starts_with?: Maybe<Scalars['String']>;
  account_not_starts_with?: Maybe<Scalars['String']>;
  account_ends_with?: Maybe<Scalars['String']>;
  account_not_ends_with?: Maybe<Scalars['String']>;
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
  timeMultiplier?: Maybe<Scalars['Int']>;
  timeMultiplier_not?: Maybe<Scalars['Int']>;
  timeMultiplier_gt?: Maybe<Scalars['Int']>;
  timeMultiplier_lt?: Maybe<Scalars['Int']>;
  timeMultiplier_gte?: Maybe<Scalars['Int']>;
  timeMultiplier_lte?: Maybe<Scalars['Int']>;
  timeMultiplier_in?: Maybe<Array<Scalars['Int']>>;
  timeMultiplier_not_in?: Maybe<Array<Scalars['Int']>>;
  cooldownMultiplier?: Maybe<Scalars['Int']>;
  cooldownMultiplier_not?: Maybe<Scalars['Int']>;
  cooldownMultiplier_gt?: Maybe<Scalars['Int']>;
  cooldownMultiplier_lt?: Maybe<Scalars['Int']>;
  cooldownMultiplier_gte?: Maybe<Scalars['Int']>;
  cooldownMultiplier_lte?: Maybe<Scalars['Int']>;
  cooldownMultiplier_in?: Maybe<Array<Scalars['Int']>>;
  cooldownMultiplier_not_in?: Maybe<Array<Scalars['Int']>>;
  votes?: Maybe<Scalars['BigInt']>;
  votes_not?: Maybe<Scalars['BigInt']>;
  votes_gt?: Maybe<Scalars['BigInt']>;
  votes_lt?: Maybe<Scalars['BigInt']>;
  votes_gte?: Maybe<Scalars['BigInt']>;
  votes_lte?: Maybe<Scalars['BigInt']>;
  votes_in?: Maybe<Array<Scalars['BigInt']>>;
  votes_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum Balance_OrderBy {
  Id = 'id',
  Account = 'account',
  Raw = 'raw',
  WeightedTimestamp = 'weightedTimestamp',
  LastAction = 'lastAction',
  PermMultiplier = 'permMultiplier',
  SeasonMultiplier = 'seasonMultiplier',
  TimeMultiplier = 'timeMultiplier',
  CooldownMultiplier = 'cooldownMultiplier',
  Votes = 'votes'
}



export type Block_Height = {
  hash?: Maybe<Scalars['Bytes']>;
  number?: Maybe<Scalars['Int']>;
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
  account_not_contains?: Maybe<Scalars['String']>;
  account_starts_with?: Maybe<Scalars['String']>;
  account_not_starts_with?: Maybe<Scalars['String']>;
  account_ends_with?: Maybe<Scalars['String']>;
  account_not_ends_with?: Maybe<Scalars['String']>;
  quest?: Maybe<Scalars['String']>;
  quest_not?: Maybe<Scalars['String']>;
  quest_gt?: Maybe<Scalars['String']>;
  quest_lt?: Maybe<Scalars['String']>;
  quest_gte?: Maybe<Scalars['String']>;
  quest_lte?: Maybe<Scalars['String']>;
  quest_in?: Maybe<Array<Scalars['String']>>;
  quest_not_in?: Maybe<Array<Scalars['String']>>;
  quest_contains?: Maybe<Scalars['String']>;
  quest_not_contains?: Maybe<Scalars['String']>;
  quest_starts_with?: Maybe<Scalars['String']>;
  quest_not_starts_with?: Maybe<Scalars['String']>;
  quest_ends_with?: Maybe<Scalars['String']>;
  quest_not_ends_with?: Maybe<Scalars['String']>;
  completedAt?: Maybe<Scalars['Int']>;
  completedAt_not?: Maybe<Scalars['Int']>;
  completedAt_gt?: Maybe<Scalars['Int']>;
  completedAt_lt?: Maybe<Scalars['Int']>;
  completedAt_gte?: Maybe<Scalars['Int']>;
  completedAt_lte?: Maybe<Scalars['Int']>;
  completedAt_in?: Maybe<Array<Scalars['Int']>>;
  completedAt_not_in?: Maybe<Array<Scalars['Int']>>;
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
};

export enum Counter_OrderBy {
  Id = 'id',
  Value = 'value'
}

export type Metric = {
  id: Scalars['ID'];
  /** Exact value of the metric, i.e. in base units as an integer */
  exact: Scalars['BigInt'];
  /** Decimals used for the exact value (default: 18) */
  decimals: Scalars['Int'];
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
};

export enum Metric_OrderBy {
  Id = 'id',
  Exact = 'exact',
  Decimals = 'decimals',
  Simple = 'simple'
}

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
  balance?: Maybe<Balance>;
  balances: Array<Balance>;
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
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type QueryTokenArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryTokensArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Token_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Token_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryMetricArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryMetricsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Metric_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Metric_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryCounterArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryCountersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Counter_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Counter_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryBalanceArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryBalancesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Balance_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Balance_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryQuestArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryQuestsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Quest_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Quest_Filter>;
  block?: Maybe<Block_Height>;
};


export type QuerySeasonArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QuerySeasonsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Season_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Season_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryCompletedQuestArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryCompletedQuestsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<CompletedQuest_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<CompletedQuest_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryStakedTokenArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryStakedTokensArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakedToken_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakedToken_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryStakingRewardsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakingRewards_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakingRewards_Filter>;
  block?: Maybe<Block_Height>;
};


export type QueryAccountArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type QueryAccountsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Account_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Account_Filter>;
  block?: Maybe<Block_Height>;
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
  season_not_contains?: Maybe<Scalars['String']>;
  season_starts_with?: Maybe<Scalars['String']>;
  season_not_starts_with?: Maybe<Scalars['String']>;
  season_ends_with?: Maybe<Scalars['String']>;
  season_not_ends_with?: Maybe<Scalars['String']>;
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
  address: Scalars['Bytes'];
  token: Token;
  stakingToken: Token;
  season: Season;
  stakingRewards: StakingRewards;
  questSigner: Scalars['Bytes'];
  COOLDOWN_SECONDS: Scalars['BigInt'];
  UNSTAKE_WINDOW: Scalars['BigInt'];
  COOLDOWN_PERCENTAGE_SCALE: Scalars['BigInt'];
  collateralisationRatio: Scalars['BigInt'];
  slashingPercentage: Scalars['BigInt'];
};

export type StakedToken_Filter = {
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
  token?: Maybe<Scalars['String']>;
  token_not?: Maybe<Scalars['String']>;
  token_gt?: Maybe<Scalars['String']>;
  token_lt?: Maybe<Scalars['String']>;
  token_gte?: Maybe<Scalars['String']>;
  token_lte?: Maybe<Scalars['String']>;
  token_in?: Maybe<Array<Scalars['String']>>;
  token_not_in?: Maybe<Array<Scalars['String']>>;
  token_contains?: Maybe<Scalars['String']>;
  token_not_contains?: Maybe<Scalars['String']>;
  token_starts_with?: Maybe<Scalars['String']>;
  token_not_starts_with?: Maybe<Scalars['String']>;
  token_ends_with?: Maybe<Scalars['String']>;
  token_not_ends_with?: Maybe<Scalars['String']>;
  stakingToken?: Maybe<Scalars['String']>;
  stakingToken_not?: Maybe<Scalars['String']>;
  stakingToken_gt?: Maybe<Scalars['String']>;
  stakingToken_lt?: Maybe<Scalars['String']>;
  stakingToken_gte?: Maybe<Scalars['String']>;
  stakingToken_lte?: Maybe<Scalars['String']>;
  stakingToken_in?: Maybe<Array<Scalars['String']>>;
  stakingToken_not_in?: Maybe<Array<Scalars['String']>>;
  stakingToken_contains?: Maybe<Scalars['String']>;
  stakingToken_not_contains?: Maybe<Scalars['String']>;
  stakingToken_starts_with?: Maybe<Scalars['String']>;
  stakingToken_not_starts_with?: Maybe<Scalars['String']>;
  stakingToken_ends_with?: Maybe<Scalars['String']>;
  stakingToken_not_ends_with?: Maybe<Scalars['String']>;
  season?: Maybe<Scalars['String']>;
  season_not?: Maybe<Scalars['String']>;
  season_gt?: Maybe<Scalars['String']>;
  season_lt?: Maybe<Scalars['String']>;
  season_gte?: Maybe<Scalars['String']>;
  season_lte?: Maybe<Scalars['String']>;
  season_in?: Maybe<Array<Scalars['String']>>;
  season_not_in?: Maybe<Array<Scalars['String']>>;
  season_contains?: Maybe<Scalars['String']>;
  season_not_contains?: Maybe<Scalars['String']>;
  season_starts_with?: Maybe<Scalars['String']>;
  season_not_starts_with?: Maybe<Scalars['String']>;
  season_ends_with?: Maybe<Scalars['String']>;
  season_not_ends_with?: Maybe<Scalars['String']>;
  stakingRewards?: Maybe<Scalars['String']>;
  stakingRewards_not?: Maybe<Scalars['String']>;
  stakingRewards_gt?: Maybe<Scalars['String']>;
  stakingRewards_lt?: Maybe<Scalars['String']>;
  stakingRewards_gte?: Maybe<Scalars['String']>;
  stakingRewards_lte?: Maybe<Scalars['String']>;
  stakingRewards_in?: Maybe<Array<Scalars['String']>>;
  stakingRewards_not_in?: Maybe<Array<Scalars['String']>>;
  stakingRewards_contains?: Maybe<Scalars['String']>;
  stakingRewards_not_contains?: Maybe<Scalars['String']>;
  stakingRewards_starts_with?: Maybe<Scalars['String']>;
  stakingRewards_not_starts_with?: Maybe<Scalars['String']>;
  stakingRewards_ends_with?: Maybe<Scalars['String']>;
  stakingRewards_not_ends_with?: Maybe<Scalars['String']>;
  questSigner?: Maybe<Scalars['Bytes']>;
  questSigner_not?: Maybe<Scalars['Bytes']>;
  questSigner_in?: Maybe<Array<Scalars['Bytes']>>;
  questSigner_not_in?: Maybe<Array<Scalars['Bytes']>>;
  questSigner_contains?: Maybe<Scalars['Bytes']>;
  questSigner_not_contains?: Maybe<Scalars['Bytes']>;
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
  COOLDOWN_PERCENTAGE_SCALE?: Maybe<Scalars['BigInt']>;
  COOLDOWN_PERCENTAGE_SCALE_not?: Maybe<Scalars['BigInt']>;
  COOLDOWN_PERCENTAGE_SCALE_gt?: Maybe<Scalars['BigInt']>;
  COOLDOWN_PERCENTAGE_SCALE_lt?: Maybe<Scalars['BigInt']>;
  COOLDOWN_PERCENTAGE_SCALE_gte?: Maybe<Scalars['BigInt']>;
  COOLDOWN_PERCENTAGE_SCALE_lte?: Maybe<Scalars['BigInt']>;
  COOLDOWN_PERCENTAGE_SCALE_in?: Maybe<Array<Scalars['BigInt']>>;
  COOLDOWN_PERCENTAGE_SCALE_not_in?: Maybe<Array<Scalars['BigInt']>>;
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
};

export enum StakedToken_OrderBy {
  Id = 'id',
  Address = 'address',
  Token = 'token',
  StakingToken = 'stakingToken',
  Season = 'season',
  StakingRewards = 'stakingRewards',
  QuestSigner = 'questSigner',
  CooldownSeconds = 'COOLDOWN_SECONDS',
  UnstakeWindow = 'UNSTAKE_WINDOW',
  CooldownPercentageScale = 'COOLDOWN_PERCENTAGE_SCALE',
  CollateralisationRatio = 'collateralisationRatio',
  SlashingPercentage = 'slashingPercentage'
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
  rewardsToken_not_contains?: Maybe<Scalars['String']>;
  rewardsToken_starts_with?: Maybe<Scalars['String']>;
  rewardsToken_not_starts_with?: Maybe<Scalars['String']>;
  rewardsToken_ends_with?: Maybe<Scalars['String']>;
  rewardsToken_not_ends_with?: Maybe<Scalars['String']>;
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
  Duration = 'DURATION'
}

export type Subscription = {
  token?: Maybe<Token>;
  tokens: Array<Token>;
  metric?: Maybe<Metric>;
  metrics: Array<Metric>;
  counter?: Maybe<Counter>;
  counters: Array<Counter>;
  balance?: Maybe<Balance>;
  balances: Array<Balance>;
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
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type SubscriptionTokenArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionTokensArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Token_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Token_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionMetricArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionMetricsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Metric_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Metric_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionCounterArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionCountersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Counter_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Counter_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionBalanceArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionBalancesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Balance_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Balance_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionQuestArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionQuestsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Quest_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Quest_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionSeasonArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionSeasonsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Season_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Season_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionCompletedQuestArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionCompletedQuestsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<CompletedQuest_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<CompletedQuest_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionStakedTokenArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionStakedTokensArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakedToken_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakedToken_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionStakingRewardsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<StakingRewards_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<StakingRewards_Filter>;
  block?: Maybe<Block_Height>;
};


export type SubscriptionAccountArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
};


export type SubscriptionAccountsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Account_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Account_Filter>;
  block?: Maybe<Block_Height>;
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
  name_not_contains?: Maybe<Scalars['String']>;
  name_starts_with?: Maybe<Scalars['String']>;
  name_not_starts_with?: Maybe<Scalars['String']>;
  name_ends_with?: Maybe<Scalars['String']>;
  name_not_ends_with?: Maybe<Scalars['String']>;
  symbol?: Maybe<Scalars['String']>;
  symbol_not?: Maybe<Scalars['String']>;
  symbol_gt?: Maybe<Scalars['String']>;
  symbol_lt?: Maybe<Scalars['String']>;
  symbol_gte?: Maybe<Scalars['String']>;
  symbol_lte?: Maybe<Scalars['String']>;
  symbol_in?: Maybe<Array<Scalars['String']>>;
  symbol_not_in?: Maybe<Array<Scalars['String']>>;
  symbol_contains?: Maybe<Scalars['String']>;
  symbol_not_contains?: Maybe<Scalars['String']>;
  symbol_starts_with?: Maybe<Scalars['String']>;
  symbol_not_starts_with?: Maybe<Scalars['String']>;
  symbol_ends_with?: Maybe<Scalars['String']>;
  symbol_not_ends_with?: Maybe<Scalars['String']>;
  totalSupply?: Maybe<Scalars['String']>;
  totalSupply_not?: Maybe<Scalars['String']>;
  totalSupply_gt?: Maybe<Scalars['String']>;
  totalSupply_lt?: Maybe<Scalars['String']>;
  totalSupply_gte?: Maybe<Scalars['String']>;
  totalSupply_lte?: Maybe<Scalars['String']>;
  totalSupply_in?: Maybe<Array<Scalars['String']>>;
  totalSupply_not_in?: Maybe<Array<Scalars['String']>>;
  totalSupply_contains?: Maybe<Scalars['String']>;
  totalSupply_not_contains?: Maybe<Scalars['String']>;
  totalSupply_starts_with?: Maybe<Scalars['String']>;
  totalSupply_not_starts_with?: Maybe<Scalars['String']>;
  totalSupply_ends_with?: Maybe<Scalars['String']>;
  totalSupply_not_ends_with?: Maybe<Scalars['String']>;
  totalBurned?: Maybe<Scalars['String']>;
  totalBurned_not?: Maybe<Scalars['String']>;
  totalBurned_gt?: Maybe<Scalars['String']>;
  totalBurned_lt?: Maybe<Scalars['String']>;
  totalBurned_gte?: Maybe<Scalars['String']>;
  totalBurned_lte?: Maybe<Scalars['String']>;
  totalBurned_in?: Maybe<Array<Scalars['String']>>;
  totalBurned_not_in?: Maybe<Array<Scalars['String']>>;
  totalBurned_contains?: Maybe<Scalars['String']>;
  totalBurned_not_contains?: Maybe<Scalars['String']>;
  totalBurned_starts_with?: Maybe<Scalars['String']>;
  totalBurned_not_starts_with?: Maybe<Scalars['String']>;
  totalBurned_ends_with?: Maybe<Scalars['String']>;
  totalBurned_not_ends_with?: Maybe<Scalars['String']>;
  totalMinted?: Maybe<Scalars['String']>;
  totalMinted_not?: Maybe<Scalars['String']>;
  totalMinted_gt?: Maybe<Scalars['String']>;
  totalMinted_lt?: Maybe<Scalars['String']>;
  totalMinted_gte?: Maybe<Scalars['String']>;
  totalMinted_lte?: Maybe<Scalars['String']>;
  totalMinted_in?: Maybe<Array<Scalars['String']>>;
  totalMinted_not_in?: Maybe<Array<Scalars['String']>>;
  totalMinted_contains?: Maybe<Scalars['String']>;
  totalMinted_not_contains?: Maybe<Scalars['String']>;
  totalMinted_starts_with?: Maybe<Scalars['String']>;
  totalMinted_not_starts_with?: Maybe<Scalars['String']>;
  totalMinted_ends_with?: Maybe<Scalars['String']>;
  totalMinted_not_ends_with?: Maybe<Scalars['String']>;
  totalTransfers?: Maybe<Scalars['String']>;
  totalTransfers_not?: Maybe<Scalars['String']>;
  totalTransfers_gt?: Maybe<Scalars['String']>;
  totalTransfers_lt?: Maybe<Scalars['String']>;
  totalTransfers_gte?: Maybe<Scalars['String']>;
  totalTransfers_lte?: Maybe<Scalars['String']>;
  totalTransfers_in?: Maybe<Array<Scalars['String']>>;
  totalTransfers_not_in?: Maybe<Array<Scalars['String']>>;
  totalTransfers_contains?: Maybe<Scalars['String']>;
  totalTransfers_not_contains?: Maybe<Scalars['String']>;
  totalTransfers_starts_with?: Maybe<Scalars['String']>;
  totalTransfers_not_starts_with?: Maybe<Scalars['String']>;
  totalTransfers_ends_with?: Maybe<Scalars['String']>;
  totalTransfers_not_ends_with?: Maybe<Scalars['String']>;
  totalMints?: Maybe<Scalars['String']>;
  totalMints_not?: Maybe<Scalars['String']>;
  totalMints_gt?: Maybe<Scalars['String']>;
  totalMints_lt?: Maybe<Scalars['String']>;
  totalMints_gte?: Maybe<Scalars['String']>;
  totalMints_lte?: Maybe<Scalars['String']>;
  totalMints_in?: Maybe<Array<Scalars['String']>>;
  totalMints_not_in?: Maybe<Array<Scalars['String']>>;
  totalMints_contains?: Maybe<Scalars['String']>;
  totalMints_not_contains?: Maybe<Scalars['String']>;
  totalMints_starts_with?: Maybe<Scalars['String']>;
  totalMints_not_starts_with?: Maybe<Scalars['String']>;
  totalMints_ends_with?: Maybe<Scalars['String']>;
  totalMints_not_ends_with?: Maybe<Scalars['String']>;
  totalBurns?: Maybe<Scalars['String']>;
  totalBurns_not?: Maybe<Scalars['String']>;
  totalBurns_gt?: Maybe<Scalars['String']>;
  totalBurns_lt?: Maybe<Scalars['String']>;
  totalBurns_gte?: Maybe<Scalars['String']>;
  totalBurns_lte?: Maybe<Scalars['String']>;
  totalBurns_in?: Maybe<Array<Scalars['String']>>;
  totalBurns_not_in?: Maybe<Array<Scalars['String']>>;
  totalBurns_contains?: Maybe<Scalars['String']>;
  totalBurns_not_contains?: Maybe<Scalars['String']>;
  totalBurns_starts_with?: Maybe<Scalars['String']>;
  totalBurns_not_starts_with?: Maybe<Scalars['String']>;
  totalBurns_ends_with?: Maybe<Scalars['String']>;
  totalBurns_not_ends_with?: Maybe<Scalars['String']>;
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

export type _Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']>;
  /** The block number */
  number: Scalars['Int'];
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

export type MetricFieldsFragment = Pick<Metric, 'id' | 'exact' | 'decimals' | 'simple'>;

export type TokenAllFragment = (
  Pick<Token, 'id' | 'address' | 'decimals' | 'symbol'>
  & { totalSupply: MetricFieldsFragment }
);

export type StakingQueryVariables = {
  account: Scalars['ID'];
  hasAccount: Scalars['Boolean'];
};


export type StakingQuery = { stakedToken?: Maybe<(
    Pick<StakedToken, 'address' | 'questSigner' | 'UNSTAKE_WINDOW' | 'COOLDOWN_SECONDS' | 'COOLDOWN_PERCENTAGE_SCALE' | 'collateralisationRatio' | 'slashingPercentage'>
    & { token: TokenAllFragment, stakingToken: TokenAllFragment, stakingRewards: (
      Pick<StakingRewards, 'DURATION' | 'periodFinish' | 'lastUpdateTime' | 'rewardRate' | 'rewardPerTokenStored' | 'rewardsTokenVendor' | 'rewardsDistributor' | 'pendingAdditionalReward'>
      & { rewardsToken: TokenAllFragment }
    ), season: Pick<Season, 'id' | 'endedAt' | 'startedAt' | 'seasonNumber'> }
  )>, accounts: Array<(
    Pick<Account, 'id' | 'rewardPerTokenPaid' | 'rewards' | 'cooldownTimestamp'>
    & { delegatee?: Maybe<Pick<Account, 'id'>>, delegators: Array<Pick<Account, 'id'>>, completedQuests: Array<Pick<CompletedQuest, 'id'>>, balance: Pick<Balance, 'lastAction' | 'permMultiplier' | 'timeMultiplier' | 'seasonMultiplier' | 'cooldownMultiplier' | 'raw' | 'votes' | 'weightedTimestamp'> }
  )>, quests: Array<Pick<Quest, 'id'>> };

export const MetricFieldsFragmentDoc = gql`
    fragment MetricFields on Metric {
  id
  exact
  decimals
  simple
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
export const StakingDocument = gql`
    query Staking($account: ID!, $hasAccount: Boolean!) @api(name: staking) {
  stakedToken(id: "StakedToken") {
    address
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
    questSigner
    UNSTAKE_WINDOW
    COOLDOWN_SECONDS
    COOLDOWN_PERCENTAGE_SCALE
    collateralisationRatio
    slashingPercentage
    season {
      id
      endedAt
      startedAt
      seasonNumber
    }
  }
  accounts(where: {id: $account}) @include(if: $hasAccount) {
    id
    delegatee {
      id
    }
    rewardPerTokenPaid
    rewards
    delegators {
      id
    }
    completedQuests {
      id
    }
    cooldownTimestamp
    cooldownTimestamp
    balance {
      lastAction
      permMultiplier
      timeMultiplier
      seasonMultiplier
      cooldownMultiplier
      raw
      votes
      weightedTimestamp
    }
  }
  quests {
    id
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
 *      account: // value for 'account'
 *      hasAccount: // value for 'hasAccount'
 *   },
 * });
 */
export function useStakingQuery(baseOptions?: ApolloReactHooks.QueryHookOptions<StakingQuery, StakingQueryVariables>) {
        return ApolloReactHooks.useQuery<StakingQuery, StakingQueryVariables>(StakingDocument, baseOptions);
      }
export function useStakingLazyQuery(baseOptions?: ApolloReactHooks.LazyQueryHookOptions<StakingQuery, StakingQueryVariables>) {
          return ApolloReactHooks.useLazyQuery<StakingQuery, StakingQueryVariables>(StakingDocument, baseOptions);
        }
export type StakingQueryHookResult = ReturnType<typeof useStakingQuery>;
export type StakingLazyQueryHookResult = ReturnType<typeof useStakingLazyQuery>;
export type StakingQueryResult = ApolloReactCommon.QueryResult<StakingQuery, StakingQueryVariables>;