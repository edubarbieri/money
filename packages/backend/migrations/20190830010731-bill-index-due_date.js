'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.addIndex('bill', ['due_date']);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeIndex('bill', ['due_date']);
  }
};
