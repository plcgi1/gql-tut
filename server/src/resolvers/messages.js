const { combineResolvers } = require('graphql-resolvers')
const { Message, User } = require('../models')
const { isAuthenticated } = require('../providers/auth.provider')
const MessageProvider = require('../providers/message.provider')
const sortConditions = require('../helpers/sort-conditions')

const resolvers = {
  Query: {
    messages: async (parent, { limit, offset, sort }) => {
      const order = sortConditions(sort)
      const provider = new MessageProvider()
      const result = provider.list({}, [], { limit, offset }, order)

      return result
    },
    message: async (parent, { id }) => {
      const provider = new MessageProvider()
      const result = provider.get(id)
      return result
    }
  },
  Mutation: {
    createMessage: combineResolvers(
      isAuthenticated,
      async (parent, { text, recipientId }, { me }) => {
        const provider = new MessageProvider()

        const result = await provider.create({
          text, ownerId: me.id, recipientId
        })
        return result
      }
    ),
    deleteMessage: async (parent, { id }, { me }) => {
      const provider = new MessageProvider()
      const result = await provider.remove(id, me.id)
      return result
    }
  }
}

module.exports = resolvers
