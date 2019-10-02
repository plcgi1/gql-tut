const { users, messages } = require('../models')

module.exports = {
  Query: {
    me: () => {
      return me
    },
    user: (parent, { id }) => {
      return models.users[id]
    },
    users: () => {
      return Object.values(users)
    },
  },
  User: {
    username: user => `${user.firstname} ${user.lastname}`,
    messages: user => {
      return Object.values(messages).filter(
        message => message.userId === user.id,
      );
    },
  },
};