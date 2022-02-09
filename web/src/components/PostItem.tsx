import { ApolloCache, gql } from "@apollo/client";
import { Avatar } from "@chakra-ui/avatar";
import { Button } from "@chakra-ui/button";
import { Heading, HStack, Stack, Text, VStack } from "@chakra-ui/layout";
import {
  PostSnippetFragment,
  useVoteMutation,
  VoteMutation,
} from "../generated/graphql";

interface PostItemProps {
  post: PostSnippetFragment;
}

const updateAfterVote = (
  value: number,
  cache: ApolloCache<VoteMutation>,
  postId: number
) => {
  const data = cache.readFragment<{
    id: number;
    points: number;
  }>({
    id: "Post:" + postId,
    fragment: gql`
      fragment nashe on Post {
        id
        points
      }
    `,
  });

  if (data) {
    const newPoints = data.points + value;

    cache.writeFragment({
      id: "Post:" + data.id,
      fragment: gql`
        fragment god on Post {
          points
        }
      `,
      data: {
        points: newPoints,
      },
    });
  }
};

const PostItem: React.FC<PostItemProps> = ({ post }) => {
  const [vote] = useVoteMutation();

  const handleVote = async (value: number) => {
    return await vote({
      variables: {
        postId: post.id,
        value,
      },
      update: (cache) => updateAfterVote(value, cache, post.id),
    });
  };

  return (
    <Stack
      borderWidth={1}
      direction="row"
      align="flex-start"
      rounded="md"
      // borderColor="#878a8c"
      h="170px"
      w="full"
    >
      <VStack h="full" minW="60px" pt={2}>
        <Button variant="ghost" onClick={() => handleVote(1)}>
          ↑
        </Button>
        <Text>{post.points}</Text>
        <Button variant="ghost" onClick={() => handleVote(-1)}>
          ↓
        </Button>
      </VStack>
      <Stack spacing={0}>
        <HStack py={4}>
          <Avatar size="xs"></Avatar>
          <Text fontSize="xs">
            Posted by {post.author.username} 4 hours ago
          </Text>
        </HStack>
        <Stack>
          <Heading fontSize="2xl">{post.title}</Heading>
          <Text fontSize="md">{post.textSnippet}</Text>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default PostItem;
