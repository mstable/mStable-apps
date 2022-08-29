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
  "possibleTypes": {}
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




/** User account for a Merkle Drop */
export type Account = {
  /** merkleDrop.address */
  id: Scalars['ID'];
  address: Scalars['Bytes'];
  claims: Array<Claim>;
  lastClaimedTranche?: Maybe<Tranche>;
  merkleDrop: MerkleDrop;
};


/** User account for a Merkle Drop */
export type AccountClaimsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Claim_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Claim_Filter>;
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
  address?: Maybe<Scalars['Bytes']>;
  address_not?: Maybe<Scalars['Bytes']>;
  address_in?: Maybe<Array<Scalars['Bytes']>>;
  address_not_in?: Maybe<Array<Scalars['Bytes']>>;
  address_contains?: Maybe<Scalars['Bytes']>;
  address_not_contains?: Maybe<Scalars['Bytes']>;
  claims_?: Maybe<Claim_Filter>;
  lastClaimedTranche?: Maybe<Scalars['String']>;
  lastClaimedTranche_not?: Maybe<Scalars['String']>;
  lastClaimedTranche_gt?: Maybe<Scalars['String']>;
  lastClaimedTranche_lt?: Maybe<Scalars['String']>;
  lastClaimedTranche_gte?: Maybe<Scalars['String']>;
  lastClaimedTranche_lte?: Maybe<Scalars['String']>;
  lastClaimedTranche_in?: Maybe<Array<Scalars['String']>>;
  lastClaimedTranche_not_in?: Maybe<Array<Scalars['String']>>;
  lastClaimedTranche_contains?: Maybe<Scalars['String']>;
  lastClaimedTranche_contains_nocase?: Maybe<Scalars['String']>;
  lastClaimedTranche_not_contains?: Maybe<Scalars['String']>;
  lastClaimedTranche_not_contains_nocase?: Maybe<Scalars['String']>;
  lastClaimedTranche_starts_with?: Maybe<Scalars['String']>;
  lastClaimedTranche_starts_with_nocase?: Maybe<Scalars['String']>;
  lastClaimedTranche_not_starts_with?: Maybe<Scalars['String']>;
  lastClaimedTranche_not_starts_with_nocase?: Maybe<Scalars['String']>;
  lastClaimedTranche_ends_with?: Maybe<Scalars['String']>;
  lastClaimedTranche_ends_with_nocase?: Maybe<Scalars['String']>;
  lastClaimedTranche_not_ends_with?: Maybe<Scalars['String']>;
  lastClaimedTranche_not_ends_with_nocase?: Maybe<Scalars['String']>;
  lastClaimedTranche_?: Maybe<Tranche_Filter>;
  merkleDrop?: Maybe<Scalars['String']>;
  merkleDrop_not?: Maybe<Scalars['String']>;
  merkleDrop_gt?: Maybe<Scalars['String']>;
  merkleDrop_lt?: Maybe<Scalars['String']>;
  merkleDrop_gte?: Maybe<Scalars['String']>;
  merkleDrop_lte?: Maybe<Scalars['String']>;
  merkleDrop_in?: Maybe<Array<Scalars['String']>>;
  merkleDrop_not_in?: Maybe<Array<Scalars['String']>>;
  merkleDrop_contains?: Maybe<Scalars['String']>;
  merkleDrop_contains_nocase?: Maybe<Scalars['String']>;
  merkleDrop_not_contains?: Maybe<Scalars['String']>;
  merkleDrop_not_contains_nocase?: Maybe<Scalars['String']>;
  merkleDrop_starts_with?: Maybe<Scalars['String']>;
  merkleDrop_starts_with_nocase?: Maybe<Scalars['String']>;
  merkleDrop_not_starts_with?: Maybe<Scalars['String']>;
  merkleDrop_not_starts_with_nocase?: Maybe<Scalars['String']>;
  merkleDrop_ends_with?: Maybe<Scalars['String']>;
  merkleDrop_ends_with_nocase?: Maybe<Scalars['String']>;
  merkleDrop_not_ends_with?: Maybe<Scalars['String']>;
  merkleDrop_not_ends_with_nocase?: Maybe<Scalars['String']>;
  merkleDrop_?: Maybe<MerkleDrop_Filter>;
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
};

export enum Account_OrderBy {
  Id = 'id',
  Address = 'address',
  Claims = 'claims',
  LastClaimedTranche = 'lastClaimedTranche',
  MerkleDrop = 'merkleDrop'
}




