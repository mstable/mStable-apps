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
  updateQuest: Quest;
  updateQuests: Array<Quest>;
  queueOptIn: User;
  queueOptOut: User;
};


export type MutationUpdateQuestArgs = {
  userId: Scalars['ID'];
  questId: Scalars['ID'];
};


export type MutationUpdateQuestsArgs = {
  userId: Scalars['ID'];
};


export type MutationQueueOptInArgs = {
  userId: Scalars['ID'];
  signature: Scalars['String'];
};


export type MutationQueueOptOutArgs = {
  userId: Scalars['ID'];
  signature: Scalars['String'];
};

export type Query = {
  quests: Array<Quest>;
  quest?: Maybe<Quest>;
  queue: Array<QuestCompletionQueueItem>;
  user: User;
};


export type QueryQuestsArgs = {
  userId?: Maybe<Scalars['ID']>;
};


export type QueryQuestArgs = {
  questId: Scalars['ID'];
  userId?: Maybe<Scalars['ID']>;
};


export type QueryUserArgs = {
  userId: Scalars['ID'];
};

export type Quest = {
  id: Scalars['ID'];
  ethereumId?: Maybe<Scalars['Int']>;
  requiredPoints?: Maybe<Scalars['Float']>;
  objectives: Array<QuestObjective>;
  title: Scalars['String'];
  description: Scalars['String'];
  imageURI?: Maybe<Scalars['String']>;
  userQuest?: Maybe<UserQuest>;
};


export type QuestUserQuestArgs = {
  userId: Scalars['ID'];
};

export type QuestCompletionQueueItem = {
  ethereumId: Scalars['Int'];
  userId: Scalars['ID'];
};

export type QuestObjective = {
  id: Scalars['ID'];
  points: Scalars['Float'];
  title: Scalars['String'];
  description: Scalars['String'];
};

export type User = {
  id: Scalars['ID'];
  optInQueue: Scalars['Boolean'];
  quests: Array<UserQuest>;
};

export type UserQuest = {
  id: Scalars['ID'];
  complete: Scalars['Boolean'];
  progress?: Maybe<Scalars['Float']>;
  signature?: Maybe<Scalars['String']>;
  objectives?: Maybe<Array<UserQuestObjective>>;
};

export type UserQuestObjective = {
  id: Scalars['ID'];
  complete: Scalars['Boolean'];
  progress?: Maybe<Scalars['Float']>;
};

export type QuestAllFragment = { id: string, ethereumId?: number | null | undefined, title: string, description: string, imageURI?: string | null | undefined, requiredPoints?: number | null | undefined, objectives: Array<{ id: string, title: string, description: string, points: number }>, userQuest?: { id: string, signature?: string | null | undefined, complete: boolean, progress?: number | null | undefined, objectives?: Array<{ id: string, complete: boolean, progress?: number | null | undefined }> | null | undefined } | null | undefined };

export type UserQueryVariables = Exact<{
  userId: Scalars['ID'];
}>;


export type UserQuery = { user: { id: string, optInQueue: boolean } };

export type QuestsQueryVariables = Exact<{
  userId: Scalars['ID'];
  hasUser: Scalars['Boolean'];
}>;


export type QuestsQuery = { quests: Array<{ id: string, ethereumId?: number | null | undefined, title: string, description: string, imageURI?: string | null | undefined, requiredPoints?: number | null | undefined, objectives: Array<{ id: string, title: string, description: string, points: number }>, userQuest?: { id: string, signature?: string | null | undefined, complete: boolean, progress?: number | null | undefined, objectives?: Array<{ id: string, complete: boolean, progress?: number | null | undefined }> | null | undefined } | null | undefined }> };

export type QuestQueryVariables = Exact<{
  questId: Scalars['ID'];
  userId: Scalars['ID'];
  hasUser: Scalars['Boolean'];
}>;


export type QuestQuery = { quest?: { id: string, ethereumId?: number | null | undefined, title: string, description: string, imageURI?: string | null | undefined, requiredPoints?: number | null | undefined, objectives: Array<{ id: string, title: string, description: string, points: number }>, userQuest?: { id: string, signature?: string | null | undefined, complete: boolean, progress?: number | null | undefined, objectives?: Array<{ id: string, complete: boolean, progress?: number | null | undefined }> | null | undefined } | null | undefined } | null | undefined };

export type UpdateQuestMutationVariables = Exact<{
  userId: Scalars['ID'];
  questId: Scalars['ID'];
  hasUser: Scalars['Boolean'];
}>;


export type UpdateQuestMutation = { updateQuest: { id: string, ethereumId?: number | null | undefined, title: string, description: string, imageURI?: string | null | undefined, requiredPoints?: number | null | undefined, objectives: Array<{ id: string, title: string, description: string, points: number }>, userQuest?: { id: string, signature?: string | null | undefined, complete: boolean, progress?: number | null | undefined, objectives?: Array<{ id: string, complete: boolean, progress?: number | null | undefined }> | null | undefined } | null | undefined } };

export type UpdateQuestsMutationVariables = Exact<{
  userId: Scalars['ID'];
  hasUser: Scalars['Boolean'];
}>;


export type UpdateQuestsMutation = { updateQuests: Array<{ id: string, ethereumId?: number | null | undefined, title: string, description: string, imageURI?: string | null | undefined, requiredPoints?: number | null | undefined, objectives: Array<{ id: string, title: string, description: string, points: number }>, userQuest?: { id: string, signature?: string | null | undefined, complete: boolean, progress?: number | null | undefined, objectives?: Array<{ id: string, complete: boolean, progress?: number | null | undefined }> | null | undefined } | null | undefined }> };

