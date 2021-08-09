const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Post {
    title: String
  }
  type Subscription {
    postCreated: Post
  }
  type Query {
    post: String
  }
  type Mutation {
    post(title: String): Post
  }
`;

module.exports = typeDefs;
