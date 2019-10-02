const { ROLES } = require('../src/helpers/enums')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      encrypted_password: {
        type: Sequelize.STRING,
        validate: {
          notEmpty: true
        }
      },
      role: {
        type: Sequelize.ENUM,
        values: Object.values(ROLES),
        defaultValue: ROLES.user,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      lastJwtString: {
        type: Sequelize.STRING,
        allowNull: false
      },
      resetPasswordHash: {
        type: Sequelize.STRING
      },
      confirmHash: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(() => {
      return queryInterface.addIndex('Users', ['email'], { indicesType: 'UNIQUE' })
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users')
  }
}
