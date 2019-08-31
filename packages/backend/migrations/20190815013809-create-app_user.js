'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('app_user', {
      'id': {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
				defaultValue: Sequelize.literal('uuid_generate_v4()')
      },
      'name': {
        type: Sequelize.STRING,
        allowNull: false
      },
      'email': {
        type: Sequelize.STRING,
        allowNull: false
      },
      'password': {
        type: Sequelize.STRING,
        allowNull: false
      },
      'avatar': {
        type: Sequelize.STRING
      },
      'created_at': {
        allowNull: false,
        type: Sequelize.DATE
      },
      'updated_at': {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('app_user');
  }
};
