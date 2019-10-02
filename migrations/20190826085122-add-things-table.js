module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Messages', {
      id: {
        type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          unique: true,
          autoIncrement: true
      },
      ownerId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      recipientId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      text: {
        type: Sequelize.STRING,
          allowNull: false,
          validate: {
          notEmpty: true
        }
      },
      createdAt: {
        allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Date.now()
      },
      updatedAt: {
        allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Date.now()
      }
    })
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('Messages')
  }
}
