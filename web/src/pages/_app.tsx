import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";

import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import theme from "../theme";
import { AppProps } from "next/dist/shared/lib/router/router";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache(),
  credentials: "include",
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <ChakraProvider resetCSS theme={theme}>
        <ColorModeProvider
          options={{
            useSystemColorMode: true,
          }}
        >
          <Component {...pageProps} />
        </ColorModeProvider>
      </ChakraProvider>
    </ApolloProvider>
  );
}

export default MyApp;
