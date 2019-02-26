const { sequelize, formatDbError } = require('../sequelize');

const summaryMonth = (req, res) => {
	const { year, month } = req.params;
	sequelize
		.query(
			`select
			(select sum(value) from debts where month = :month and year = :year) debt,
			(select sum(value) from credits where month = :month and year = :year) credit`,
			{ type: sequelize.QueryTypes.SELECT,
				replacements: {month, year}
			}
		)
		.then(items => {
			res.json(items[0] || {});
		})
		.catch(e => {
			formatDbError(res, e);
		});
};

module.exports = router => {
	router.get('/summary/:year/:month', summaryMonth);
};
