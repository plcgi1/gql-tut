'use strict';
const { USER_STATUSES, ROLES } = require('../src/helpers/enums')

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        email: 'user1@mail.com',
        encryptedPassword: '123',
        status: USER_STATUSES.ready,
        createdAt: '2019-10-10',
        updatedAt: '2019-10-10',
        role: ROLES.user,
        lastJwtString: '1'
      },
      {
        email: 'user2@mail.com',
        encryptedPassword: '123',
        status: USER_STATUSES.ready,
        createdAt: '2019-10-10',
        updatedAt: '2019-10-10',
        role: ROLES.user,
        lastJwtString: '1'
      },
      {
        email: 'user3@mail.com',
        encryptedPassword: '123',
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
