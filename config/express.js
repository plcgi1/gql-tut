/**
 * Express configuration
 */

const log4js = require('log4js')

const path = require('path')

const { ApolloServer } = require('apollo-server-express')

const config = require(path.resolve('./config/environment'))

const resolvers = require('../src/resolvers')
const schema = require('../src/schemas')

module.exports = (app) => {
  const server = new ApolloServer({
    typeDefs: schema,
    resolvers
  })

  server.applyMiddleware({ app, path: '/graphql' })

  log4js.configure(config.log4js)

  let logger

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
