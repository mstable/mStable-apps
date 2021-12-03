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
    "Transaction": []
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







export type Block_Height = {
  hash?: Maybe<Scalars['Bytes']>;
  number?: Maybe<Scalars['Int']>;
  number_gte?: Maybe<Scalars['Int']>;
};


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

export type Dial = {
  /** ID: {emissionsController.id}.{dialId} */
  id: Scalars['ID'];
  /** Numeric dial ID (array position on EmissionsController dials) */
  dialId: Scalars['Int'];
  /** Emissions Controller this Dial is part of */
  emissionsController: EmissionsController;
  /**
   * If true, no rewards are distributed to the dial
   * recipient and any votes on this dial are ignored
   */
  disabled: Scalars['Boolean'];
  /** Cap on distribution % where 1% = 1 */
  cap: Scalars['Int'];
  /** Dial rewards that are waiting to be distributed to recipient */
  balance: Scalars['BigInt'];
  /** Account rewards are distributed to */
  recipient: Scalars['Bytes'];
  /** Current Preferences for this Dial */
  preferences: Array<Preference>;
  /** DialVotesForEpoch for this Dial; see "HistoricVotes" struct */
  dialVotes?: Maybe<Array<DialVotesForEpoch>>;
};


export type DialPreferencesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Preference_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Preference_Filter>;
};


export type DialDialVotesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<DialVotesForEpoch_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<DialVotesForEpoch_Filter>;
};

export type DialVotesForEpoch = {
  /** ID: {dial.id}.{epoch.id} */
  id: Scalars['ID'];
  dial: Dial;
  epoch: Epoch;
  /** Number of votes directed to this Dial for this Epoch */
  votes: Scalars['BigInt'];
};

export type DialVotesForEpoch_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  dial?: Maybe<Scalars['String']>;
  dial_not?: Maybe<Scalars['String']>;
  dial_gt?: Maybe<Scalars['String']>;
  dial_lt?: Maybe<Scalars['String']>;
  dial_gte?: Maybe<Scalars['String']>;
  dial_lte?: Maybe<Scalars['String']>;
  dial_in?: Maybe<Array<Scalars['String']>>;
  dial_not_in?: Maybe<Array<Scalars['String']>>;
  dial_contains?: Maybe<Scalars['String']>;
  dial_not_contains?: Maybe<Scalars['String']>;
  dial_starts_with?: Maybe<Scalars['String']>;
  dial_not_starts_with?: Maybe<Scalars['String']>;
  dial_ends_with?: Maybe<Scalars['String']>;
  dial_not_ends_with?: Maybe<Scalars['String']>;
  epoch?: Maybe<Scalars['String']>;
  epoch_not?: Maybe<Scalars['String']>;
  epoch_gt?: Maybe<Scalars['String']>;
  epoch_lt?: Maybe<Scalars['String']>;
  epoch_gte?: Maybe<Scalars['String']>;
  epoch_lte?: Maybe<Scalars['String']>;
  epoch_in?: Maybe<Array<Scalars['String']>>;
  epoch_not_in?: Maybe<Array<Scalars['String']>>;
  epoch_contains?: Maybe<Scalars['String']>;
  epoch_not_contains?: Maybe<Scalars['String']>;
  epoch_starts_with?: Maybe<Scalars['String']>;
  epoch_not_starts_with?: Maybe<Scalars['String']>;
  epoch_ends_with?: Maybe<Scalars['String']>;
  epoch_not_ends_with?: Maybe<Scalars['String']>;
  votes?: Maybe<Scalars['BigInt']>;
  votes_not?: Maybe<Scalars['BigInt']>;
  votes_gt?: Maybe<Scalars['BigInt']>;
  votes_lt?: Maybe<Scalars['BigInt']>;
  votes_gte?: Maybe<Scalars['BigInt']>;
  votes_lte?: Maybe<Scalars['BigInt']>;
  votes_in?: Maybe<Array<Scalars['BigInt']>>;
  votes_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum DialVotesForEpoch_OrderBy {
  Id = 'id',
  Dial = 'dial',
  Epoch = 'epoch',
  Votes = 'votes'
}

