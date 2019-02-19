var { PubSub } = require('graphql-subscriptions');
var { withFilter } = require('graphql-subscriptions');

const channels = [{
  id: '1',
  name: 'soccer',
  messages: [{
    id: '1',
    text: 'soccer is football',
  }, {
    id: '2',
    text: 'hello soccer world cup',
  }]
}, {
  id: '2',
  name: 'baseball',
  messages: [{
    id: '3',
    text: 'baseball is life',
  }, {
    id: '4',
    text: 'hello baseball world series',
  }]
}];

const transactions = [
  {
    txid: "123"
  }
]

let nextId = 3;
let nextMessageId = 5;

const pubsub = new PubSub();

const resolvers = {
  Query: {
    channels: () => {
      return channels;
    },
    channel: (root, { id }) => {
      return channels.find(channel => channel.id === id);
    },
    transaction: () => {
      return transactions[transactions.length-1];
    }
  },
  Mutation: {
    addChannel: (root, args) => {
      const newChannel = { id: String(nextId++), messages: [], name: args.name };
      channels.push(newChannel);
      return newChannel;
    },
    addMessage: (root, { message }) => {
      const channel = channels.find(channel => channel.id === message.channelId);
      if(!channel)
        throw new Error("Channel does not exist");

      const newMessage = { id: String(nextMessageId++), text: message.text };
      channel.messages.push(newMessage);

      pubsub.publish('messageAdded', { messageAdded: newMessage, channelId: message.channelId });

      return newMessage;
    },
    addTransaction: (root, { txid }) => {
      transactions.push({txid: txid});

      pubsub.publish('txNotify', {'txNotify': {txid: txid} });

      return transactions[transactions.length-1];
    }
  },
  Subscription: {
    messageAdded: {
      subscribe: withFilter(() => pubsub.asyncIterator('messageAdded'), (payload, variables) => {
        return payload.channelId === variables.channelId;
      }),
    },
    txNotify: {
      subscribe: withFilter(() => pubsub.asyncIterator('txNotify'), () => {
        return true
      }),
    }
  },
};

module.exports = {resolvers};