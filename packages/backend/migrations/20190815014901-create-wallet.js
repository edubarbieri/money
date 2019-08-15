'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('wallet', {
      'id': {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      'name': {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'name'
      },
      'description': {
        type: Sequelize.STRING
      },
      'created_at': {
        allowNull: false,
        type: Sequelize.DATE
      },
      'updated_at': {
        allowNull: false,
        type: Sequelize.DATE
      },
      'deleted_at': {
        type: Sequelize.DATE
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('wallet');
  }
};
