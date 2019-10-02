module.exports = {
  port: 3000,
  serverUrl: 'http://localhost:3000',
  frontendUrl: 'http://localhost:3001',
  db: {
    dialect: 'postgres',
    username: process.env.DBUSER || 'postgres',
    database: process.env.DBNAME || 'advicely',
    password: process.env.DBPASSWORD,
    port: process.env.DBPORT,
    operatorsAliases: false,
    host: process.env.DBHOST || '127.0.0.1',
    logging: val => console.log(val + '\n')
  },
  secrets: {
    jwt: process.env.JWT_SECRET
  },
  log4js: {
    appenders: {
      console: {
        type: 'console'
        // layout: {
        //   type: 'pattern',
        //   pattern: '[%h] [%d] [%m] [%c] %m',
        // },
      }
    },
    categories: { default: { appenders: ['console'], level: 'debug' } }
  },
  auth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect: `http://${process.env.HOST}/api/auth/google/callback`,
      frontendRedirect: `${process.env.FRONTEND_HOST}/app/auth/google/callback`
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID,
      secret: process.env.FACEBOOK_CLIENT_SECRET,
      redirect: `http://${process.env.HOST}/api/auth/facebook/callback`,
      frontendRedirect: `${process.env.FRONTEND_HOST}/app/auth/facebook/callback`
    }
  }
}
