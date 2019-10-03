/**
 * Express configuration
 */

const log4js = require('log4js')

const path = require('path')

const { ApolloServer } = require('apollo-server-express')

const config = require(path.resolve('./config/environment'))

const resolvers = require('../src/resolvers')
const schema = require('../src/schemas')
const UserProvider = require('../src/providers/user.provider')

module.exports = (app) => {
  let logger

  const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
    formatError: error => {
      // remove the internal sequelize error message
      // leave only the important validation error
      const message = error.message
        .replace('SequelizeValidationError: ', '')
        .replace('Validation error: ', '');
      logger.error('EEEEE', error)
      return {
        ...error,
        message,
      };
    },

    context: async ({ req }) => {
      const userProvider = new UserProvider()
      const result = await userProvider.getContext(req)

      return result
    }
  })

  server.applyMiddleware({ app, path: '/graphql' })
  log4js.configure(config.log4js)

  const env = app.get('env')

  if (env === 'production') {
    logger = log4js.getLogger('file')

    app.use(log4js.connectLogger(logger, { level: log4js.levels.INFO }))
  }

  if (env === 'development' || env === 'test') {
    log4js.configure(config.log4js)

    logger = log4js.getLogger('console')

    app.use(log4js.connectLogger(logger, { level: log4js.levels.INFO }))
  }
}
