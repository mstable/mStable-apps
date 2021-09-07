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
  BigNumber: BigNumber;
  MstableBigDecimal: BigDecimal;
};



export type Mutation = {
  queueOptIn: Scalars['Boolean'];
  queueOptOut: Scalars['Boolean'];
  setMetadata: Scalars['Boolean'];
};


export type MutationQueueOptInArgs = {
  account: Scalars['ID'];
  signature: Scalars['String'];
};


export type MutationQueueOptOutArgs = {
  account: Scalars['ID'];
  signature: Scalars['String'];
};


export type MutationSetMetadataArgs = {
  json: Scalars['String'];
  signature: Scalars['String'];
};

export type Query = {
  quest?: Maybe<Quest>;
  quests: Array<Maybe<Quest>>;
  user?: Maybe<User>;
  optInQueue: Array<Maybe<User>>;
};


export type QueryQuestArgs = {
  id: Scalars['ID'];
};


export type QueryUserArgs = {
  account: Scalars['ID'];
};

export type Quest = {
  id: Scalars['ID'];
  metadata?: Maybe<QuestMetadata>;
  submission?: Maybe<QuestSubmission>;
};


export type QuestSubmissionArgs = {
  account: Scalars['ID'];
};

export type QuestMetadata = {
  title: Scalars['String'];
  description: Scalars['String'];
  imageUrl?: Maybe<Scalars['String']>;
};

export type QuestSubmission = {
  complete: Scalars['Boolean'];
  progress?: Maybe<Scalars['Float']>;
  signature?: Maybe<Scalars['String']>;
  quest: Quest;
  user?: Maybe<User>;
};

export type User = {
  id: Scalars['ID'];
  queueOptIn?: Maybe<Scalars['Boolean']>;
  completed: Array<Maybe<Quest>>;
  queue: Array<Maybe<Quest>>;
};

export type QueueOptInMutationVariables = Exact<{
  account: Scalars['ID'];
  signature: Scalars['String'];
}>;


export type QueueOptInMutation = { queueOptIn: boolean };

export type QuestAllFragment = { id: string, metadata?: Maybe<{ title: string, description: string, imageUrl?: Maybe<string> }>, submission?: Maybe<{ signature?: Maybe<string>, complete: boolean, progress?: Maybe<number> }> };

export type QuestsQueryVariables = Exact<{
  account: Scalars['ID'];
  hasAccount: Scalars['Boolean'];
}>;


export type QuestsQuery = { quests: Array<Maybe<{ id: string, metadata?: Maybe<{ title: string, description: string, imageUrl?: Maybe<string> }>, submission?: Maybe<{ signature?: Maybe<string>, complete: boolean, progress?: Maybe<number> }> }>> };

export type QuestQueryVariables = Exact<{
  id: Scalars['ID'];
  account: Scalars['ID'];
  hasAccount: Scalars['Boolean'];
}>;


export type QuestQuery = { quest?: Maybe<{ id: string, metadata?: Maybe<{ title: string, description: string, imageUrl?: Maybe<string> }>, submission?: Maybe<{ signature?: Maybe<string>, complete: boolean, progress?: Maybe<number> }> }> };

export const QuestAllFragmentDoc = gql`
    fragment QuestAll on Quest {
  id
  metadata {
    title
    description
    imageUrl
  }
  submission(account: $account) @include(if: $hasAccount) {
    signature
    complete
    progress
  }
}
    `;
export const QueueOptInDocument = gql`
    mutation QueueOptIn($account: ID!, $signature: String!) {
  queueOptIn(account: $account, signature: $signature)
}
    `;
export type QueueOptInMutationFn = Apollo.MutationFunction<QueueOptInMutation, QueueOptInMutationVariables>;

/**
 * __useQueueOptInMutation__
 *
 * To run a mutation, you first call `useQueueOptInMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useQueueOptInMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [queueOptInMutation, { data, loading, error }] = useQueueOptInMutation({
 *   variables: {
 *      account: // value for 'account'
 *      signature: // value for 'signature'
 *   },
 * });
 */
export function useQueueOptInMutation(baseOptions?: Apollo.MutationHookOptions<QueueOptInMutation, QueueOptInMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<QueueOptInMutation, QueueOptInMutationVariables>(QueueOptInDocument, options);
      }
export type QueueOptInMutationHookResult = ReturnType<typeof useQueueOptInMutation>;
export type QueueOptInMutationResult = Apollo.MutationResult<QueueOptInMutation>;
export type QueueOptInMutationOptions = Apollo.BaseMutationOptions<QueueOptInMutation, QueueOptInMutationVariables>;
export const QuestsDocument = gql`
    query Quests($account: ID!, $hasAccount: Boolean!) {
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
 *      account: // value for 'account'
 *      hasAccount: // value for 'hasAccount'
 *   },
 * });
 */
export function useQuestsQuery(baseOptions: Apollo.QueryHookOptions<QuestsQuery, QuestsQueryVariables>) {
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
    query Quest($id: ID!, $account: ID!, $hasAccount: Boolean!) {
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
 *      account: // value for 'account'
 *      hasAccount: // value for 'hasAccount'
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