export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_Height = {
  hash?: Maybe<Scalars['Bytes']>;
  number?: Maybe<Scalars['Int']>;
  number_gte?: Maybe<Scalars['Int']>;
};


/** A claim for a tranche of a Merkle Drop */
export type Claim = {
  /** tranche.account */
  id: Scalars['ID'];
  account: Account;
  merkleDrop: MerkleDrop;
  tranche: Tranche;
  amount: Scalars['BigInt'];
  claimed: Scalars['Boolean'];
  claimedAt: Scalars['Int'];
};

export type Claim_Filter = {
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
  merkleDrop?: Maybe<Scalars['String']>;
  merkleDrop_not?: Maybe<Scalars['String']>;
  merkleDrop_gt?: Maybe<Scalars['String']>;
  merkleDrop_lt?: Maybe<Scalars['String']>;
  merkleDrop_gte?: Maybe<Scalars['String']>;
  merkleDrop_lte?: Maybe<Scalars['String']>;
  merkleDrop_in?: Maybe<Array<Scalars['String']>>;
  merkleDrop_not_in?: Maybe<Array<Scalars['String']>>;
  merkleDrop_contains?: Maybe<Scalars['String']>;
  merkleDrop_contains_nocase?: Maybe<Scalars['String']>;
  merkleDrop_not_contains?: Maybe<Scalars['String']>;
  merkleDrop_not_contains_nocase?: Maybe<Scalars['String']>;
  merkleDrop_starts_with?: Maybe<Scalars['String']>;
  merkleDrop_starts_with_nocase?: Maybe<Scalars['String']>;
  merkleDrop_not_starts_with?: Maybe<Scalars['String']>;
  merkleDrop_not_starts_with_nocase?: Maybe<Scalars['String']>;
  merkleDrop_ends_with?: Maybe<Scalars['String']>;
  merkleDrop_ends_with_nocase?: Maybe<Scalars['String']>;
  merkleDrop_not_ends_with?: Maybe<Scalars['String']>;
  merkleDrop_not_ends_with_nocase?: Maybe<Scalars['String']>;
  merkleDrop_?: Maybe<MerkleDrop_Filter>;
  tranche?: Maybe<Scalars['String']>;
  tranche_not?: Maybe<Scalars['String']>;
  tranche_gt?: Maybe<Scalars['String']>;
  tranche_lt?: Maybe<Scalars['String']>;
  tranche_gte?: Maybe<Scalars['String']>;
  tranche_lte?: Maybe<Scalars['String']>;
  tranche_in?: Maybe<Array<Scalars['String']>>;
  tranche_not_in?: Maybe<Array<Scalars['String']>>;
  tranche_contains?: Maybe<Scalars['String']>;
  tranche_contains_nocase?: Maybe<Scalars['String']>;
  tranche_not_contains?: Maybe<Scalars['String']>;
  tranche_not_contains_nocase?: Maybe<Scalars['String']>;
  tranche_starts_with?: Maybe<Scalars['String']>;
  tranche_starts_with_nocase?: Maybe<Scalars['String']>;
  tranche_not_starts_with?: Maybe<Scalars['String']>;
  tranche_not_starts_with_nocase?: Maybe<Scalars['String']>;
  tranche_ends_with?: Maybe<Scalars['String']>;
  tranche_ends_with_nocase?: Maybe<Scalars['String']>;
  tranche_not_ends_with?: Maybe<Scalars['String']>;
  tranche_not_ends_with_nocase?: Maybe<Scalars['String']>;
  tranche_?: Maybe<Tranche_Filter>;
  amount?: Maybe<Scalars['BigInt']>;
  amount_not?: Maybe<Scalars['BigInt']>;
  amount_gt?: Maybe<Scalars['BigInt']>;
  amount_lt?: Maybe<Scalars['BigInt']>;
  amount_gte?: Maybe<Scalars['BigInt']>;
  amount_lte?: Maybe<Scalars['BigInt']>;
  amount_in?: Maybe<Array<Scalars['BigInt']>>;
  amount_not_in?: Maybe<Array<Scalars['BigInt']>>;
  claimed?: Maybe<Scalars['Boolean']>;
  claimed_not?: Maybe<Scalars['Boolean']>;
  claimed_in?: Maybe<Array<Scalars['Boolean']>>;
  claimed_not_in?: Maybe<Array<Scalars['Boolean']>>;
  claimedAt?: Maybe<Scalars['Int']>;
  claimedAt_not?: Maybe<Scalars['Int']>;
  claimedAt_gt?: Maybe<Scalars['Int']>;
  claimedAt_lt?: Maybe<Scalars['Int']>;
  claimedAt_gte?: Maybe<Scalars['Int']>;
  claimedAt_lte?: Maybe<Scalars['Int']>;
  claimedAt_in?: Maybe<Array<Scalars['Int']>>;
  claimedAt_not_in?: Maybe<Array<Scalars['Int']>>;
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
};

