var {
  makeExecutableSchema,
  addMockFunctionsToSchema,
} = require('graphql-tools');

var { resolvers } = require('./resolvers');

const typeDefs = `
type Transaction {
  txid: String!
}

type Channel {
  id: ID!,
  name: String,
  messages: [Message]!
}

input MessageInput{
  channelId: ID!,
  text: String
}

type Message {
  id: ID!,
  text: String
}

# This type specifies the entry points into our API
type Query {
  channels: [Channel],
  channel(id: ID!): Channel,
  transaction: Transaction
}

# The mutation root type, used to define all mutations
type Mutation {
  addChannel(name: String!): Channel,
  addMessage(message: MessageInput!): Message,
  addTransaction(txid: String!): Transaction
}

# The subscription root type, specifying what we can subscribe to
type Subscription {
  messageAdded(channelId: ID!): Message,
  txNotify: Transaction
}
`;

const schema = makeExecutableSchema({ typeDefs, resolvers });
module.exports = { schema };
