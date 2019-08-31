'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_wallet', {
      'user_id': {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'app_user',
          },
          key: 'id'
        }
      },
      'wallet_id': {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'wallet',
          },
          key: 'id'
        }
      },
      'is_owner': {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    return queryInterface.dropTable('user_wallet');
  }
};