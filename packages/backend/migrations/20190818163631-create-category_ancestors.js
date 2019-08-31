'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('category_ancestors', {
      'category_id': {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'category',
          },
          key: 'id'
        }
      },
      'ancestor_id': {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'category',
          },
          key: 'id'
        }
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('category_ancestors');
  }
};
