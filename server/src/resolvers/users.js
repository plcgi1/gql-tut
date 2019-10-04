const { combineResolvers } = require('graphql-resolvers')
const UserProvider = require('../providers/user.provider')
const { ROLES } = require('../helpers/enums')
const { isAuthenticated, isUserRoleCan } = require('../providers/auth.provider')
const sortConditions = require('../helpers/sort-conditions')

module.exports = {
  Query: {
    user: async (parent, { id }) => {
      const provider = new UserProvider()
      const result = await provider.getById(id)

      return result
    },
    users: combineResolvers(
      isAuthenticated,
      isUserRoleCan(ROLES.root),
      async (parent, { limit, offset, sort }) => {
        const provider = new UserProvider()
        const order = sortConditions(sort)

        const result = provider.list({}, {}, { limit, offset }, order)

        return result
      }
    )
  },
  Mutation: {
    signUp: async (parent, { email, password }) => {
      const provider = new UserProvider()

      const result = await provider.register({ email, password })

      return result
    },
    signIn: async (parent, { email, password }) => {
      const provider = new UserProvider()
      try {
        const result = await provider.login({ email, password })

        return result
      } catch (error) {
        throw new Error(error)
      }
    }
  }
}
