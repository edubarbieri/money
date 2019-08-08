const { sequelize } = require('../db/models');

const queryTagsByMonth = (month, year, table) => {
	return sequelize
		.query(
			`select tag
			from (
				select distinct tag
				from ${table}
				where month = :month
				and year = :year
				and tag is not null) tgs
			order by 1`,
			{
				replacements: { month, year },
				type: sequelize.QueryTypes.SELECT
			}
		);
};

const queryTagsDebt = (month, year) => {
	return queryTagsByMonth(month, year, 'debts');
};

const queryTagsCredits = (month, year) => {
	return queryTagsByMonth(month, year, 'credits');
};


module.exports = {
	queryTagsDebt,
	queryTagsCredits
};
