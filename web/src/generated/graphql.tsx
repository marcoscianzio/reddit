import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost: Post;
  deletePost: Scalars['Boolean'];
  login: UserResponse;
  register: UserResponse;
  updatePost?: Maybe<Post>;
};


export type MutationCreatePostArgs = {
  title: Scalars['String'];
};


export type MutationDeletePostArgs = {
  id: Scalars['Float'];
};


export type MutationLoginArgs = {
  options: UsernamePassword;
};


export type MutationRegisterArgs = {
  options: UsernamePassword;
};


export type MutationUpdatePostArgs = {
  id: Scalars['Float'];
  title?: InputMaybe<Scalars['String']>;
};

export type PathError = {
  __typename?: 'PathError';
  message: Scalars['String'];
  path: Scalars['String'];
};

export type Post = {
  __typename?: 'Post';
  created_at: Scalars['DateTime'];
  id: Scalars['Int'];
  title: Scalars['String'];
  updated_at: Scalars['DateTime'];
};

export type Query = {
  __typename?: 'Query';
  Me?: Maybe<User>;
  post?: Maybe<Post>;
  posts: Array<Post>;
};


export type QueryPostArgs = {
  id: Scalars['Float'];
};

export type User = {
  __typename?: 'User';
  created_at: Scalars['DateTime'];
  id: Scalars['Int'];
  updated_at: Scalars['DateTime'];
  username: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<PathError>>;
  user?: Maybe<User>;
};

export type UsernamePassword = {
  password: Scalars['String'];
  username: Scalars['String'];
};

export type RegisterMutationVariables = Exact<{
  values: UsernamePassword;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'PathError', path: string, message: string }> | null | undefined, user?: { __typename?: 'User', id: number, username: string, created_at: any, updated_at: any } | null | undefined } };


export const RegisterDocument = gql`
    mutation Register($values: UsernamePassword!) {
  register(options: $values) {
    errors {
      path
      message
    }
    user {
      id
      username
      created_at
      updated_at
    }
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      values: // value for 'values'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;