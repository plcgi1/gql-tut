const bcrypt = require('bcrypt')
const { USER_STATUSES, ROLES, BCRYPT_SALT } = require('../src/helpers/enums')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const encryptedPassword = await bcrypt.hash('123', BCRYPT_SALT)
    await queryInterface.bulkInsert('Users', [
      {
        email: 'user1@mail.com',
        encryptedPassword,
        status: USER_STATUSES.ready,
        createdAt: '2019-10-10',
        updatedAt: '2019-10-10',
        role: ROLES.user,
        lastJwtString: '1'
      },
      {
        email: 'user2@mail.com',
        encryptedPassword,
        status: USER_STATUSES.ready,
        createdAt: '2019-10-10',
        updatedAt: '2019-10-10',
        role: ROLES.user,
        lastJwtString: '1'
      },
      {
        email: 'user3@mail.com',
        encryptedPassword,
        status: USER_STATUSES.ready,
        createdAt: '2019-10-10',
        updatedAt: '2019-10-10',
        role: ROLES.user,
        lastJwtString: '1'
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
