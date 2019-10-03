const config = require('./config/environment')

const path = require('path')
const express = require('express')

// Connect to database with models loading
require('./src/models')

const app = express()

require(path.resolve('./config/express'))(app)

app.listen({ port: config.port }, () => {
  console.log(`Apollo Server on http://localhost:${config.port}/graphql with env ${config.env}`)
})
