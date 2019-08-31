'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('bill', 'source_bill_id', Sequelize.DataTypes.UUID, {
			references: {
				model: {
					tableName: 'bill',
				},
				key: 'id'
			}
		});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('bill', 'source_bill_id');
  }
};
