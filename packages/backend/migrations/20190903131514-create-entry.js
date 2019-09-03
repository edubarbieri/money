'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('entry', {
			'id': {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.DataTypes.UUID,
				defaultValue: Sequelize.literal('uuid_generate_v4()')
			},
			'description': { type: Sequelize.STRING, allowNull: false },
			'entry_date': { type: Sequelize.DATEONLY, allowNull: false },
			'amount': { type: Sequelize.DECIMAL(10, 2), allowNull: false },
			'type': { type: Sequelize.ENUM('CREDIT', 'DEBIT'), allowNull: false },
			'recurrent': { type: Sequelize.BOOLEAN, defaultValue: false },
			'recurrent_total': { type: Sequelize.INTEGER },
			'recurrent_count': { type: Sequelize.INTEGER },
			'import_hash': { type: Sequelize.STRING, field: 'import_hash' },
			'import_source': { type: Sequelize.STRING, field: 'import_source' },
			'category_id': {
				type: Sequelize.DataTypes.UUID,
				references: {
					model: {
						tableName: 'category'
					},
					key: 'id'
				}
			},
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
			'source_entry_id': {
				type: Sequelize.DataTypes.UUID,
				references: {
					model: {
						tableName: 'entry'
					},
					key: 'id'
				}
			},
			'created_at': { allowNull: false, type: Sequelize.DATE },
			'updated_at': { allowNull: false, type: Sequelize.DATE }
		});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('entry');
	}
};