export enum Claim_OrderBy {
  Id = 'id',
  Account = 'account',
  MerkleDrop = 'merkleDrop',
  Tranche = 'tranche',
  Amount = 'amount',
  Claimed = 'claimed',
  ClaimedAt = 'claimedAt'
}

/** A Merkle Drop contract */
export type MerkleDrop = {
  /** MerkleDrop address */
  id: Scalars['ID'];
  token: Token;
  owner: Scalars['Bytes'];
  funders: Array<Scalars['Bytes']>;
  tranches: Array<Tranche>;
  claims: Array<Claim>;
};


/** A Merkle Drop contract */
export type MerkleDropTranchesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Tranche_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Tranche_Filter>;
};


/** A Merkle Drop contract */
export type MerkleDropClaimsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Claim_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Claim_Filter>;
};

export type MerkleDrop_Filter = {
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
  owner?: Maybe<Scalars['Bytes']>;
  owner_not?: Maybe<Scalars['Bytes']>;
  owner_in?: Maybe<Array<Scalars['Bytes']>>;
  owner_not_in?: Maybe<Array<Scalars['Bytes']>>;
  owner_contains?: Maybe<Scalars['Bytes']>;
  owner_not_contains?: Maybe<Scalars['Bytes']>;
  funders?: Maybe<Array<Scalars['Bytes']>>;
  funders_not?: Maybe<Array<Scalars['Bytes']>>;
  funders_contains?: Maybe<Array<Scalars['Bytes']>>;
  funders_contains_nocase?: Maybe<Array<Scalars['Bytes']>>;
  funders_not_contains?: Maybe<Array<Scalars['Bytes']>>;
  funders_not_contains_nocase?: Maybe<Array<Scalars['Bytes']>>;
  tranches_?: Maybe<Tranche_Filter>;
  claims_?: Maybe<Claim_Filter>;
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
};

export enum MerkleDrop_OrderBy {
  Id = 'id',
  Token = 'token',
  Owner = 'owner',
  Funders = 'funders',
  Tranches = 'tranches',
  Claims = 'claims'
}


/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Query = {
  token?: Maybe<Token>;
  tokens: Array<Token>;
  tranche?: Maybe<Tranche>;
  tranches: Array<Tranche>;
  claim?: Maybe<Claim>;
  claims: Array<Claim>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  merkleDrop?: Maybe<MerkleDrop>;
  merkleDrops: Array<MerkleDrop>;
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


export type QueryTrancheArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryTranchesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Tranche_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Tranche_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryClaimArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryClaimsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Claim_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Claim_Filter>;
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


export type QueryMerkleDropArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryMerkleDropsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MerkleDrop_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MerkleDrop_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Query_MetaArgs = {
  block?: Maybe<Block_Height>;
};

export type Subscription = {
  token?: Maybe<Token>;
  tokens: Array<Token>;
  tranche?: Maybe<Tranche>;
  tranches: Array<Tranche>;
  claim?: Maybe<Claim>;
  claims: Array<Claim>;
  account?: Maybe<Account>;
  accounts: Array<Account>;
  merkleDrop?: Maybe<MerkleDrop>;
  merkleDrops: Array<MerkleDrop>;
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


export type SubscriptionTrancheArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionTranchesArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Tranche_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Tranche_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionClaimArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionClaimsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Claim_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Claim_Filter>;
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


export type SubscriptionMerkleDropArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionMerkleDropsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MerkleDrop_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MerkleDrop_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscription_MetaArgs = {
  block?: Maybe<Block_Height>;
};

/** An ERC20-compatible token */
export type Token = {
  /** Token address */
  id: Scalars['ID'];
  /** Token address */
  address: Scalars['Bytes'];
  /** Token decimals */
  decimals: Scalars['Int'];
  /** Token name */
  name: Scalars['String'];
  /** Token symbol */
  symbol: Scalars['String'];
  /** Merkle Drop contracts using this token */
  merkleDrops: Array<MerkleDrop>;
};


/** An ERC20-compatible token */
export type TokenMerkleDropsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<MerkleDrop_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<MerkleDrop_Filter>;
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
  merkleDrops_?: Maybe<MerkleDrop_Filter>;
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
};

export enum Token_OrderBy {
  Id = 'id',
  Address = 'address',
  Decimals = 'decimals',
  Name = 'name',
  Symbol = 'symbol',
  MerkleDrops = 'merkleDrops'
}

/** A tranche of a Merkle Drop */
export type Tranche = {
  /** merkleDrop.trancheId */
  id: Scalars['ID'];
  trancheId: Scalars['Int'];
  totalAllocation: Scalars['BigInt'];
  merkleRoot: Scalars['Bytes'];
  addedAt: Scalars['Int'];
  uri: Scalars['String'];
  merkleDrop: MerkleDrop;
  expired: Scalars['Boolean'];
  claims: Array<Claim>;
};


/** A tranche of a Merkle Drop */
export type TrancheClaimsArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Claim_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Claim_Filter>;
};

