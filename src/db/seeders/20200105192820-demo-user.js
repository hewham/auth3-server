'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
           return queryInterface.bulkInsert('user', [
            {
        id:'11111111-1111-1111-1111-111111111111',
        address: "fakeEthAddress1",
        username: "u1"
        // email:'test1@test.com',
      },{
        id:'22222222-2222-2222-2222-222222222222',
        address: "fakeEthAddress2",
        username: "u2"
        // email:'test2@test.com',
      }
   ], {});
  },

  down: (queryInterface, Sequelize) => {
         return queryInterface.bulkDelete('user', null, {});
  }
};
