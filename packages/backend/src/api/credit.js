const { Credit, formatDbError, paginatedQuery} = require('../db');
const {queryTagsCredits} = require('../services/tags');

const findAll = (req, res) => {
	Credit.findAll({ order: [['createdAt', 'DESC']] })
		.then(items => {
			res.json(items || []);
		})
		.catch(e => {
			formatDbError(res, e);
		});
};

const findByMonth = (req, res) => {
	const { year, month } = req.params;
	Credit.findAll({
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

	paginatedQuery(Credit, {
		where: queryParams,
		order: [['entryDate', 'ASC']]
	}, page, itemsPerPage)
		.then(items => {
			items.tag = (req.query.tag || '');
			queryTagsCredits(month, year).then(tags => {
				items.tags = tags.map(i => i.tag);
				res.json(items);
			});
		})
		.catch(e => {
			formatDbError(res, e);
		});
};

const findOne = (req, res) => {
	Credit.findById(req.params.id)
		.then(credit => res.json(credit))
		.catch(e => formatDbError(res, e));
};

const create = (req, res) => {
	const credit = req.body;

	let month, year;
	if (credit.entryDate) {
		credit.entryDate = credit.entryDate + 'T00:00:00.00';
		const date = new Date(credit.entryDate);
		month = date.getMonth() + 1;
		year = date.getFullYear();
	} else if (credit.month && credit.year) {
		month = credit.month;
		year = credit.year;
	} else {
		return res.status(400).send({
			errors: ['Dados inválidos. Informe a data ou mês e ano.']
		});
	}
	Credit.create({ ...credit, month, year })
		.then(deb => {
			Credit.findById(deb.get('id')).then(d => {
				res.json(d);
			});
		})
		.catch(e => formatDbError(res, e));
};

const update = (req, res) => {
	const credit = req.body;
	if (credit.entryDate) {
		credit.entryDate = credit.entryDate + 'T00:00:00.00';
		const date = new Date(credit.entryDate);
		credit.month = date.getMonth() + 1;
		credit.year = date.getFullYear();
	} else {
		delete credit.month;
		delete credit.year;
	}

	Credit.update(credit, {
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
	Credit.destroy({
		where: { id: req.params.id }
	}).then(deleteRows => {
		if (deleteRows > 0) {
			return res.status(200).send();
		}
		return res.status(400).send({ errors: 'Nenhum deletado.' });
	});
};

module.exports = router => {
	router.get('/credit', findAll);
	router.get('/credit/:id', findOne);
	router.get('/credit/:year/:month', paginetedByMonth);
	router.post('/credit', create);
	router.put('/credit/:id', update);
	router.delete('/credit/:id', remove);
};
