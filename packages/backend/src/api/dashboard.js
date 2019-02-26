const { sequelize, formatDbError } = require('../sequelize');

const summary = (req, res) => {
	sequelize
		.query(
			`select
			(select sum(value) from debts) debt,
			(select sum(value) from credits) credit`,
			{ type: sequelize.QueryTypes.SELECT }
		)
		.then(items => {
			res.json(items[0] || {});
		})
		.catch(e => {
			formatDbError(res, e);
		});
};

const summaryByMonth = (req, res) => {
	sequelize
		.query(
			`select
			dt.year, dt.month,
			CONCAT (CASE dt.month
				when 1 then 'Janeiro'
				when 2 then 'Fevereiro'
				when 3 then 'Março'
				when 4 then 'Abril'
				when 5 then 'Maio'
				when 6 then 'Junho'
				when 7 then 'Julho'
				when 8 then 'Agosto'
				when 9 then 'Setembro'
				when 10 then 'Outubro'
				when 11 then 'Novembro'
				when 12 then 'Dezembro'
			END, '/', dt.year) as name,
			nvl((select sum(value) from credits c where c.year = dt.year and c.month = dt.month), 0.0) credit,
			nvl((select sum(value) from debts d where d.year = dt.year and d.month = dt.month), 0.0) debt
			from (
				select distinct month, year from debts
				union
				select distinct month, year from credits
			) dt

			order by dt.year, dt.month`,
			{ type: sequelize.QueryTypes.SELECT }
		)
		.then(items => {
			res.json(items || []);
		})
		.catch(e => {
			formatDbError(res, e);
		});
};

module.exports = router => {
	router.get('/dashboard/summary', summary);
	router.get('/dashboard/summaryByMonth', summaryByMonth);
};
