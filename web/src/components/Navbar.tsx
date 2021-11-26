import { useApolloClient } from "@apollo/client";
import { Button, ButtonGroup } from "@chakra-ui/button";
import { HStack, Text } from "@chakra-ui/layout";
import NextLink from "next/link";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  const { data, loading } = useMeQuery();
  const [logout, { loading: logoutLoading }] = useLogoutMutation();
  const apolloClient = useApolloClient();

  let body = null;

  if (loading) {
  } else if (data?.Me) {
    body = (
      <HStack>
        <Text>{data.Me.username}</Text>
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
          <Button>Iniciar sesión</Button>
        </NextLink>
        <NextLink href="/register">
          <Button>Registrate</Button>
        </NextLink>
      </ButtonGroup>
    );
  }

  return (
    <HStack bg="white" p={4} justify="space-between">
      <Text>Reddit</Text>
      {body}
    </HStack>
  );
};

export default Navbar;
