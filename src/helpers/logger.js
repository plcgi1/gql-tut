require('dotenv').config()

const log4js = require('log4js')
const config = require('../../config/environment')
log4js.configure(config.log4js)

let logger

const getLogger = () => {
  if (!logger) {
    logger = log4js.getLogger('console')
  }
  return logger
}
module.exports = getLogger()
