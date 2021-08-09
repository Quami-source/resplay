const express = require("express");
const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server-express");
const { createServer } = require("http");
const { execute, subscribe } = require("graphql");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { makeExecutableSchema } = require("@graphql-tools/schema");

const PORT = process.env.PORT || 4000;

const admin = require("firebase-admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Users = require("./db/User");
const resolvers = require("./resolvers");
const typeDefs = require("./typeDefs");

(async function apolloServer(typeDefs, resolvers) {
  //required logic for integrating with express

  const app = express();

  const httpServer = createServer(app);

  //to be passed to both https server and subscription server
  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({ schema });
  server.installSubscriptionHandlers(httpServer);

  await server.start();

  server.applyMiddleware({
    app,
  });

  //subscription server
  SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
    },
    {
      server: httpServer,
      path: "/graphql",
    }
  );

  // ['SIGINT','SIGTERM'].forEach(signal => {
  //   process.on(signal,()=>subscriptionServer.close())
  // })

  httpServer.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}/graphql`);
    //console.log(`Subscription ready at ws://localhost:${PORT}/graphql`);
  });

  //mongodb
  mongoose
    .connect(
      "mongodb+srv://Quamies:qgP92ODhqcrYBY71@cluster0.si7kr.mongodb.net/shaap_users?retryWrites=true&w=majority",
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then((res) => {
      console.log("Database running");
    })
    .catch((e) => console.log("Database error " + e));

  //return { server, app };
})(typeDefs, resolvers);

//apolloServer(typeDefs, resolvers);
