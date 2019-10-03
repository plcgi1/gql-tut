const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../../config/environment')
const cryptoRandomString = require('crypto-random-string')
const { AuthenticationError, ForbiddenError } = require('apollo-server-express')
const { skip } = require('graphql-resolvers')

module.exports = class AuthProvider {
  createToken (user) {
    const expiresIn = config.jwt.ttl
    const secret = config.secrets.jwt

    const dataStoredInToken = {
      id: user.id,
      role: user.role,
      lastJwtString: user.lastJwtString
    }
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn })
    }
  }

  createCookie (tokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`
  }

  async comparePassword (inputPassword, realPassword) {
    const result = await bcrypt.compare(inputPassword, realPassword)

    return result
  }

  generateRandomString (length = 16) {
    return cryptoRandomString({ length, type: 'url-safe' })
  }

  static async verifyToken (req) {
    const token = req.headers['x-token']

    if (token) {
      try {
        const verified = await jwt.verify(token, config.secrets.jwt)

        return verified
      } catch (e) {
        throw new AuthenticationError(
          'Your session expired. Sign in again.'
        )
      }
    }
  }

  static isAuthenticated (parent, args, { me }) {
    return me ? skip : new ForbiddenError('Not authenticated as user.')
  }

  static isUserRoleCan (role) {
    return (parent, args, { me }) => {
      return me.role === role ? skip : new ForbiddenError('Access denied.')
    }
  }
}
