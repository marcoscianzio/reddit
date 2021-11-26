import { ApolloClient, InMemoryCache } from "@apollo/client";
import { withApollo as createWithApollo } from "next-apollo";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  cache: new InMemoryCache({
    typePolicies: {
      User: {
        keyFields: ["username"],
      },
    },
  }),
  credentials: "include",
});

export const withApollo = createWithApollo(client);
