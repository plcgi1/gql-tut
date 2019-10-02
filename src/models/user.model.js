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
      encrypted_password: {
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
            'encrypted_password',
            'lastJwtString',
            'resetPasswordHash'
          ]
        }
      },
      scopes: {
        list: {
          attributes: {
            exclude: [
              'password',
              'encrypted_password',
              'lastJwtString',
              'resetPasswordHash'
            ]
          }
        },
        jwt: {
          attributes: ['id', 'email', 'encrypted_password', 'status', 'role', 'lastJwtString']
        }
      },
      indexes: [{ unique: true, fields: ['email'] }]
    }
  )

  User.prototype.validPassword = (password) => {
    return bcrypt.compareSync(password, this.encrypted_password)
  }

  User.beforeCreate(async (user) => {
    user.encrypted_password = await bcrypt.hash(user.password, BCRYPT_SALT)
    if (!user.status) {
      user.status = USER_STATUSES.waiting2confirmation
    }
    user.lastJwtString = cryptoRandomString({ length: 16, type: 'url-safe' })
  })
  User.beforeUpdate(async (user) => {
    if (user.password) {
      user.encrypted_password = await bcrypt.hash(user.password, BCRYPT_SALT)
    }

    return true
  })

  // TODO associate relations

  return User
}
