'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
		return queryInterface.addIndex('entry', ['id', 'wallet_id', 'type']);
  },

  down: (queryInterface, Sequelize) => {
  }
};
