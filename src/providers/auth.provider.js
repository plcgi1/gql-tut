const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const config = require('../../config/environment')
const cryptoRandomString = require('crypto-random-string')

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

  generateRandomString(length = 16) {
    return cryptoRandomString({ length, type: 'url-safe' })
  }
}
