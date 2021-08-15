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
  Any: any;
  BigNumber: BigNumber;
  MstableBigDecimal: BigDecimal;
};

export type Alias = {
  id: Scalars['String'];
  ipfs?: Maybe<Scalars['String']>;
  address: Scalars['String'];
  alias: Scalars['String'];
  created: Scalars['Int'];
};

export type AliasWhere = {
  id?: Maybe<Scalars['String']>;
  id_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  ipfs?: Maybe<Scalars['String']>;
  ipfs_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  address?: Maybe<Scalars['String']>;
  address_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  alias?: Maybe<Scalars['String']>;
  alias_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  created?: Maybe<Scalars['Int']>;
  created_in?: Maybe<Array<Maybe<Scalars['Int']>>>;
  created_gt?: Maybe<Scalars['Int']>;
  created_gte?: Maybe<Scalars['Int']>;
  created_lt?: Maybe<Scalars['Int']>;
  created_lte?: Maybe<Scalars['Int']>;
};



export type Follow = {
  id: Scalars['String'];
  ipfs?: Maybe<Scalars['String']>;
  follower: Scalars['String'];
  space: Space;
  created: Scalars['Int'];
};

export type FollowWhere = {
  id?: Maybe<Scalars['String']>;
  id_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  ipfs?: Maybe<Scalars['String']>;
  ipfs_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  follower?: Maybe<Scalars['String']>;
  follower_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  space?: Maybe<Scalars['String']>;
  space_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  created?: Maybe<Scalars['Int']>;
  created_in?: Maybe<Array<Maybe<Scalars['Int']>>>;
  created_gt?: Maybe<Scalars['Int']>;
  created_gte?: Maybe<Scalars['Int']>;
  created_lt?: Maybe<Scalars['Int']>;
  created_lte?: Maybe<Scalars['Int']>;
};


export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export type Proposal = {
  id: Scalars['String'];
  ipfs?: Maybe<Scalars['String']>;
  author: Scalars['String'];
  created: Scalars['Int'];
  space?: Maybe<Space>;
  network: Scalars['String'];
  type?: Maybe<Scalars['String']>;
  strategies: Array<Maybe<Strategy>>;
  plugins: Scalars['Any'];
  title: Scalars['String'];
  body?: Maybe<Scalars['String']>;
  choices: Array<Maybe<Scalars['String']>>;
  start: Scalars['Int'];
  end: Scalars['Int'];
  snapshot?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  link?: Maybe<Scalars['String']>;
};

export type ProposalWhere = {
  id?: Maybe<Scalars['String']>;
  id_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  ipfs?: Maybe<Scalars['String']>;
  ipfs_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  space?: Maybe<Scalars['String']>;
  space_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  author?: Maybe<Scalars['String']>;
  author_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  network?: Maybe<Scalars['String']>;
  network_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  created?: Maybe<Scalars['Int']>;
  created_in?: Maybe<Array<Maybe<Scalars['Int']>>>;
  created_gt?: Maybe<Scalars['Int']>;
  created_gte?: Maybe<Scalars['Int']>;
  created_lt?: Maybe<Scalars['Int']>;
  created_lte?: Maybe<Scalars['Int']>;
  start?: Maybe<Scalars['Int']>;
  start_in?: Maybe<Array<Maybe<Scalars['Int']>>>;
  start_gt?: Maybe<Scalars['Int']>;
  start_gte?: Maybe<Scalars['Int']>;
  start_lt?: Maybe<Scalars['Int']>;
  start_lte?: Maybe<Scalars['Int']>;
  end?: Maybe<Scalars['Int']>;
  end_in?: Maybe<Array<Maybe<Scalars['Int']>>>;
  end_gt?: Maybe<Scalars['Int']>;
  end_gte?: Maybe<Scalars['Int']>;
  end_lt?: Maybe<Scalars['Int']>;
  end_lte?: Maybe<Scalars['Int']>;
  state?: Maybe<Scalars['String']>;
};

export type Query = {
  space?: Maybe<Space>;
  spaces?: Maybe<Array<Maybe<Space>>>;
  proposal?: Maybe<Proposal>;
  proposals?: Maybe<Array<Maybe<Proposal>>>;
  vote?: Maybe<Vote>;
  votes?: Maybe<Array<Maybe<Vote>>>;
  aliases?: Maybe<Array<Maybe<Alias>>>;
  follows?: Maybe<Array<Maybe<Follow>>>;
};


export type QuerySpaceArgs = {
  id?: Maybe<Scalars['String']>;
};


export type QuerySpacesArgs = {
  first?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<SpaceWhere>;
  orderBy?: Maybe<Scalars['String']>;
  orderDirection?: Maybe<OrderDirection>;
};


export type QueryProposalArgs = {
  id?: Maybe<Scalars['String']>;
};


