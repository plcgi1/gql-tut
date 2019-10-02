const passport = require('passport')
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const ExtractJWT = passportJWT.ExtractJwt
const config = require('./environment')
const { User } = require('../src/models')
const logger = require('../src/helpers/logger')
const { JWT_USER_ATTRIBUTES } = ['id', 'email', 'encrypted_password']
const label = 'middlewares.passport'

passport.serializeUser((user, done) => {
  return done(null, user.id)
})

passport.deserializeUser((id, done) => {
  return User.findByPk(id, {attributes: JWT_USER_ATTRIBUTES})
    .then(user => {
      return done(null, user)
    })
    .catch(err => {
      logger.error(`${label}.deserializeUser err: %o`, err)
      return done(err, null)
    })
})

passport.use(
  'jwt',
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.secrets.jwt
    },
    (jwtPayload, done) => {
      return User.findOne({
        where: { id: jwtPayload.id, lastJwtString: jwtPayload.lastJwtString },
        attributes: JWT_USER_ATTRIBUTES
      })
        .then(user => {
          return done(null, user)
        })
        .catch(error => {
          logger.error(`${label}.passport.use(jwt) err: %o`, error)
          return done(error, null)
        })
    }
  )
)

passport.use(new GoogleStrategy({
    clientID: config.auth.google.clientId,
    clientSecret: config.auth.google.secret,
    callbackURL: config.auth.google.redirect,
    // enable request in callback
    passReqToCallback   : true
  },
  (request, accessToken, refreshToken, profile, done) => {
  /*
  {
    provider: 'google',
    sub: '113446752963855221158',
    id: '113446752963855221158',
    displayName: 'ALex Nosoff',
    name: { givenName: 'ALex', familyName: 'Nosoff' },
    given_name: 'ALex',
    family_name: 'Nosoff',
    email_verified: true,
    verified: true,
    language: 'ru',
    locale: undefined,
    email: 'plcgi1@googlemail.com',
    emails: [ { value: 'plcgi1@googlemail.com', type: 'account' } ],
    photos: [
      {
        value: 'https://lh3.googleusercontent.com/a-/AAuE7mD5brQLrlryswmmx-Rel9YwtTxGgTJ1hYNfkYknTw',
        type: 'default'
      }
    ],
    picture: 'https://lh3.googleusercontent.com/a-/AAuE7mD5brQLrlryswmmx-Rel9YwtTxGgTJ1hYNfkYknTw',
    _raw: '{\n  "sub": "113446752963855221158",\n  "name": "ALex Nosoff",\n  ' +
      '"given_name": "ALex",\n  "family_name": "Nosoff",\n  "picture": ' +
      '"https://lh3.googleusercontent.com/a-/AAuE7mD5brQLrlryswmmx-Rel9YwtTxGgTJ1hYNfkYknTw",\n' +
      '  "email": "plcgi1@googlemail.com",\n  "email_verified": true,\n  "locale": ' +
      '"ru"\n}',
    _json: {
      sub: '113446752963855221158',
      name: 'ALex Nosoff',
      given_name: 'ALex',
      family_name: 'Nosoff',
      picture: 'https://lh3.googleusercontent.com/a-/AAuE7mD5brQLrlryswmmx-Rel9YwtTxGgTJ1hYNfkYknTw',
      email: 'plcgi1@googlemail.com',
      email_verified: true,
      locale: 'ru'
    }
  }

  * */
    request.profile = profile

    return done(null, profile)
  }
))

passport.use(new FacebookStrategy({
    clientID: config.auth.facebook.clientId,
    clientSecret: config.auth.facebook.secret,
    callbackURL: config.auth.facebook.redirect,
    scope: 'email',
    enableProof: false,
    // enable request in callback
    passReqToCallback: true
  },
  (request, accessToken, refreshToken, profile, done) => {
    request.profile = profile
    /*
    {
      id: '10219917863087042',
      username: undefined,
      displayName: 'Alexandr Nosoff',
      name:
       { familyName: undefined,
         givenName: undefined,
         middleName: undefined },
      gender: undefined,
      profileUrl: undefined,
      provider: 'facebook',
      _raw: '{"name":"Alexandr Nosoff","id":"10219917863087042"}',
      _json: { name: 'Alexandr Nosoff', id: '10219917863087042' }
     }
    * */

    return done(null, profile)
  }
));

module.exports = passport