export type Dial_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  dialId?: Maybe<Scalars['Int']>;
  dialId_not?: Maybe<Scalars['Int']>;
  dialId_gt?: Maybe<Scalars['Int']>;
  dialId_lt?: Maybe<Scalars['Int']>;
  dialId_gte?: Maybe<Scalars['Int']>;
  dialId_lte?: Maybe<Scalars['Int']>;
  dialId_in?: Maybe<Array<Scalars['Int']>>;
  dialId_not_in?: Maybe<Array<Scalars['Int']>>;
  emissionsController?: Maybe<Scalars['String']>;
  emissionsController_not?: Maybe<Scalars['String']>;
  emissionsController_gt?: Maybe<Scalars['String']>;
  emissionsController_lt?: Maybe<Scalars['String']>;
  emissionsController_gte?: Maybe<Scalars['String']>;
  emissionsController_lte?: Maybe<Scalars['String']>;
  emissionsController_in?: Maybe<Array<Scalars['String']>>;
  emissionsController_not_in?: Maybe<Array<Scalars['String']>>;
  emissionsController_contains?: Maybe<Scalars['String']>;
  emissionsController_not_contains?: Maybe<Scalars['String']>;
  emissionsController_starts_with?: Maybe<Scalars['String']>;
  emissionsController_not_starts_with?: Maybe<Scalars['String']>;
  emissionsController_ends_with?: Maybe<Scalars['String']>;
  emissionsController_not_ends_with?: Maybe<Scalars['String']>;
  disabled?: Maybe<Scalars['Boolean']>;
  disabled_not?: Maybe<Scalars['Boolean']>;
  disabled_in?: Maybe<Array<Scalars['Boolean']>>;
  disabled_not_in?: Maybe<Array<Scalars['Boolean']>>;
  cap?: Maybe<Scalars['Int']>;
  cap_not?: Maybe<Scalars['Int']>;
  cap_gt?: Maybe<Scalars['Int']>;
  cap_lt?: Maybe<Scalars['Int']>;
  cap_gte?: Maybe<Scalars['Int']>;
  cap_lte?: Maybe<Scalars['Int']>;
  cap_in?: Maybe<Array<Scalars['Int']>>;
  cap_not_in?: Maybe<Array<Scalars['Int']>>;
  balance?: Maybe<Scalars['BigInt']>;
  balance_not?: Maybe<Scalars['BigInt']>;
  balance_gt?: Maybe<Scalars['BigInt']>;
  balance_lt?: Maybe<Scalars['BigInt']>;
  balance_gte?: Maybe<Scalars['BigInt']>;
  balance_lte?: Maybe<Scalars['BigInt']>;
  balance_in?: Maybe<Array<Scalars['BigInt']>>;
  balance_not_in?: Maybe<Array<Scalars['BigInt']>>;
  recipient?: Maybe<Scalars['Bytes']>;
  recipient_not?: Maybe<Scalars['Bytes']>;
  recipient_in?: Maybe<Array<Scalars['Bytes']>>;
  recipient_not_in?: Maybe<Array<Scalars['Bytes']>>;
  recipient_contains?: Maybe<Scalars['Bytes']>;
  recipient_not_contains?: Maybe<Scalars['Bytes']>;
};

export enum Dial_OrderBy {
  Id = 'id',
  DialId = 'dialId',
  EmissionsController = 'emissionsController',
  Disabled = 'disabled',
  Cap = 'cap',
  Balance = 'balance',
  Recipient = 'recipient',
  Preferences = 'preferences',
  DialVotes = 'dialVotes'
}

export type EmissionsController = {
  /** The ID is the address */
  id: Scalars['ID'];
  address: Scalars['Bytes'];
  /** Address of rewards token. i.e. MTA token */
  rewardToken: Token;
  /** List of staking contract addresses used to determine voting power */
  stakingContracts: Array<Scalars['Bytes']>;
  /** First weekly Epoch of this contract. */
  startEpoch: Epoch;
  /** The last weekly Epoch to have rewards distributed. */
  lastEpoch: Epoch;
  /** Dials for this Emissions Controller */
  dials: Array<Dial>;
  /** Voters for this Emissions Controller */
  voters: Array<Voter>;
  /** Epochs for this Emissions Controller */
  epochs: Array<Epoch>;
};


export type EmissionsControllerDialsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Dial_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Dial_Filter>;
};


export type EmissionsControllerVotersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Voter_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Voter_Filter>;
};


export type EmissionsControllerEpochsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Epoch_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Epoch_Filter>;
};