export type Tranche_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  trancheId?: Maybe<Scalars['Int']>;
  trancheId_not?: Maybe<Scalars['Int']>;
  trancheId_gt?: Maybe<Scalars['Int']>;
  trancheId_lt?: Maybe<Scalars['Int']>;
  trancheId_gte?: Maybe<Scalars['Int']>;
  trancheId_lte?: Maybe<Scalars['Int']>;
  trancheId_in?: Maybe<Array<Scalars['Int']>>;
  trancheId_not_in?: Maybe<Array<Scalars['Int']>>;
  totalAllocation?: Maybe<Scalars['BigInt']>;
  totalAllocation_not?: Maybe<Scalars['BigInt']>;
  totalAllocation_gt?: Maybe<Scalars['BigInt']>;
  totalAllocation_lt?: Maybe<Scalars['BigInt']>;
  totalAllocation_gte?: Maybe<Scalars['BigInt']>;
  totalAllocation_lte?: Maybe<Scalars['BigInt']>;
  totalAllocation_in?: Maybe<Array<Scalars['BigInt']>>;
  totalAllocation_not_in?: Maybe<Array<Scalars['BigInt']>>;
  merkleRoot?: Maybe<Scalars['Bytes']>;
  merkleRoot_not?: Maybe<Scalars['Bytes']>;
  merkleRoot_in?: Maybe<Array<Scalars['Bytes']>>;
  merkleRoot_not_in?: Maybe<Array<Scalars['Bytes']>>;
  merkleRoot_contains?: Maybe<Scalars['Bytes']>;
  merkleRoot_not_contains?: Maybe<Scalars['Bytes']>;
  addedAt?: Maybe<Scalars['Int']>;
  addedAt_not?: Maybe<Scalars['Int']>;
  addedAt_gt?: Maybe<Scalars['Int']>;
  addedAt_lt?: Maybe<Scalars['Int']>;
  addedAt_gte?: Maybe<Scalars['Int']>;
  addedAt_lte?: Maybe<Scalars['Int']>;
  addedAt_in?: Maybe<Array<Scalars['Int']>>;
  addedAt_not_in?: Maybe<Array<Scalars['Int']>>;
  uri?: Maybe<Scalars['String']>;
  uri_not?: Maybe<Scalars['String']>;
  uri_gt?: Maybe<Scalars['String']>;
  uri_lt?: Maybe<Scalars['String']>;
  uri_gte?: Maybe<Scalars['String']>;
  uri_lte?: Maybe<Scalars['String']>;
  uri_in?: Maybe<Array<Scalars['String']>>;
  uri_not_in?: Maybe<Array<Scalars['String']>>;
  uri_contains?: Maybe<Scalars['String']>;
  uri_contains_nocase?: Maybe<Scalars['String']>;
  uri_not_contains?: Maybe<Scalars['String']>;
  uri_not_contains_nocase?: Maybe<Scalars['String']>;
  uri_starts_with?: Maybe<Scalars['String']>;
  uri_starts_with_nocase?: Maybe<Scalars['String']>;
  uri_not_starts_with?: Maybe<Scalars['String']>;
  uri_not_starts_with_nocase?: Maybe<Scalars['String']>;
  uri_ends_with?: Maybe<Scalars['String']>;
  uri_ends_with_nocase?: Maybe<Scalars['String']>;
  uri_not_ends_with?: Maybe<Scalars['String']>;
  uri_not_ends_with_nocase?: Maybe<Scalars['String']>;
  merkleDrop?: Maybe<Scalars['String']>;
  merkleDrop_not?: Maybe<Scalars['String']>;
  merkleDrop_gt?: Maybe<Scalars['String']>;
  merkleDrop_lt?: Maybe<Scalars['String']>;
  merkleDrop_gte?: Maybe<Scalars['String']>;
  merkleDrop_lte?: Maybe<Scalars['String']>;
  merkleDrop_in?: Maybe<Array<Scalars['String']>>;
  merkleDrop_not_in?: Maybe<Array<Scalars['String']>>;
  merkleDrop_contains?: Maybe<Scalars['String']>;
  merkleDrop_contains_nocase?: Maybe<Scalars['String']>;
  merkleDrop_not_contains?: Maybe<Scalars['String']>;
  merkleDrop_not_contains_nocase?: Maybe<Scalars['String']>;
  merkleDrop_starts_with?: Maybe<Scalars['String']>;
  merkleDrop_starts_with_nocase?: Maybe<Scalars['String']>;
  merkleDrop_not_starts_with?: Maybe<Scalars['String']>;
  merkleDrop_not_starts_with_nocase?: Maybe<Scalars['String']>;
  merkleDrop_ends_with?: Maybe<Scalars['String']>;
  merkleDrop_ends_with_nocase?: Maybe<Scalars['String']>;
  merkleDrop_not_ends_with?: Maybe<Scalars['String']>;
  merkleDrop_not_ends_with_nocase?: Maybe<Scalars['String']>;
  merkleDrop_?: Maybe<MerkleDrop_Filter>;
  expired?: Maybe<Scalars['Boolean']>;
  expired_not?: Maybe<Scalars['Boolean']>;
  expired_in?: Maybe<Array<Scalars['Boolean']>>;
  expired_not_in?: Maybe<Array<Scalars['Boolean']>>;
  claims_?: Maybe<Claim_Filter>;
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
};

