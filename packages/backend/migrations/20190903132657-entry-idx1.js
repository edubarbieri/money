'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addIndex('entry', ['entry_date', 'type', 'wallet_id']);
  },

  down: (queryInterface, Sequelize) => {
  }
};
