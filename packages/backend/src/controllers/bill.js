const { Bill, User, Category, formatDbError } = require('../db');
const { Router } = require('express');
const walletMiddleware = require('../middleware/wallet');
const billService = require('../services/bill')
const _ = require('lodash');

const route = Router();
route.use('/bill', walletMiddleware);

const billAttributes = [
	'id',
	'description',
	'dueDate',
	'paymentDate',
	'amount',
	'amountPaid',
	'recurrent',
	'recurrentTotal',
	'recurrentCount',
	'isPayd'
];
route.get('/bill', (req, res) => {
	const options = {..._.pick(req.query, ['withCategory', 'withUser', 'isPayd', 'order', 'month', 'year']),
		walletId: req.walletId
	}

	billService.findAll(options)
		.then(items => {
			res.json(items || []);
		})
		.catch(e => {
			console.error('get all bills error', e);
			formatDbError(res, e);
		});
});

route.post('/bill', (req, res) => {
	const bill = req.body;
	Bill.create({
		...bill,
		walletId: req.walletId,
		userId: req.body.userId || req.userId
	})
		.then(bill => res.json(bill))
		.catch(e => {
			console.error('create bill error', e);
			formatDbError(res, e);
		});
});

route.put('/bill/:id', async (req, res) => {
	try {
		const bill = { ...req.body, walletId: req.walletId };
		const affectedRows = await Bill.update(bill, {
			where: { id: req.params.id, walletId: req.walletId }
		});
		if (affectedRows[0] === 0) {
			return res.status(400).send({ errors: ['bill.update.noUpdateItem'] });
		}
		res.json(
			await Bill.findByPk(req.params.id, { attributes: billAttributes })
		);
	} catch (e) {
		console.log('Update bill error', e);
		formatDbError(res, e);
	}
});

route.put('/bill/:id/setAsPayd', async (req, res) => {
	try {
		const bill = _.pick(req.body, ['amountPaid', 'paymentDate']);
		if(!bill.amountPaid || !bill.paymentDate){
			return res.status(400).send({ errors: ['bill.setAsPayd.invalidParams'] });
		}
		const affectedRows = await Bill.update(bill, {
			where: { id: req.params.id, walletId: req.walletId }
		});
		if (affectedRows[0] === 0) {
			return res.status(400).send({ errors: ['bill.setAsPayd.noUpdateItem'] });
		}
		res.sendStatus(200);
	} catch (e) {
		console.log('Update setAsPayd error', e);
		formatDbError(res, e);
	}
});

route.put('/bill/:id/setCategory', async (req, res) => {
	try {
		const bill = _.pick(req.body, ['categoryId']);
		if(!bill.categoryId){
			return res.status(400).send({ errors: ['bill.setCategory.invalidParams'] });
		}
		const affectedRows = await Bill.update(bill, {
			where: { id: req.params.id, walletId: req.walletId }
		});
		if (affectedRows[0] === 0) {
			return res.status(400).send({ errors: ['bill.setCategory.noUpdateItem'] });
		}
		res.sendStatus(200);
	} catch (e) {
		console.log('Update setCategory error', e);
		formatDbError(res, e);
	}
});

module.exports = route;
