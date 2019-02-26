const { CreditCard, formatDbError } = require('../sequelize');
const {convertToDate} = require('../util/date');
const findAll = (req, res) => {
	CreditCard.findAll({ order: [['createdAt', 'DESC']] })
		.then(items => {
			res.json(items || []);
		})
		.catch(e => {
			formatDbError(res, e);
		});
};

const findByMonth = (req, res) => {
	const { year, month } = req.params;
	CreditCard.findAll({
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
	CreditCard.findById(req.params.id)
		.then(creditCard => res.json(creditCard))
		.catch(e => formatDbError(res, e));
};

const create = (req, res) => {
	const creditCard = req.body;

	let month, year;
	if (creditCard.entryDate) {
		const date = convertToDate(creditCard.entryDate);
		month = date.getMonth() + 1;
		year = date.getFullYear();
	} else if (creditCard.month && creditCard.year) {
		month = creditCard.month;
		year = creditCard.year;
	} else {
		return res.status(400).send({
			errors: ['Dados inválidos. Informe a data ou mês e ano.']
		});
	}
	CreditCard.create({ ...creditCard, month, year })
		.then(deb => {
			CreditCard.findById(deb.get('id')).then(d => {
				res.json(d);
			});
		})
		.catch(e => formatDbError(res, e));
};

const update = (req, res) => {
	const creditCard = req.body;
	if (creditCard.entryDate) {
		const date = convertToDate(creditCard.entryDate);
		creditCard.month = date.getMonth() + 1;
		creditCard.year = date.getFullYear();
	} else {
		delete creditCard.month;
		delete creditCard.year;
	}

	CreditCard.update(creditCard, {
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
	CreditCard.destroy({
		where: { id: req.params.id }
	}).then(deleteRows => {
		if (deleteRows > 0) {
			return res.status(200).send();
		}
		return res.status(400).send({ errors: 'Nenhum deletado.' });
	});
};

module.exports = router => {
	router.get('/creditCard', findAll);
	router.get('/creditCard/:id', findOne);
	router.get('/creditCard/:year/:month', findByMonth);
	router.post('/creditCard', create);
	router.put('/creditCard/:id', update);
	router.delete('/creditCard/:id', remove);
};
