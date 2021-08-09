const { PubSub } = require("graphql-subscriptions");

const pubsub = new PubSub();

const resolvers = {
  Query: {
    post: () => "Hello world",
  },
  Mutation: {
    post(parent, args, context) {
      pubsub.publish("POST_CREATED", { postCreated: args });
      //const {title} = args
      //return title
      return post(args);
    },
  },
  Subscription: {
    postCreated: {
      subscribe: () => pubsub.asyncIterator(["POST_CREATED"]),
    },
  },
};

module.exports = resolvers;
