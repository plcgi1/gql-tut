const { User } = require('../models')

module.exports = {
  Query: {
    user: async (parent, { id }) => {
      const result = await User.findByPk(id)
      return result
    },
    users: async () => {
      const result = await User.findAll()
      return result
    }
  }
}
