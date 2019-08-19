'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('category', {
      'id': {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      'wallet_id': {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'wallet',
          },
          key: 'id'
        }
      },
      'name': {
        type: Sequelize.STRING,
        allowNull: false
      },
      'keywords': {
        type: Sequelize.ARRAY(Sequelize.STRING)
      },
      'parent_id': {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'category',
          },
          key: 'id'
        }
      },
      'hierarchy_level': {
        type: Sequelize.INTEGER,
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
    return queryInterface.dropTable('category');
  }
};
