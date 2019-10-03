const path = require('path')
require('dotenv').config()

// All configurations will extend these options
// ============================================
const all = {
  env: process.env.NODE_ENV || 'development',
  // Root path of server
  root: path.normalize(`${__dirname}/../../..`),
  // Server port
  port: process.env.PORT || 3000,
  // Server IP
  ip: process.env.IP || '0.0.0.0',

  db: {
    dialect: 'postgres',
    username: process.env.DBUSER,
    database: process.env.DBNAME,
    password: process.env.DBPASSWORD,
    port: process.env.DBPORT,
    operatorsAliases: false,
    host: process.env.DBHOST || '127.0.0.1',
    logging: val => console.log(val),
    define: {
      timestamps: true
    },
    pool: {
      max: 5,
      min: 0,
      idle: 20000,
      acquire: 20000
    },
    use_env_variable: 'DBHOST',
    dialectOptions: {
      ssl: true
    }
  },
  jwt: {
    ttl: 3200 // 2 hours
  }
}

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  delete all.db.dialectOptions
}
// Export the config object based on the NODE_ENV
// ==============================================
/* eslint-disable */
const mod = require(`./${process.env.NODE_ENV}.js`) || {}
/* eslint-enable */

const result = { ...all, ...mod }

module.exports = result
