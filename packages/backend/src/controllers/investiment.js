const { Investiment, formatDbError } = require('../db');
const {convertToDate} = require('../util/date');
const findAll = (req, res) => {
	Investiment.findAll({ order: [['createdAt', 'DESC']] })
		.then(items => {
			res.json(items || []);
		})
		.catch(e => {
			formatDbError(res, e);
		});
};

const findByMonth = (req, res) => {
	const { year, month } = req.params;
	Investiment.findAll({
		where: { year, month },
		order: [['entryDate', 'ASC']]
	})
		.then(items => {
			res.json(items || []);
		})
		.catch(e => {
			formatDbError(res, e);
		});
};

const findOne = (req, res) => {
	Investiment.findById(req.params.id)
		.then(investiment => res.json(investiment))
		.catch(e => formatDbError(res, e));
};

const create = (req, res) => {
	const investiment = req.body;

	let month, year;
	if (investiment.entryDate) {
		const date = convertToDate(investiment.entryDate);
		month = date.getMonth() + 1;
		year = date.getFullYear();
	} else if (investiment.month && investiment.year) {
		month = investiment.month;
		year = investiment.year;
	} else {
		return res.status(400).send({
			errors: ['Dados inválidos. Informe a data ou mês e ano.']
		});
	}
	Investiment.create({...investiment, month, year })
		.then(deb => {
			Investiment.findById(deb.get('id')).then(d => {
				res.json(d);
			});
		})
		.catch(e => formatDbError(res, e));
};

const update = (req, res) => {
	const investiment = req.body;
	if (investiment.entryDate) {
		const date = convertToDate(investiment.entryDate);
		investiment.month = date.getMonth() + 1;
		investiment.year = date.getFullYear();
	} else {
		delete investiment.month;
		delete investiment.year;
	}

	Investiment.update(investiment, {
		where: { id: req.params.id }
	})
		.then(affectedRows => {
			if (affectedRows[0] === 0) {
				return res
					.status(400)
					.send({ errors: 'Nenhum registro atualizado.' });
			}
			return findOne(req, res);
		})
		.catch(e => formatDbError(res, e));
};

const remove = (req, res) => {
	Investiment.destroy({
		where: { id: req.params.id }
	}).then(deleteRows => {
		if (deleteRows > 0) {
			return res.status(200).send();
		}
		return res.status(400).send({ errors: 'Nenhum deletado.' });
	});
};

module.exports = router => {
	router.get('/investiment', findAll);
	router.get('/investiment/:id', findOne);
	router.get('/investiment/:year/:month', findByMonth);
	router.post('/investiment', create);
	router.put('/investiment/:id', update);
	router.delete('/investiment/:id', remove);
};
