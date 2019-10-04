const { ForbiddenError } = require('apollo-server')
const { Message, User } = require('../models')

class MessageProvider {
  async create (data, options = {}) {
    try {
      const result = await Message.create({ ...data }, { ...options })

      return result
    } catch (error) {
      throw new Error(error)
    }
  }

  async update (id, newValues, options = {}) {
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

  async remove (id, ownerId) {
    const message = await this.get(id)
    if (!message) {
      throw new Error('Not found')
    }
    if (message.ownerId !== ownerId) {
      throw ForbiddenError('You are not owner')
    }
    await message.destroy({ where: { id } })

    return true
  }

  async get (id) {
    // TODO add include
    const result = await Message.findByPk(id)
    if (!result) {
      throw new Error('Not found')
    }
    return result
  }

  async list (where, include = [], pagination = { offset: 0, limit: 10 }, order = ['createdAt', 'DESC']) {
    const data = await Message.findAll({
      where,
      include: [
        {
          model: User,
          required: true,
          as: 'owner'
        },
        {
          model: User,
          required: true,
          as: 'recipient'
        }
      ],
      ...pagination,
      order
    })
    const count = await Message.count({ where })

    return ({ data, count })
  }
}

module.exports = MessageProvider
