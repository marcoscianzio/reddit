import { Stack } from "@chakra-ui/layout";
import { HStack, Spinner } from "@chakra-ui/react";
import React from "react";
import { Waypoint } from "react-waypoint";
import Layout from "../components/Layout";
import PostItem from "../components/PostItem";
import { PostsQuery, usePostsQuery } from "../generated/graphql";
import { withApollo } from "../utils/withApollo";

const Index = () => {
  const { data, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 10,
    },
    notifyOnNetworkStatusChange: true,
  });

  return (
    <Layout>
      {!data ? (
        <div>loading....</div>
      ) : (
        <Stack spacing={4} pb={data.posts.hasMore ? 0 : 8}>
          {data.posts.posts.map((post, i) => (
            <React.Fragment key={post.id}>
              <PostItem post={post} />
              {data.posts.hasMore && i === data?.posts.posts.length - 2 && (
                <Waypoint
                  onEnter={() => {
                    fetchMore({
                      variables: {
                        limit: variables?.limit,
                        cursor:
                          data.posts.posts[data.posts.posts.length - 1]
                            .created_at,
                      },
                      updateQuery: (prev, { fetchMoreResult }): PostsQuery => {
                        if (!fetchMoreResult) {
                          return prev as PostsQuery;
                        }

                        return {
                          __typename: "Query",
                          posts: {
                            __typename: "PaginatedPosts",
                            hasMore: (fetchMoreResult as PostsQuery).posts
                              .hasMore,
                            posts: [
                              ...(prev as PostsQuery).posts.posts,
                              ...(fetchMoreResult as PostsQuery).posts.posts,
                            ],
                          },
                        };
                      },
                    });
                  }}
                />
              )}
            </React.Fragment>
          ))}
          {loading && (
            <HStack justify="center" py={4}>
              <Spinner />
            </HStack>
          )}
        </Stack>
      )}
    </Layout>
  );
};

export default withApollo({ ssr: true })(Index);
