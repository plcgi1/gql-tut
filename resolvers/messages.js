const uuidv4 = require('uuid/v4')
const { messages, users } = require('../models')

const resolvers = {
  Query: {
    messages: () => {
      return Object.values(messages)
    },
    message: (parent, { id }) => {
      return messages[id]
    }
  },
  Mutation: {
    createMessage: (parent, { text, userId }) => {
      const id = uuidv4();
      const message = {
        id,
        text,
        userId,
      };
      messages[id] = message;
      users[userId].messageIds.push(id);
      return message;
    },
    deleteMessage: (parent, { id }) => {
      if (!messages[id]) return false
      const deletedMessage = messages[id]
      delete messages[id]

      users[deletedMessage.userId].messageIds = users[deletedMessage.userId].messageIds.filter(msgId => msgId !== id )
      return true
    }
  },
  Message: {
    user: message => {
      return users[message.userId];
    },
  },
};

module.exports = resolvers