export type EmissionsController_Filter = {
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
  rewardToken?: Maybe<Scalars['String']>;
  rewardToken_not?: Maybe<Scalars['String']>;
  rewardToken_gt?: Maybe<Scalars['String']>;
  rewardToken_lt?: Maybe<Scalars['String']>;
  rewardToken_gte?: Maybe<Scalars['String']>;
  rewardToken_lte?: Maybe<Scalars['String']>;
  rewardToken_in?: Maybe<Array<Scalars['String']>>;
  rewardToken_not_in?: Maybe<Array<Scalars['String']>>;
  rewardToken_contains?: Maybe<Scalars['String']>;
  rewardToken_not_contains?: Maybe<Scalars['String']>;
  rewardToken_starts_with?: Maybe<Scalars['String']>;
  rewardToken_not_starts_with?: Maybe<Scalars['String']>;
  rewardToken_ends_with?: Maybe<Scalars['String']>;
  rewardToken_not_ends_with?: Maybe<Scalars['String']>;
  stakingContracts?: Maybe<Array<Scalars['Bytes']>>;
  stakingContracts_not?: Maybe<Array<Scalars['Bytes']>>;
  stakingContracts_contains?: Maybe<Array<Scalars['Bytes']>>;
  stakingContracts_not_contains?: Maybe<Array<Scalars['Bytes']>>;
  startEpoch?: Maybe<Scalars['String']>;
  startEpoch_not?: Maybe<Scalars['String']>;
  startEpoch_gt?: Maybe<Scalars['String']>;
  startEpoch_lt?: Maybe<Scalars['String']>;
  startEpoch_gte?: Maybe<Scalars['String']>;
  startEpoch_lte?: Maybe<Scalars['String']>;
  startEpoch_in?: Maybe<Array<Scalars['String']>>;
  startEpoch_not_in?: Maybe<Array<Scalars['String']>>;
  startEpoch_contains?: Maybe<Scalars['String']>;
  startEpoch_not_contains?: Maybe<Scalars['String']>;
  startEpoch_starts_with?: Maybe<Scalars['String']>;
  startEpoch_not_starts_with?: Maybe<Scalars['String']>;
  startEpoch_ends_with?: Maybe<Scalars['String']>;
  startEpoch_not_ends_with?: Maybe<Scalars['String']>;
  lastEpoch?: Maybe<Scalars['String']>;
  lastEpoch_not?: Maybe<Scalars['String']>;
  lastEpoch_gt?: Maybe<Scalars['String']>;
  lastEpoch_lt?: Maybe<Scalars['String']>;
  lastEpoch_gte?: Maybe<Scalars['String']>;
  lastEpoch_lte?: Maybe<Scalars['String']>;
  lastEpoch_in?: Maybe<Array<Scalars['String']>>;
  lastEpoch_not_in?: Maybe<Array<Scalars['String']>>;
  lastEpoch_contains?: Maybe<Scalars['String']>;
  lastEpoch_not_contains?: Maybe<Scalars['String']>;
  lastEpoch_starts_with?: Maybe<Scalars['String']>;
  lastEpoch_not_starts_with?: Maybe<Scalars['String']>;
  lastEpoch_ends_with?: Maybe<Scalars['String']>;
  lastEpoch_not_ends_with?: Maybe<Scalars['String']>;
};

export enum EmissionsController_OrderBy {
  Id = 'id',
  Address = 'address',
  RewardToken = 'rewardToken',
  StakingContracts = 'stakingContracts',
  StartEpoch = 'startEpoch',
  LastEpoch = 'lastEpoch',
  Dials = 'dials',
  Voters = 'voters',
  Epochs = 'epochs'
}

export type Epoch = {
  /** {emissionsController.id}.{weekNumber} */
  id: Scalars['ID'];
  /** EmissionsController this Epoch belongs to */
  emissionsController: EmissionsController;
  /** UNIX week number */
  weekNumber: Scalars['Int'];
  /** Voters who last voted in this epoch */
  voters: Array<Voter>;
  /** Total from the top-level emissions for this Epoch */
  emission: Scalars['BigInt'];
  /** DialVotesForEpoch for this Epoch; see "HistoricVotes" struct */
  dialVotes: Array<DialVotesForEpoch>;
};


export type EpochVotersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Voter_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Voter_Filter>;
};


export type EpochDialVotesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<DialVotesForEpoch_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<DialVotesForEpoch_Filter>;
};

