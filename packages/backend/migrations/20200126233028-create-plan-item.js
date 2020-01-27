'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('plan_item', {
			'id': {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.DataTypes.UUID,
				defaultValue: Sequelize.literal('uuid_generate_v4()')
			},
			'item_date': { type: Sequelize.DATEONLY, allowNull: false },
			'amount': { type: Sequelize.DECIMAL(10, 2), allowNull: false },
			'type': { type: Sequelize.ENUM('CREDIT', 'DEBIT'), allowNull: false },
			'plan_id': {
				allowNull: false,
				type: Sequelize.DataTypes.UUID,
				references: {
					model: {
						tableName: 'plan'
					},
					key: 'id'
				}
			},
			'created_at': {
        allowNull: false,
        type: Sequelize.DATE
      },
      'updated_at': {
        allowNull: false,
        type: Sequelize.DATE
      }
		})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('plan_item');
  }
};
