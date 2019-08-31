'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.sequelize
			.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
			.then(() => {
				return queryInterface.createTable('bill', {
					'id': {
						allowNull: false,
						primaryKey: true,
						type: Sequelize.DataTypes.UUID,
						defaultValue: Sequelize.literal('uuid_generate_v4()')
					},
					'description': {
						type: Sequelize.STRING,
						allowNull: false
					},
					'due_date': {
						type: Sequelize.DATEONLY,
						allowNull: false
					},
					'payment_date': { type: Sequelize.DATEONLY },
					'amount': {
						type: Sequelize.DECIMAL(10, 2),
						allowNull: false
					},
					'amount_paid': {
						type: Sequelize.DECIMAL(10, 2)
					},
					'recurrent': {
						type: Sequelize.BOOLEAN,
						defaultValue: false
					},
					'recurrent_total': {
						type: Sequelize.INTEGER
					},
					'recurrent_count': {
						type: Sequelize.INTEGER
					},
					'category_id': {
						type: Sequelize.DataTypes.UUID,
						references: {
							model: {
								tableName: 'category',
							},
							key: 'id'
						}
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
					'user_id': {
						type: Sequelize.DataTypes.UUID,
						references: {
							model: {
								tableName: 'app_user',
							},
							key: 'id'
						}
					},
					'source_bill_id': {
						type: Sequelize.DataTypes.UUID,
						references: {
							model: {
								tableName: 'bill',
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
				});
			});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('bill');
	}
};
