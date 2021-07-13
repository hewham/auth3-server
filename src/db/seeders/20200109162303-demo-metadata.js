'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

    */
    return queryInterface.bulkInsert('metadata', [
      {
        id:'1',
        isMetadataHere: "Yup",
        adminVersion: "0.0.1",
        expressVersion: "0.0.1",
        webappVersion: "0.0.1",
        mobileVersion: "0.0.1",
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