export type Epoch_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  emissionsController?: Maybe<Scalars['String']>;
  emissionsController_not?: Maybe<Scalars['String']>;
  emissionsController_gt?: Maybe<Scalars['String']>;
  emissionsController_lt?: Maybe<Scalars['String']>;
  emissionsController_gte?: Maybe<Scalars['String']>;
  emissionsController_lte?: Maybe<Scalars['String']>;
  emissionsController_in?: Maybe<Array<Scalars['String']>>;
  emissionsController_not_in?: Maybe<Array<Scalars['String']>>;
  emissionsController_contains?: Maybe<Scalars['String']>;
  emissionsController_not_contains?: Maybe<Scalars['String']>;
  emissionsController_starts_with?: Maybe<Scalars['String']>;
  emissionsController_not_starts_with?: Maybe<Scalars['String']>;
  emissionsController_ends_with?: Maybe<Scalars['String']>;
  emissionsController_not_ends_with?: Maybe<Scalars['String']>;
  weekNumber?: Maybe<Scalars['Int']>;
  weekNumber_not?: Maybe<Scalars['Int']>;
  weekNumber_gt?: Maybe<Scalars['Int']>;
  weekNumber_lt?: Maybe<Scalars['Int']>;
  weekNumber_gte?: Maybe<Scalars['Int']>;
  weekNumber_lte?: Maybe<Scalars['Int']>;
  weekNumber_in?: Maybe<Array<Scalars['Int']>>;
  weekNumber_not_in?: Maybe<Array<Scalars['Int']>>;
  emission?: Maybe<Scalars['BigInt']>;
  emission_not?: Maybe<Scalars['BigInt']>;
  emission_gt?: Maybe<Scalars['BigInt']>;
  emission_lt?: Maybe<Scalars['BigInt']>;
  emission_gte?: Maybe<Scalars['BigInt']>;
  emission_lte?: Maybe<Scalars['BigInt']>;
  emission_in?: Maybe<Array<Scalars['BigInt']>>;
  emission_not_in?: Maybe<Array<Scalars['BigInt']>>;
};

export enum Epoch_OrderBy {
  Id = 'id',
  EmissionsController = 'emissionsController',
  WeekNumber = 'weekNumber',
  Voters = 'voters',
  Emission = 'emission',
  DialVotes = 'dialVotes'
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

export type Preference = {
  /** {voter.id}.{dial.id} */
  id: Scalars['ID'];
  voter: Voter;
  dial: Dial;
  /** % weight applied to this dial, where 200 = 100% and 1 = 0.5% */
  weight: Scalars['Int'];
};

export type Preference_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  voter?: Maybe<Scalars['String']>;
  voter_not?: Maybe<Scalars['String']>;
  voter_gt?: Maybe<Scalars['String']>;
  voter_lt?: Maybe<Scalars['String']>;
  voter_gte?: Maybe<Scalars['String']>;
  voter_lte?: Maybe<Scalars['String']>;
  voter_in?: Maybe<Array<Scalars['String']>>;
  voter_not_in?: Maybe<Array<Scalars['String']>>;
  voter_contains?: Maybe<Scalars['String']>;
  voter_not_contains?: Maybe<Scalars['String']>;
  voter_starts_with?: Maybe<Scalars['String']>;
  voter_not_starts_with?: Maybe<Scalars['String']>;
  voter_ends_with?: Maybe<Scalars['String']>;
  voter_not_ends_with?: Maybe<Scalars['String']>;
  dial?: Maybe<Scalars['String']>;
  dial_not?: Maybe<Scalars['String']>;
  dial_gt?: Maybe<Scalars['String']>;
  dial_lt?: Maybe<Scalars['String']>;
  dial_gte?: Maybe<Scalars['String']>;
  dial_lte?: Maybe<Scalars['String']>;
  dial_in?: Maybe<Array<Scalars['String']>>;
  dial_not_in?: Maybe<Array<Scalars['String']>>;
  dial_contains?: Maybe<Scalars['String']>;
  dial_not_contains?: Maybe<Scalars['String']>;
  dial_starts_with?: Maybe<Scalars['String']>;
  dial_not_starts_with?: Maybe<Scalars['String']>;
  dial_ends_with?: Maybe<Scalars['String']>;
  dial_not_ends_with?: Maybe<Scalars['String']>;
  weight?: Maybe<Scalars['Int']>;
  weight_not?: Maybe<Scalars['Int']>;
  weight_gt?: Maybe<Scalars['Int']>;
  weight_lt?: Maybe<Scalars['Int']>;
  weight_gte?: Maybe<Scalars['Int']>;
  weight_lte?: Maybe<Scalars['Int']>;
  weight_in?: Maybe<Array<Scalars['Int']>>;
  weight_not_in?: Maybe<Array<Scalars['Int']>>;
};

export enum Preference_OrderBy {
  Id = 'id',
  Voter = 'voter',
  Dial = 'dial',
  Weight = 'weight'
}