export enum Tranche_OrderBy {
  Id = 'id',
  TrancheId = 'trancheId',
  TotalAllocation = 'totalAllocation',
  MerkleRoot = 'merkleRoot',
  AddedAt = 'addedAt',
  Uri = 'uri',
  MerkleDrop = 'merkleDrop',
  Expired = 'expired',
  Claims = 'claims'
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

export type MerkleDropAccountsQueryVariables = Exact<{
  account: Scalars['Bytes'];
}>;


export type MerkleDropAccountsQuery = { accounts: Array<{ id: string, lastClaimedTranche?: { id: string, trancheId: number } | null | undefined, merkleDrop: { id: string, token: { address: string, symbol: string } }, claims: Array<{ id: string, amount: string, tranche: { id: string, trancheId: number, merkleRoot: string, expired: boolean, uri: string } }> }> };


export const MerkleDropAccountsDocument = gql`
    query MerkleDropAccounts($account: Bytes!) {
  accounts(where: {address: $account}) {
    id
    lastClaimedTranche {
      id
      trancheId
    }
    merkleDrop {
      id
      token {
        address
        symbol
      }
    }
    claims(where: {claimed: false}, orderBy: id, orderDirection: asc) {
      id
      amount
      tranche {
        id
        trancheId
        merkleRoot
        expired
        uri
      }
    }
  }
}
    `;

/**
 * __useMerkleDropAccountsQuery__
 *
 * To run a query within a React component, call `useMerkleDropAccountsQuery` and pass it any options that fit your needs.
 * When your component renders, `useMerkleDropAccountsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMerkleDropAccountsQuery({
 *   variables: {
 *      account: // value for 'account'
 *   },
 * });
 */
export function useMerkleDropAccountsQuery(baseOptions: Apollo.QueryHookOptions<MerkleDropAccountsQuery, MerkleDropAccountsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MerkleDropAccountsQuery, MerkleDropAccountsQueryVariables>(MerkleDropAccountsDocument, options);
      }
export function useMerkleDropAccountsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MerkleDropAccountsQuery, MerkleDropAccountsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MerkleDropAccountsQuery, MerkleDropAccountsQueryVariables>(MerkleDropAccountsDocument, options);
        }
export type MerkleDropAccountsQueryHookResult = ReturnType<typeof useMerkleDropAccountsQuery>;
export type MerkleDropAccountsLazyQueryHookResult = ReturnType<typeof useMerkleDropAccountsLazyQuery>;
export type MerkleDropAccountsQueryResult = Apollo.QueryResult<MerkleDropAccountsQuery, MerkleDropAccountsQueryVariables>;