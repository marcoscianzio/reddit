import { useApolloClient } from "@apollo/client";
import { Button, ButtonGroup } from "@chakra-ui/button";
import { HStack, Link, Text } from "@chakra-ui/layout";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });
  const [logout, { loading: logoutLoading }] = useLogoutMutation();
  const apolloClient = useApolloClient();

  let body = null;

  if (loading) {
  } else if (data?.Me) {
    body = (
      <HStack>
        <Text>{data.Me.username}</Text>
        <NextLink href="/create-post">
          <Link>Create new post</Link>
        </NextLink>
        <Button
          onClick={async () => {
            await logout();
            await apolloClient.resetStore();
          }}
          isLoading={logoutLoading}
          loadingText="Cerrando sesión..."
        >
          Cerrar sesión
        </Button>
      </HStack>
    );
  } else {
    body = (
      <ButtonGroup>
        <NextLink href="/login">
          <Button>Login</Button>
        </NextLink>
        <NextLink href="/register">
          <Button>Register</Button>
        </NextLink>
      </ButtonGroup>
    );
  }

  return (
    <HStack
      position="sticky"
      zIndex={1}
      top={0}
      bg="white"
      p={4}
      justify="space-between"
    >
      <Text>Reddit</Text>
      {body}
    </HStack>
  );
};

export default Navbar;