export type Query = {
  token?: Maybe<Token>;
  tokens: Array<Token>;
  metric?: Maybe<Metric>;
  metrics: Array<Metric>;
  counter?: Maybe<Counter>;
  counters: Array<Counter>;
  emissionsController?: Maybe<EmissionsController>;
  emissionsControllers: Array<EmissionsController>;
  epoch?: Maybe<Epoch>;
  epoches: Array<Epoch>;
  dial?: Maybe<Dial>;
  dials: Array<Dial>;
  dialVotesForEpoch?: Maybe<DialVotesForEpoch>;
  dialVotesForEpoches: Array<DialVotesForEpoch>;
  voter?: Maybe<Voter>;
  voters: Array<Voter>;
  preference?: Maybe<Preference>;
  preferences: Array<Preference>;
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


export type QueryEmissionsControllerArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryEmissionsControllersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<EmissionsController_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<EmissionsController_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryEpochArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryEpochesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Epoch_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Epoch_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDialArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDialsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Dial_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Dial_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDialVotesForEpochArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryDialVotesForEpochesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<DialVotesForEpoch_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<DialVotesForEpoch_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryVoterArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryVotersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Voter_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Voter_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPreferenceArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryPreferencesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Preference_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Preference_Filter>;
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

export type Subscription = {
  token?: Maybe<Token>;
  tokens: Array<Token>;
  metric?: Maybe<Metric>;
  metrics: Array<Metric>;
  counter?: Maybe<Counter>;
  counters: Array<Counter>;
  emissionsController?: Maybe<EmissionsController>;
  emissionsControllers: Array<EmissionsController>;
  epoch?: Maybe<Epoch>;
  epoches: Array<Epoch>;
  dial?: Maybe<Dial>;
  dials: Array<Dial>;
  dialVotesForEpoch?: Maybe<DialVotesForEpoch>;
  dialVotesForEpoches: Array<DialVotesForEpoch>;
  voter?: Maybe<Voter>;
  voters: Array<Voter>;
  preference?: Maybe<Preference>;
  preferences: Array<Preference>;
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


export type SubscriptionEmissionsControllerArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionEmissionsControllersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<EmissionsController_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<EmissionsController_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionEpochArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionEpochesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Epoch_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Epoch_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDialArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDialsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Dial_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Dial_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDialVotesForEpochArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionDialVotesForEpochesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<DialVotesForEpoch_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<DialVotesForEpoch_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionVoterArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionVotersArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Voter_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Voter_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPreferenceArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionPreferencesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Preference_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Preference_Filter>;
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
};

export enum Transaction_OrderBy {
  Id = 'id',
  Hash = 'hash',
  Block = 'block',
  Timestamp = 'timestamp',
  Sender = 'sender'
}

export type Voter = {
  /** ID: emissionsController.address */
  id: Scalars['ID'];
  address: Scalars['Bytes'];
  emissionsController: EmissionsController;
  /** Latest tally of votes cast by this voter */
  votesCast: Scalars['BigInt'];
  /** Last time balance was looked up across all staking contracts */
  lastSourcePoke: Scalars['Int'];
  /** The last Epoch the Voter set Preferences for */
  lastEpoch?: Maybe<Epoch>;
  /** Preferences set by this Voter */
  preferences: Array<Preference>;
};


export type VoterPreferencesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Preference_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Preference_Filter>;
};

