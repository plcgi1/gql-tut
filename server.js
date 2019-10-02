process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const path = require('path')
const express = require('express')

const config = require('./config/environment')

// Connect to database with models loading
require('./src/models')

const app = express()

require(path.resolve('./config/express'))(app)

app.listen({ port: config.port }, () => {
  console.log(`Apollo Server on http://localhost:${config.port}/graphql with env ${config.env}`)
})
