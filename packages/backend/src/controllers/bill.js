
const {Bill, formatDbError } = require('../db');

const { Router } = require('express');

const route = Router();

route.get('/bill', (req, res) => {
	Bill.findAll({ order: [['createdAt', 'DESC']], hierarchy: true })
		.then(items => {
			res.json(items || []);
		})
		.catch(e => {
			formatDbError(res, e);
		});
});

route.get('/bill/:id', (req, res) => {
	Bill.findByPk(req.params.id)
		.then(debt => res.json(debt))
		.catch(e => formatDbError(res, e));
});

route.post('/bill', (req, res) => {
	const bill = req.body;
	Bill.create(bill)
		.then(b => {
			res.json(b);
		})
		.catch(e => formatDbError(res, e));
});

route.put('/bill/:id', (req, res) => {
	const Bill = req.body;

	Bill.update(Bill, {
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
});

module.exports = route;