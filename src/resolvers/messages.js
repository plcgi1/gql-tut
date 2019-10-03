const { Message, User } = require('../models')

const resolvers = {
  Query: {
    messages: async () => {
      const data = await Message.findAll({
        include: [
          {
            model: User,
            required: true,
            as: 'owner'
          },
          {
            model: User,
            required: true,
            as: 'recipient'
          }
        ]
      })
      return data
    },
    message: async (parent, { id }) => {
      const data = await Message.findByPk(
        id,
        {
          include: [
            {
              model: User,
              required: true,
              as: 'owner'
            },
            {
              model: User,
              required: true,
              as: 'recipient'
            }
          ]
        }
      )
      return data
    }
  },
  Mutation: {
    createMessage: async (parent, { text, ownerId, recipientId }) => {
      const result = await Message.create({
        text, ownerId, recipientId
      })
      return result
    },
    deleteMessage: async (parent, { id }, { models }) => {
      return await models.Message.destroy({ where: { id } });
    }
  }
}

module.exports = resolvers