export type Voter_Filter = {
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
  emissionsController?: Maybe<Scalars['String']>;
  emissionsController_not?: Maybe<Scalars['String']>;
  emissionsController_gt?: Maybe<Scalars['String']>;
  emissionsController_lt?: Maybe<Scalars['String']>;
  emissionsController_gte?: Maybe<Scalars['String']>;
  emissionsController_lte?: Maybe<Scalars['String']>;
  emissionsController_in?: Maybe<Array<Scalars['String']>>;
  emissionsController_not_in?: Maybe<Array<Scalars['String']>>;
  emissionsController_contains?: Maybe<Scalars['String']>;
  emissionsController_not_contains?: Maybe<Scalars['String']>;
  emissionsController_starts_with?: Maybe<Scalars['String']>;
  emissionsController_not_starts_with?: Maybe<Scalars['String']>;
  emissionsController_ends_with?: Maybe<Scalars['String']>;
  emissionsController_not_ends_with?: Maybe<Scalars['String']>;
  votesCast?: Maybe<Scalars['BigInt']>;
  votesCast_not?: Maybe<Scalars['BigInt']>;
  votesCast_gt?: Maybe<Scalars['BigInt']>;
  votesCast_lt?: Maybe<Scalars['BigInt']>;
  votesCast_gte?: Maybe<Scalars['BigInt']>;
  votesCast_lte?: Maybe<Scalars['BigInt']>;
  votesCast_in?: Maybe<Array<Scalars['BigInt']>>;
  votesCast_not_in?: Maybe<Array<Scalars['BigInt']>>;
  lastSourcePoke?: Maybe<Scalars['Int']>;
  lastSourcePoke_not?: Maybe<Scalars['Int']>;
  lastSourcePoke_gt?: Maybe<Scalars['Int']>;
  lastSourcePoke_lt?: Maybe<Scalars['Int']>;
  lastSourcePoke_gte?: Maybe<Scalars['Int']>;
  lastSourcePoke_lte?: Maybe<Scalars['Int']>;
  lastSourcePoke_in?: Maybe<Array<Scalars['Int']>>;
  lastSourcePoke_not_in?: Maybe<Array<Scalars['Int']>>;
  lastEpoch?: Maybe<Scalars['String']>;
  lastEpoch_not?: Maybe<Scalars['String']>;
  lastEpoch_gt?: Maybe<Scalars['String']>;
  lastEpoch_lt?: Maybe<Scalars['String']>;
  lastEpoch_gte?: Maybe<Scalars['String']>;
  lastEpoch_lte?: Maybe<Scalars['String']>;
  lastEpoch_in?: Maybe<Array<Scalars['String']>>;
  lastEpoch_not_in?: Maybe<Array<Scalars['String']>>;
  lastEpoch_contains?: Maybe<Scalars['String']>;
  lastEpoch_not_contains?: Maybe<Scalars['String']>;
  lastEpoch_starts_with?: Maybe<Scalars['String']>;
  lastEpoch_not_starts_with?: Maybe<Scalars['String']>;
  lastEpoch_ends_with?: Maybe<Scalars['String']>;
  lastEpoch_not_ends_with?: Maybe<Scalars['String']>;
};

export enum Voter_OrderBy {
  Id = 'id',
  Address = 'address',
  EmissionsController = 'emissionsController',
  VotesCast = 'votesCast',
  LastSourcePoke = 'lastSourcePoke',
  LastEpoch = 'lastEpoch',
  Preferences = 'preferences'
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

export type EmissionsQueryVariables = Exact<{
  account: Scalars['Bytes'];
  hasAccount: Scalars['Boolean'];
}>;


export type EmissionsQuery = { emissionsControllers: Array<{ id: string, stakingContracts: Array<string>, dials: Array<{ id: string, dialId: number, recipient: string, preferences: Array<{ weight: number }>, dialVotes?: Array<{ votes: string }> | null | undefined }>, epochs: Array<{ id: string, weekNumber: number, emission: string }> }>, voters?: Array<{ id: string, address: string, preferences: Array<{ weight: number, dial: { dialId: number, recipient: string } }> }> };


export const EmissionsDocument = gql`
    query Emissions($account: Bytes!, $hasAccount: Boolean!) {
  emissionsControllers {
    id
    stakingContracts
    dials {
      id
      dialId
      preferences {
        weight
      }
      dialVotes {
        votes
      }
      recipient
    }
    epochs {
      id
      weekNumber
      emission
    }
  }
  voters(where: {address: $account}) @include(if: $hasAccount) {
    id
    address
    preferences {
      weight
      dial {
        dialId
        recipient
      }
    }
  }
}
    `;

/**
 * __useEmissionsQuery__
 *
 * To run a query within a React component, call `useEmissionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useEmissionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEmissionsQuery({
 *   variables: {
 *      account: // value for 'account'
 *      hasAccount: // value for 'hasAccount'
 *   },
 * });
 */
export function useEmissionsQuery(baseOptions: Apollo.QueryHookOptions<EmissionsQuery, EmissionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EmissionsQuery, EmissionsQueryVariables>(EmissionsDocument, options);
      }
export function useEmissionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EmissionsQuery, EmissionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EmissionsQuery, EmissionsQueryVariables>(EmissionsDocument, options);
        }
export type EmissionsQueryHookResult = ReturnType<typeof useEmissionsQuery>;
export type EmissionsLazyQueryHookResult = ReturnType<typeof useEmissionsLazyQuery>;
export type EmissionsQueryResult = Apollo.QueryResult<EmissionsQuery, EmissionsQueryVariables>;