export type QueueOptInMutationVariables = Exact<{
  userId: Scalars['ID'];
  signature: Scalars['String'];
}>;


export type QueueOptInMutation = { queueOptIn: { id: string, optInQueue: boolean } };

export type QueueOptOutMutationVariables = Exact<{
  userId: Scalars['ID'];
  signature: Scalars['String'];
}>;


export type QueueOptOutMutation = { queueOptOut: { id: string, optInQueue: boolean } };

export const QuestAllFragmentDoc = gql`
    fragment QuestAll on Quest {
  id
  ethereumId
  title
  description
  imageURI
  requiredPoints
  objectives {
    id
    title
    description
    points
  }
  userQuest(userId: $userId) @include(if: $hasUser) {
    id
    signature
    complete
    progress
    objectives {
      id
      complete
      progress
    }
  }
}
    `;
export const UserDocument = gql`
    query User($userId: ID!) {
  user(userId: $userId) {
    id
    optInQueue
  }
}
    `;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useUserQuery(baseOptions: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, options);
      }
export function useUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, options);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;
export const QuestsDocument = gql`
    query Quests($userId: ID!, $hasUser: Boolean!) {
  quests(userId: $userId) {
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
 *      userId: // value for 'userId'
 *      hasUser: // value for 'hasUser'
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
    query Quest($questId: ID!, $userId: ID!, $hasUser: Boolean!) {
  quest(questId: $questId, userId: $userId) {
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
 *      questId: // value for 'questId'
 *      userId: // value for 'userId'
 *      hasUser: // value for 'hasUser'
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
export const UpdateQuestDocument = gql`
    mutation UpdateQuest($userId: ID!, $questId: ID!, $hasUser: Boolean!) {
  updateQuest(userId: $userId, questId: $questId) {
    ...QuestAll
  }
}
    ${QuestAllFragmentDoc}`;
export type UpdateQuestMutationFn = Apollo.MutationFunction<UpdateQuestMutation, UpdateQuestMutationVariables>;

/**
 * __useUpdateQuestMutation__
 *
 * To run a mutation, you first call `useUpdateQuestMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateQuestMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateQuestMutation, { data, loading, error }] = useUpdateQuestMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      questId: // value for 'questId'
 *      hasUser: // value for 'hasUser'
 *   },
 * });
 */
export function useUpdateQuestMutation(baseOptions?: Apollo.MutationHookOptions<UpdateQuestMutation, UpdateQuestMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateQuestMutation, UpdateQuestMutationVariables>(UpdateQuestDocument, options);
      }
export type UpdateQuestMutationHookResult = ReturnType<typeof useUpdateQuestMutation>;
export type UpdateQuestMutationResult = Apollo.MutationResult<UpdateQuestMutation>;
export type UpdateQuestMutationOptions = Apollo.BaseMutationOptions<UpdateQuestMutation, UpdateQuestMutationVariables>;
export const UpdateQuestsDocument = gql`
    mutation UpdateQuests($userId: ID!, $hasUser: Boolean!) {
  updateQuests(userId: $userId) {
    ...QuestAll
  }
}
    ${QuestAllFragmentDoc}`;
export type UpdateQuestsMutationFn = Apollo.MutationFunction<UpdateQuestsMutation, UpdateQuestsMutationVariables>;

/**
 * __useUpdateQuestsMutation__
 *
 * To run a mutation, you first call `useUpdateQuestsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateQuestsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateQuestsMutation, { data, loading, error }] = useUpdateQuestsMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      hasUser: // value for 'hasUser'
 *   },
 * });
 */
export function useUpdateQuestsMutation(baseOptions?: Apollo.MutationHookOptions<UpdateQuestsMutation, UpdateQuestsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateQuestsMutation, UpdateQuestsMutationVariables>(UpdateQuestsDocument, options);
      }
export type UpdateQuestsMutationHookResult = ReturnType<typeof useUpdateQuestsMutation>;
export type UpdateQuestsMutationResult = Apollo.MutationResult<UpdateQuestsMutation>;
export type UpdateQuestsMutationOptions = Apollo.BaseMutationOptions<UpdateQuestsMutation, UpdateQuestsMutationVariables>;
export const QueueOptInDocument = gql`
    mutation QueueOptIn($userId: ID!, $signature: String!) {
  queueOptIn(userId: $userId, signature: $signature) {
    id
    optInQueue
  }
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
 *      userId: // value for 'userId'
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
export const QueueOptOutDocument = gql`
    mutation QueueOptOut($userId: ID!, $signature: String!) {
  queueOptOut(userId: $userId, signature: $signature) {
    id
    optInQueue
  }
}
    `;
export type QueueOptOutMutationFn = Apollo.MutationFunction<QueueOptOutMutation, QueueOptOutMutationVariables>;

/**
 * __useQueueOptOutMutation__
 *
 * To run a mutation, you first call `useQueueOptOutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useQueueOptOutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [queueOptOutMutation, { data, loading, error }] = useQueueOptOutMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      signature: // value for 'signature'
 *   },
 * });
 */
export function useQueueOptOutMutation(baseOptions?: Apollo.MutationHookOptions<QueueOptOutMutation, QueueOptOutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<QueueOptOutMutation, QueueOptOutMutationVariables>(QueueOptOutDocument, options);
      }
export type QueueOptOutMutationHookResult = ReturnType<typeof useQueueOptOutMutation>;
export type QueueOptOutMutationResult = Apollo.MutationResult<QueueOptOutMutation>;
export type QueueOptOutMutationOptions = Apollo.BaseMutationOptions<QueueOptOutMutation, QueueOptOutMutationVariables>;