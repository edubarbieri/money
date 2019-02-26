const { Debt, formatDbError, paginatedQuery} = require('../sequelize');
const {convertToDate} = require('../util/date');
const {queryTagsDebt} = require('../services/tags');

const findAll = (req, res) => {
	Debt.findAll({ order: [['createdAt', 'DESC']] })
		.then(items => {
			res.json(items || []);
		})
		.catch(e => {
			formatDbError(res, e);
		});
};

const findByMonth = (req, res) => {
	const { year, month } = req.params;
	Debt.findAll({
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

const paginetedByMonth = (req, res) => {
	const { year, month } = req.params;
	const page = req.query.page || 1;
	const itemsPerPage = req.query.itemsPerPage;

	const queryParams = { year, month};
	if(req.query.tag){
		queryParams.tag = req.query.tag;
	}
	paginatedQuery(Debt, {
		where: queryParams,
		order: [['entryDate', 'ASC']]
	}, page, itemsPerPage)
		.then(items => {
			items.tag = (req.query.tag || '');
			queryTagsDebt(month, year).then(tags =>{
				items.tags = tags.map(i => i.tag);
				res.json(items);
			});
		})
		.catch(e => {
			formatDbError(res, e);
		});
};

const findOne = (req, res) => {
	Debt.findById(req.params.id)
		.then(debt => res.json(debt))
		.catch(e => formatDbError(res, e));
};

const create = (req, res) => {
	const debt = req.body;

	let month, year;
	if (debt.entryDate) {
		debt.entryDate = debt.entryDate + 'T00:00:00.00';
		const date = new Date(debt.entryDate);
		month = date.getMonth() + 1;
		year = date.getFullYear();
	} else if (debt.month && debt.year) {
		month = debt.month;
		year = debt.year;
	} else {
		return res.status(400).send({
			errors: ['Dados inválidos. Informe a data ou mês e ano.']
		});
	}
	Debt.create({ ...debt, month, year })
		.then(deb => {
			Debt.findById(deb.get('id')).then(d => {
				res.json(d);
			});
		})
		.catch(e => formatDbError(res, e));
};

const update = (req, res) => {
	const debt = req.body;
	if (debt.entryDate) {
		debt.entryDate = debt.entryDate + 'T00:00:00.00';
		const date = new Date(debt.entryDate);
		debt.month = date.getMonth() + 1;
		debt.year = date.getFullYear();
	} else {
		delete debt.month;
		delete debt.year;
	}

	Debt.update(debt, {
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

const updateStatus = (req, res) => {
	const { status } = req.body;

	Debt.update({ status }, {
		where: { id: req.params.id },
		fields: ['status']
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
	Debt.destroy({
		where: { id: req.params.id }
	}).then(deleteRows => {
		if (deleteRows > 0) {
			return res.status(200).send();
		}
		return res.status(400).send({ errors: 'Nenhum deletado.' });
	});
};


module.exports = router => {
	router.get('/debt', findAll);
	router.get('/debt/:id', findOne);
	router.get('/debt/:year/:month', paginetedByMonth);
	router.post('/debt', create);
	router.put('/debt/:id', update);
	router.put('/debt/:id/status', updateStatus);
	router.delete('/debt/:id', remove);
};
