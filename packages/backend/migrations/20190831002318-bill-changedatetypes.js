'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface
			.changeColumn('bill', 'due_date', {
				type: Sequelize.DATEONLY,
				allowNull: false
			})
			.then(() => {
				return queryInterface.changeColumn('bill', 'payment_date', {
					type: Sequelize.DATEONLY
				});
			});
	},

	down: (queryInterface, Sequelize) => {
	}
};
