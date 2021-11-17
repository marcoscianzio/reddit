import "reflect-metadata";
import { createConnection } from "typeorm";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { PostResolver } from "./resolvers/post";
import { UserResolver } from "./resolvers/user";

const main = async () => {
  await createConnection();

  const app = express();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [PostResolver, UserResolver],
      validate: false,
    }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    path: "/graphql",
    app,
  });

  app.listen(4000, () => {
    console.log("Server started on localhost:4000");
  });
};

main();
