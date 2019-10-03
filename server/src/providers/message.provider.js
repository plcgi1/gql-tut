const { Message } = require('../models')

class MessageProvider {
  async create (data, options = {}) {
    try {
      const result = await Message.create({...data}, { ...options })

      return result
    } catch (error) {
      throw new Error(error)
    }
  }

  async update(id, newValues, options = {}) {
    newValues.updatedAt = new Date();

    const result = await Message.update(newValues, {
      where: { id },
      limit: 1,
      ...options
    })
    if (result instanceof Array && result.length > 1) {
      return result[1][0]
    }
    return result
  }

  static async get (id) {
    const result = await Message.findByPk(id)

    return result
  }

  async list (query = {}, paging = {}) {
    // TODO implement me
    const where = {}

    Object.keys(Message.rawAttributes).forEach((name) => {
      if (query[name]) {
        where[name] = query[name]
      }
    })
    const data = await Message.findAll({
      where,
      ...paging
    })
    const count = await Message.count({ where })
    return ({ data, count })
  }
}

module.exports = MessageProvider