export type QueryProposalsArgs = {
  first?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<ProposalWhere>;
  orderBy?: Maybe<Scalars['String']>;
  orderDirection?: Maybe<OrderDirection>;
};


export type QueryVoteArgs = {
  id?: Maybe<Scalars['String']>;
};


export type QueryVotesArgs = {
  first?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<VoteWhere>;
  orderBy?: Maybe<Scalars['String']>;
  orderDirection?: Maybe<OrderDirection>;
};


export type QueryAliasesArgs = {
  first?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<AliasWhere>;
  orderBy?: Maybe<Scalars['String']>;
  orderDirection?: Maybe<OrderDirection>;
};


export type QueryFollowsArgs = {
  first?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
  where?: Maybe<FollowWhere>;
  orderBy?: Maybe<Scalars['String']>;
  orderDirection?: Maybe<OrderDirection>;
};

export type Space = {
  id: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  private?: Maybe<Scalars['Boolean']>;
  about?: Maybe<Scalars['String']>;
  avatar?: Maybe<Scalars['String']>;
  terms?: Maybe<Scalars['String']>;
  location?: Maybe<Scalars['String']>;
  website?: Maybe<Scalars['String']>;
  twitter?: Maybe<Scalars['String']>;
  github?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  network?: Maybe<Scalars['String']>;
  symbol?: Maybe<Scalars['String']>;
  skin?: Maybe<Scalars['String']>;
  domain?: Maybe<Scalars['String']>;
  strategies?: Maybe<Array<Maybe<Strategy>>>;
  admins?: Maybe<Array<Maybe<Scalars['String']>>>;
  members?: Maybe<Array<Maybe<Scalars['String']>>>;
  filters?: Maybe<SpaceFilters>;
  plugins?: Maybe<Scalars['Any']>;
};

export type SpaceFilters = {
  minScore?: Maybe<Scalars['Float']>;
  onlyMembers?: Maybe<Scalars['Boolean']>;
};

export type SpaceWhere = {
  id?: Maybe<Scalars['String']>;
  id_in?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type Strategy = {
  name: Scalars['String'];
  params?: Maybe<Scalars['Any']>;
};

export type Vote = {
  id: Scalars['String'];
  ipfs?: Maybe<Scalars['String']>;
  voter: Scalars['String'];
  created: Scalars['Int'];
  space: Space;
  proposal?: Maybe<Proposal>;
  choice: Scalars['Any'];
  metadata?: Maybe<Scalars['Any']>;
};

export type VoteWhere = {
  id?: Maybe<Scalars['String']>;
  id_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  ipfs?: Maybe<Scalars['String']>;
  ipfs_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  space?: Maybe<Scalars['String']>;
  space_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  voter?: Maybe<Scalars['String']>;
  voter_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  proposal?: Maybe<Scalars['String']>;
  proposal_in?: Maybe<Array<Maybe<Scalars['String']>>>;
  created?: Maybe<Scalars['Int']>;
  created_in?: Maybe<Array<Maybe<Scalars['Int']>>>;
  created_gt?: Maybe<Scalars['Int']>;
  created_gte?: Maybe<Scalars['Int']>;
  created_lt?: Maybe<Scalars['Int']>;
  created_lte?: Maybe<Scalars['Int']>;
};

export type VotesQueryVariables = Exact<{
  account: Scalars['String'];
}>;


export type VotesQuery = { votes?: Maybe<Array<Maybe<{ id: string, created: number, choice: any, proposal?: Maybe<{ title: string, link?: Maybe<string>, state?: Maybe<string>, choices: Array<Maybe<string>> }> }>>> };


export const VotesDocument = gql`
    query Votes($account: String!) {
  votes(
    first: 500
    where: {space: "mstablegovernance.eth", voter: $account}
    orderBy: "created"
    orderDirection: desc
  ) {
    id
    created
    proposal {
      title
      link
      state
      choices
    }
    choice
  }
}
    `;

/**
 * __useVotesQuery__
 *
 * To run a query within a React component, call `useVotesQuery` and pass it any options that fit your needs.
 * When your component renders, `useVotesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVotesQuery({
 *   variables: {
 *      account: // value for 'account'
 *   },
 * });
 */
export function useVotesQuery(baseOptions: Apollo.QueryHookOptions<VotesQuery, VotesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<VotesQuery, VotesQueryVariables>(VotesDocument, options);
      }
export function useVotesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<VotesQuery, VotesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<VotesQuery, VotesQueryVariables>(VotesDocument, options);
        }
export type VotesQueryHookResult = ReturnType<typeof useVotesQuery>;
export type VotesLazyQueryHookResult = ReturnType<typeof useVotesLazyQuery>;
export type VotesQueryResult = Apollo.QueryResult<VotesQuery, VotesQueryVariables>;