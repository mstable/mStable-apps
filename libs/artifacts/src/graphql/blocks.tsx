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







export type Block = {
  id: Scalars['ID'];
  number: Scalars['BigInt'];
  timestamp: Scalars['BigInt'];
  parentHash?: Maybe<Scalars['String']>;
  author?: Maybe<Scalars['String']>;
  difficulty?: Maybe<Scalars['BigInt']>;
  totalDifficulty?: Maybe<Scalars['BigInt']>;
  gasUsed?: Maybe<Scalars['BigInt']>;
  gasLimit?: Maybe<Scalars['BigInt']>;
  receiptsRoot?: Maybe<Scalars['String']>;
  transactionsRoot?: Maybe<Scalars['String']>;
  stateRoot?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['BigInt']>;
  unclesHash?: Maybe<Scalars['String']>;
};

export type BlockChangedFilter = {
  number_gte: Scalars['Int'];
};

export type Block_Filter = {
  id?: Maybe<Scalars['ID']>;
  id_not?: Maybe<Scalars['ID']>;
  id_gt?: Maybe<Scalars['ID']>;
  id_lt?: Maybe<Scalars['ID']>;
  id_gte?: Maybe<Scalars['ID']>;
  id_lte?: Maybe<Scalars['ID']>;
  id_in?: Maybe<Array<Scalars['ID']>>;
  id_not_in?: Maybe<Array<Scalars['ID']>>;
  number?: Maybe<Scalars['BigInt']>;
  number_not?: Maybe<Scalars['BigInt']>;
  number_gt?: Maybe<Scalars['BigInt']>;
  number_lt?: Maybe<Scalars['BigInt']>;
  number_gte?: Maybe<Scalars['BigInt']>;
  number_lte?: Maybe<Scalars['BigInt']>;
  number_in?: Maybe<Array<Scalars['BigInt']>>;
  number_not_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp?: Maybe<Scalars['BigInt']>;
  timestamp_not?: Maybe<Scalars['BigInt']>;
  timestamp_gt?: Maybe<Scalars['BigInt']>;
  timestamp_lt?: Maybe<Scalars['BigInt']>;
  timestamp_gte?: Maybe<Scalars['BigInt']>;
  timestamp_lte?: Maybe<Scalars['BigInt']>;
  timestamp_in?: Maybe<Array<Scalars['BigInt']>>;
  timestamp_not_in?: Maybe<Array<Scalars['BigInt']>>;
  parentHash?: Maybe<Scalars['String']>;
  parentHash_not?: Maybe<Scalars['String']>;
  parentHash_gt?: Maybe<Scalars['String']>;
  parentHash_lt?: Maybe<Scalars['String']>;
  parentHash_gte?: Maybe<Scalars['String']>;
  parentHash_lte?: Maybe<Scalars['String']>;
  parentHash_in?: Maybe<Array<Scalars['String']>>;
  parentHash_not_in?: Maybe<Array<Scalars['String']>>;
  parentHash_contains?: Maybe<Scalars['String']>;
  parentHash_contains_nocase?: Maybe<Scalars['String']>;
  parentHash_not_contains?: Maybe<Scalars['String']>;
  parentHash_not_contains_nocase?: Maybe<Scalars['String']>;
  parentHash_starts_with?: Maybe<Scalars['String']>;
  parentHash_starts_with_nocase?: Maybe<Scalars['String']>;
  parentHash_not_starts_with?: Maybe<Scalars['String']>;
  parentHash_not_starts_with_nocase?: Maybe<Scalars['String']>;
  parentHash_ends_with?: Maybe<Scalars['String']>;
  parentHash_ends_with_nocase?: Maybe<Scalars['String']>;
  parentHash_not_ends_with?: Maybe<Scalars['String']>;
  parentHash_not_ends_with_nocase?: Maybe<Scalars['String']>;
  author?: Maybe<Scalars['String']>;
  author_not?: Maybe<Scalars['String']>;
  author_gt?: Maybe<Scalars['String']>;
  author_lt?: Maybe<Scalars['String']>;
  author_gte?: Maybe<Scalars['String']>;
  author_lte?: Maybe<Scalars['String']>;
  author_in?: Maybe<Array<Scalars['String']>>;
  author_not_in?: Maybe<Array<Scalars['String']>>;
  author_contains?: Maybe<Scalars['String']>;
  author_contains_nocase?: Maybe<Scalars['String']>;
  author_not_contains?: Maybe<Scalars['String']>;
  author_not_contains_nocase?: Maybe<Scalars['String']>;
  author_starts_with?: Maybe<Scalars['String']>;
  author_starts_with_nocase?: Maybe<Scalars['String']>;
  author_not_starts_with?: Maybe<Scalars['String']>;
  author_not_starts_with_nocase?: Maybe<Scalars['String']>;
  author_ends_with?: Maybe<Scalars['String']>;
  author_ends_with_nocase?: Maybe<Scalars['String']>;
  author_not_ends_with?: Maybe<Scalars['String']>;
  author_not_ends_with_nocase?: Maybe<Scalars['String']>;
  difficulty?: Maybe<Scalars['BigInt']>;
  difficulty_not?: Maybe<Scalars['BigInt']>;
  difficulty_gt?: Maybe<Scalars['BigInt']>;
  difficulty_lt?: Maybe<Scalars['BigInt']>;
  difficulty_gte?: Maybe<Scalars['BigInt']>;
  difficulty_lte?: Maybe<Scalars['BigInt']>;
  difficulty_in?: Maybe<Array<Scalars['BigInt']>>;
  difficulty_not_in?: Maybe<Array<Scalars['BigInt']>>;
  totalDifficulty?: Maybe<Scalars['BigInt']>;
  totalDifficulty_not?: Maybe<Scalars['BigInt']>;
  totalDifficulty_gt?: Maybe<Scalars['BigInt']>;
  totalDifficulty_lt?: Maybe<Scalars['BigInt']>;
  totalDifficulty_gte?: Maybe<Scalars['BigInt']>;
  totalDifficulty_lte?: Maybe<Scalars['BigInt']>;
  totalDifficulty_in?: Maybe<Array<Scalars['BigInt']>>;
  totalDifficulty_not_in?: Maybe<Array<Scalars['BigInt']>>;
  gasUsed?: Maybe<Scalars['BigInt']>;
  gasUsed_not?: Maybe<Scalars['BigInt']>;
  gasUsed_gt?: Maybe<Scalars['BigInt']>;
  gasUsed_lt?: Maybe<Scalars['BigInt']>;
  gasUsed_gte?: Maybe<Scalars['BigInt']>;
  gasUsed_lte?: Maybe<Scalars['BigInt']>;
  gasUsed_in?: Maybe<Array<Scalars['BigInt']>>;
  gasUsed_not_in?: Maybe<Array<Scalars['BigInt']>>;
  gasLimit?: Maybe<Scalars['BigInt']>;
  gasLimit_not?: Maybe<Scalars['BigInt']>;
  gasLimit_gt?: Maybe<Scalars['BigInt']>;
  gasLimit_lt?: Maybe<Scalars['BigInt']>;
  gasLimit_gte?: Maybe<Scalars['BigInt']>;
  gasLimit_lte?: Maybe<Scalars['BigInt']>;
  gasLimit_in?: Maybe<Array<Scalars['BigInt']>>;
  gasLimit_not_in?: Maybe<Array<Scalars['BigInt']>>;
  receiptsRoot?: Maybe<Scalars['String']>;
  receiptsRoot_not?: Maybe<Scalars['String']>;
  receiptsRoot_gt?: Maybe<Scalars['String']>;
  receiptsRoot_lt?: Maybe<Scalars['String']>;
  receiptsRoot_gte?: Maybe<Scalars['String']>;
  receiptsRoot_lte?: Maybe<Scalars['String']>;
  receiptsRoot_in?: Maybe<Array<Scalars['String']>>;
  receiptsRoot_not_in?: Maybe<Array<Scalars['String']>>;
  receiptsRoot_contains?: Maybe<Scalars['String']>;
  receiptsRoot_contains_nocase?: Maybe<Scalars['String']>;
  receiptsRoot_not_contains?: Maybe<Scalars['String']>;
  receiptsRoot_not_contains_nocase?: Maybe<Scalars['String']>;
  receiptsRoot_starts_with?: Maybe<Scalars['String']>;
  receiptsRoot_starts_with_nocase?: Maybe<Scalars['String']>;
  receiptsRoot_not_starts_with?: Maybe<Scalars['String']>;
  receiptsRoot_not_starts_with_nocase?: Maybe<Scalars['String']>;
  receiptsRoot_ends_with?: Maybe<Scalars['String']>;
  receiptsRoot_ends_with_nocase?: Maybe<Scalars['String']>;
  receiptsRoot_not_ends_with?: Maybe<Scalars['String']>;
  receiptsRoot_not_ends_with_nocase?: Maybe<Scalars['String']>;
  transactionsRoot?: Maybe<Scalars['String']>;
  transactionsRoot_not?: Maybe<Scalars['String']>;
  transactionsRoot_gt?: Maybe<Scalars['String']>;
  transactionsRoot_lt?: Maybe<Scalars['String']>;
  transactionsRoot_gte?: Maybe<Scalars['String']>;
  transactionsRoot_lte?: Maybe<Scalars['String']>;
  transactionsRoot_in?: Maybe<Array<Scalars['String']>>;
  transactionsRoot_not_in?: Maybe<Array<Scalars['String']>>;
  transactionsRoot_contains?: Maybe<Scalars['String']>;
  transactionsRoot_contains_nocase?: Maybe<Scalars['String']>;
  transactionsRoot_not_contains?: Maybe<Scalars['String']>;
  transactionsRoot_not_contains_nocase?: Maybe<Scalars['String']>;
  transactionsRoot_starts_with?: Maybe<Scalars['String']>;
  transactionsRoot_starts_with_nocase?: Maybe<Scalars['String']>;
  transactionsRoot_not_starts_with?: Maybe<Scalars['String']>;
  transactionsRoot_not_starts_with_nocase?: Maybe<Scalars['String']>;
  transactionsRoot_ends_with?: Maybe<Scalars['String']>;
  transactionsRoot_ends_with_nocase?: Maybe<Scalars['String']>;
  transactionsRoot_not_ends_with?: Maybe<Scalars['String']>;
  transactionsRoot_not_ends_with_nocase?: Maybe<Scalars['String']>;
  stateRoot?: Maybe<Scalars['String']>;
  stateRoot_not?: Maybe<Scalars['String']>;
  stateRoot_gt?: Maybe<Scalars['String']>;
  stateRoot_lt?: Maybe<Scalars['String']>;
  stateRoot_gte?: Maybe<Scalars['String']>;
  stateRoot_lte?: Maybe<Scalars['String']>;
  stateRoot_in?: Maybe<Array<Scalars['String']>>;
  stateRoot_not_in?: Maybe<Array<Scalars['String']>>;
  stateRoot_contains?: Maybe<Scalars['String']>;
  stateRoot_contains_nocase?: Maybe<Scalars['String']>;
  stateRoot_not_contains?: Maybe<Scalars['String']>;
  stateRoot_not_contains_nocase?: Maybe<Scalars['String']>;
  stateRoot_starts_with?: Maybe<Scalars['String']>;
  stateRoot_starts_with_nocase?: Maybe<Scalars['String']>;
  stateRoot_not_starts_with?: Maybe<Scalars['String']>;
  stateRoot_not_starts_with_nocase?: Maybe<Scalars['String']>;
  stateRoot_ends_with?: Maybe<Scalars['String']>;
  stateRoot_ends_with_nocase?: Maybe<Scalars['String']>;
  stateRoot_not_ends_with?: Maybe<Scalars['String']>;
  stateRoot_not_ends_with_nocase?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['BigInt']>;
  size_not?: Maybe<Scalars['BigInt']>;
  size_gt?: Maybe<Scalars['BigInt']>;
  size_lt?: Maybe<Scalars['BigInt']>;
  size_gte?: Maybe<Scalars['BigInt']>;
  size_lte?: Maybe<Scalars['BigInt']>;
  size_in?: Maybe<Array<Scalars['BigInt']>>;
  size_not_in?: Maybe<Array<Scalars['BigInt']>>;
  unclesHash?: Maybe<Scalars['String']>;
  unclesHash_not?: Maybe<Scalars['String']>;
  unclesHash_gt?: Maybe<Scalars['String']>;
  unclesHash_lt?: Maybe<Scalars['String']>;
  unclesHash_gte?: Maybe<Scalars['String']>;
  unclesHash_lte?: Maybe<Scalars['String']>;
  unclesHash_in?: Maybe<Array<Scalars['String']>>;
  unclesHash_not_in?: Maybe<Array<Scalars['String']>>;
  unclesHash_contains?: Maybe<Scalars['String']>;
  unclesHash_contains_nocase?: Maybe<Scalars['String']>;
  unclesHash_not_contains?: Maybe<Scalars['String']>;
  unclesHash_not_contains_nocase?: Maybe<Scalars['String']>;
  unclesHash_starts_with?: Maybe<Scalars['String']>;
  unclesHash_starts_with_nocase?: Maybe<Scalars['String']>;
  unclesHash_not_starts_with?: Maybe<Scalars['String']>;
  unclesHash_not_starts_with_nocase?: Maybe<Scalars['String']>;
  unclesHash_ends_with?: Maybe<Scalars['String']>;
  unclesHash_ends_with_nocase?: Maybe<Scalars['String']>;
  unclesHash_not_ends_with?: Maybe<Scalars['String']>;
  unclesHash_not_ends_with_nocase?: Maybe<Scalars['String']>;
  /** Filter for the block changed event. */
  _change_block?: Maybe<BlockChangedFilter>;
};

