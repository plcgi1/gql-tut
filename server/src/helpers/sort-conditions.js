const _ = require('lodash')
const models = require('../models')

module.exports = (sortQuery, allowedFileds) => {
  let sortColumn = sortQuery || ''

  const sortDirection = sortColumn[0] === '-' ? 'DESC' : 'ASC'
  if (sortColumn[0] === '-') sortColumn = sortColumn.substring(1)

  if (
    !sortColumn ||
    (allowedFileds && !_.includes(allowedFileds, sortColumn))
  ) {
    sortColumn = 'createdAt'
  }

  const subparams = sortColumn.split('.')

  if (subparams.length >= 2) {
    let result = [subparams.pop(), sortDirection]

    for (let i = subparams.length - 1; i >= 0; i--) {
      let modelName = subparams[i]
      let asName = modelName.toLowerCase()

      result.unshift({
        model: models[_.upperFirst(_.camelCase(modelName))],
        as: asName
      })
    }

    return result
  } else {
    return [[sortColumn, sortDirection]]
  }
}
