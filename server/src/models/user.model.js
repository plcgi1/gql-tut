const bcrypt = require('bcrypt')
const cryptoRandomString = require('crypto-random-string');
const { USER_STATUSES, ROLES, BCRYPT_SALT } = require('../helpers/enums')

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true
      },
      email: {
        type: DataTypes.STRING,
        unique: {
          args: true,
          fields: [sequelize.fn('lower', sequelize.col('email'))]
        },
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 255]
        }
      },
      role: {
        type: DataTypes.ENUM,
        values: Object.values(ROLES),
        defaultValue: ROLES.user,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      status: {
        type: DataTypes.ENUM,
        values: Object.values(USER_STATUSES),
        defaultValue: USER_STATUSES.waiting2confirmation,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      password: {
        type: DataTypes.VIRTUAL,
        set: function (val) {
          // Remember to set the data value, otherwise it won't be validated
          this.setDataValue('password', val)
        },
        validate: {
          isLongEnough: function (val) {
            if (val.length < 7) {
              throw new Error('Please choose a longer password')
            }
          }
        }
      },
      encryptedPassword: {
        type: DataTypes.STRING,
        validate: {
          notEmpty: true
        }
      },
      lastJwtString: {
        type: DataTypes.STRING,
        allowNull: false
      },
      resetPasswordHash: {
        type: DataTypes.STRING
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      confirmHash: {
        type: DataTypes.STRING
      }
    },
    {
      defaultScope: {
        attributes: {
          exclude: [
            'password',
            'encryptedPassword',
            'lastJwtString',
            'resetPasswordHash',
            'confirmHash'
          ]
        }
      },
      scopes: {
        list: {
          attributes: {
            exclude: [
              'password',
              'encryptedPassword',
              'lastJwtString',
              'resetPasswordHash'
            ]
          }
        },
        jwt: {
          attributes: ['id', 'email', 'encryptedPassword', 'status', 'role', 'lastJwtString']
        }
      },
      indexes: [{ unique: true, fields: ['email'] }]
    }
  )

  User.beforeCreate(async (user) => {
    user.encryptedPassword = await bcrypt.hash(user.password, BCRYPT_SALT)
    if (!user.status) {
      user.status = USER_STATUSES.waiting2confirmation
    }
    user.lastJwtString = cryptoRandomString({ length: 16, type: 'url-safe' })
  })
  User.beforeUpdate(async (user) => {
    if (user.password) {
      user.encryptedPassword = await bcrypt.hash(user.password, BCRYPT_SALT)
    }

    return true
  })

  User.associate = models => {
    User.hasMany(models.Message, { onDelete: 'CASCADE', foreignKey: 'ownerId', as: 'owner' });
    User.hasMany(models.Message, { onDelete: 'CASCADE', foreignKey: 'recipientId', as: 'recipient' });
  };

  return User
}
