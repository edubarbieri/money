const { Bill, formatDbError} = require('../db');
const { Router } = require('express');
const walletMiddleware = require('../middleware/wallet');
const billService = require('../services/bill')
const _ = require('lodash');

const route = Router();
route.use('/bill', walletMiddleware);

route.get('/bill', (req, res) => {
	const options = {..._.pick(req.query, ['withCategory', 'withUser', 'isPayd', 'order', 'month', 'year', 'pageSize', 'page']),
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

route.get('/bill/:id', (req, res) => {
	Bill.findOne({
		attributes: billService.BILL_ATTRIBUTES,
		where: {
			id: req.params.id,
			walletId: req.walletId
		}
	})
		.then(bill => (bill) ? res.json(bill) : res.sendStatus(404))
		.catch(e => formatDbError(res, e));
});

route.post('/bill', (req, res) => {
	const bill = req.body;
	Bill.create({
		...bill,
		walletId: req.walletId,
		userId: req.body.userId || req.userId
	})
		.then(bill => res.json(_.pick(bill, billService.BILL_ATTRIBUTES)))
		.catch(e => {
			console.error('create bill error', e);
			formatDbError(res, e);
		});
});

async function _update(req, res, data) {
	try {
		const affectedRows = await Bill.update(data, {
			where: { id: req.params.id, walletId: req.walletId }
		});
		if (affectedRows[0] === 0) {
			return res.status(400).send({ errors: ['bill.update.noUpdateItem'] });
		}
		res.json(
			await Bill.findByPk(req.params.id, { attributes: billService.BILL_ATTRIBUTES })
		);
	} catch (e) {
		console.log('Update bill error', e);
		formatDbError(res, e);
	}
}

route.put('/bill/:id', async (req, res) => {
	const bill = { ...req.body, walletId: req.walletId };
	return _update(req, res, bill);
});

route.put('/bill/:id/setAsPayd', async (req, res) => {
	const bill = _.pick(req.body, ['amountPaid', 'paymentDate']);
	if (!bill.amountPaid || !bill.paymentDate) {
		return res.status(400).send({ errors: ['bill.setAsPayd.invalidParams'] });
	}
	return _update(req, res, bill);
});

route.put('/bill/:id/setCategory', async (req, res) => {
	const bill = _.pick(req.body, ['categoryId']);
	if(!bill.categoryId){
		return res.status(400).send({ errors: ['bill.setCategory.invalidParams'] });
	}
	return _update(req, res, bill);
});

route.post('/bill/generateMonthRecurrentBills', (req, res) => {
	const {year, month} = req.body;
	if(!year || !month){
		return res.status(400).send({ errors: ['bill.generateMonthRecurrentBills.invalidParams'] });
	}
	billService.generateMonthRecurrentBills(req.walletId, parseInt(month), parseInt(year))
		.then(r => res.json(r));
});

module.exports = route;
