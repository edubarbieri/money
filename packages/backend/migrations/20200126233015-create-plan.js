'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('plan', {
			'id': {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.DataTypes.UUID,
				defaultValue: Sequelize.literal('uuid_generate_v4()')
			},
			'name': { type: Sequelize.STRING, allowNull: false },
			'goal': { type: Sequelize.STRING},
			'start_date': { type: Sequelize.DATEONLY, allowNull: false },
			'end_date': { type: Sequelize.DATEONLY, allowNull: false },
			'type': { type: Sequelize.STRING},
			'goal_amount': { type: Sequelize.DECIMAL(10, 2), allowNull: false },
			'wallet_id': {
				allowNull: false,
				type: Sequelize.DataTypes.UUID,
				references: {
					model: {
						tableName: 'wallet'
					},
					key: 'id'
				}
			},
			'user_id': {
				type: Sequelize.DataTypes.UUID,
				references: {
					model: {
						tableName: 'app_user'
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
    return queryInterface.dropTable('plan');
  }
};