export type Block_Height = {
  hash?: Maybe<Scalars['Bytes']>;
  number?: Maybe<Scalars['Int']>;
  number_gte?: Maybe<Scalars['Int']>;
};

export enum Block_OrderBy {
  Id = 'id',
  Number = 'number',
  Timestamp = 'timestamp',
  ParentHash = 'parentHash',
  Author = 'author',
  Difficulty = 'difficulty',
  TotalDifficulty = 'totalDifficulty',
  GasUsed = 'gasUsed',
  GasLimit = 'gasLimit',
  ReceiptsRoot = 'receiptsRoot',
  TransactionsRoot = 'transactionsRoot',
  StateRoot = 'stateRoot',
  Size = 'size',
  UnclesHash = 'unclesHash'
}



/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Query = {
  block?: Maybe<Block>;
  blocks: Array<Block>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type QueryBlockArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryBlocksArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Block_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Block_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Query_MetaArgs = {
  block?: Maybe<Block_Height>;
};

export type Subscription = {
  block?: Maybe<Block>;
  blocks: Array<Block>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type SubscriptionBlockArgs = {
  id: Scalars['ID'];
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionBlocksArgs = {
  skip?: Maybe<Scalars['Int']>;
  first?: Maybe<Scalars['Int']>;
  orderBy?: Maybe<Block_OrderBy>;
  orderDirection?: Maybe<OrderDirection>;
  where?: Maybe<Block_Filter>;
  block?: Maybe<Block_Height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscription_MetaArgs = {
  block?: Maybe<Block_Height>;
};

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

export type BlockTimestampQueryVariables = Exact<{
  start: Scalars['BigInt'];
  end: Scalars['BigInt'];
}>;


export type BlockTimestampQuery = { blocks: Array<{ number: string, timestamp: string }> };

export type BlockQueryVariables = Exact<{
  number: Scalars['BigInt'];
}>;


export type BlockQuery = { blocks: Array<{ number: string, timestamp: string }> };


export const BlockTimestampDocument = gql`
    query BlockTimestamp($start: BigInt!, $end: BigInt!) {
  blocks(
    first: 1
    orderBy: timestamp
    orderDirection: asc
    where: {timestamp_gt: $start, timestamp_lt: $end}
  ) {
    number
    timestamp
  }
}
    `;

/**
 * __useBlockTimestampQuery__
 *
 * To run a query within a React component, call `useBlockTimestampQuery` and pass it any options that fit your needs.
 * When your component renders, `useBlockTimestampQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBlockTimestampQuery({
 *   variables: {
 *      start: // value for 'start'
 *      end: // value for 'end'
 *   },
 * });
 */
export function useBlockTimestampQuery(baseOptions: Apollo.QueryHookOptions<BlockTimestampQuery, BlockTimestampQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BlockTimestampQuery, BlockTimestampQueryVariables>(BlockTimestampDocument, options);
      }
export function useBlockTimestampLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BlockTimestampQuery, BlockTimestampQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BlockTimestampQuery, BlockTimestampQueryVariables>(BlockTimestampDocument, options);
        }
export type BlockTimestampQueryHookResult = ReturnType<typeof useBlockTimestampQuery>;
export type BlockTimestampLazyQueryHookResult = ReturnType<typeof useBlockTimestampLazyQuery>;
export type BlockTimestampQueryResult = Apollo.QueryResult<BlockTimestampQuery, BlockTimestampQueryVariables>;
export const BlockDocument = gql`
    query Block($number: BigInt!) {
  blocks(where: {number: $number}) {
    number
    timestamp
  }
}
    `;

/**
 * __useBlockQuery__
 *
 * To run a query within a React component, call `useBlockQuery` and pass it any options that fit your needs.
 * When your component renders, `useBlockQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBlockQuery({
 *   variables: {
 *      number: // value for 'number'
 *   },
 * });
 */
export function useBlockQuery(baseOptions: Apollo.QueryHookOptions<BlockQuery, BlockQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BlockQuery, BlockQueryVariables>(BlockDocument, options);
      }
export function useBlockLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BlockQuery, BlockQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BlockQuery, BlockQueryVariables>(BlockDocument, options);
        }
export type BlockQueryHookResult = ReturnType<typeof useBlockQuery>;
export type BlockLazyQueryHookResult = ReturnType<typeof useBlockLazyQuery>;
export type BlockQueryResult = Apollo.QueryResult<BlockQuery, BlockQueryVariables>;