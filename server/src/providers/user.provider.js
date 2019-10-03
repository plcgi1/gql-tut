const { User } = require('../models')
const { AuthenticationError, UserInputError } = require('apollo-server');
const { USER_STATUSES } = require('../helpers/enums')
// const { generateEmailFromOauthProfile } = require('../helpers/generators')
const AuthProvider = require('./auth.provider')

module.exports = class UserProvider {
  // fillOauthParams (profile) {
  //   if (profile.email) {
  //     profile.status = USER_STATUSES.ready
  //   } else {
  //     profile.status = USER_STATUSES.waiting2confirmation
  //     // sometimes Facebook doesnt provide email - we need set it here from generate func
  //     profile.email = generateEmailFromOauthProfile(profile)
  //   }
  //
  //   return profile
  // }

  async getByEmail (email, options = {}) {
    let user
    if (options.scope) {
      user = await User.scope('jwt').findOne({ where: { email } })
    } else {
      user = await User.findOne({ where: { email } })
    }

    return user
  }

  async create (userData) {
    const newUser = await User.create({
      ...userData
    })

    return newUser
  }

  async register (userData) {
    const authProvider = new AuthProvider()

    userData.lastJwtString = authProvider.generateRandomString()
    userData.confirmHash = authProvider.generateRandomString(48)

    const user = await this.create(userData);

    const result = authProvider.createToken(user)
    return result;
  }

  async login ({ email, password }) {
    const authProvider = new AuthProvider()

    const user = await this.getByEmail(email, { scope: 'jwt' })
    if (!user) {
      throw new UserInputError(
        'No user found with this login credentials.',
      );
    }

    const isValid = await authProvider.comparePassword(password, user.encryptedPassword);

    if (!isValid) {
      throw new AuthenticationError('Invalid password.');
    }

    const result = authProvider.createToken(user)

    return result
  }

  async update (user) {
    user.updatedAt = new Date()

    const result = await user.save()

    return result
  }

  async getById (id) {
    try {
      const user = await User.findByPk(id)

      return user
    } catch (error) {
      throw new Error(error)
    }
  }

  async list (where, include = [], pagination = { offset: 0, limit: 10 }) {
    const data = await User.scope('list').findAll({
      where,
      limit: pagination.limit,
      offset: pagination.offset
    })
    const count = await User.count({ where })

    return { data, count }
  }

  async getContext (req) {
    const token = await AuthProvider.verifyToken(req)

    if (!token) return {}

    const user = await this.getById(token.id)
    if (!user) {
      throw new AuthenticationError('No such user')
    }
    return { me: user };
  }
}
