'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('category', {
      'id': {
				allowNull: false,
				primaryKey: true,
        type: Sequelize.DataTypes.UUID,
				defaultValue: Sequelize.literal('uuid_generate_v4()')
      },
      'wallet_id': {
        allowNull: false,
        type: Sequelize.DataTypes.UUID,
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
        type: Sequelize.DataTypes.UUID,
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
