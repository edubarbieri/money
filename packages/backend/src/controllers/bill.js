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
route.get('/bill/billAmountMonthResume', (req, res) => {
	billService.billAmountMonthResume(req.walletId)
		.then(r => res.json(r));
});

route.get('/bill/overdueBills', (req, res) => {
	billService.overdueBills(req.walletId)
		.then(r => res.json(r));
});

route.get('/bill/totalMonth', (req, res) => {
	const {year, month} = req.query;
	if(!year || !month){
		return res.status(400).send({ errors: ['bill.totalMonth.invalidParams'] });
	}
	billService.totalMonth(req.walletId, parseInt(month), parseInt(year))
		.then(r => {
			const response = r;
			if(response.length){
				res.json(response[0])
				return;
			}
			res.json({})
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
	billService.createBill({
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
		const affectedRows = await billService.updateBill(data, req.params.id, req.walletId)
		if (affectedRows === 0) {
			return res.status(400).send({ errors: ['bill.update.noUpdateItem'] });
		}
		res.json(await billService.getBill(req.params.id, req.walletId));
	} catch (e) {
		console.log('Update bill error', e);
		formatDbError(res, e);
	}
}

route.put('/bill/:id', async (req, res) => {
	const bill = { ...req.body, walletId: req.walletId };
	return _update(req, res, bill);
});

route.delete('/bill/:id', async (req, res) => {
	try {
		const affectedRows = await Bill.destroy({
			where: { id: req.params.id, walletId: req.walletId }
		});
		if (affectedRows[0] === 0) {
			return res.status(400).send({ errors: ['bill.delete.noDeletedItem'] });
		}
		res.status(203).json();
	} catch (e) {
		console.log('Delete bill error', e);
		formatDbError(res, e);
	}
});

route.put('/bill/:id/setAsPayd', (req, res) => {
	const bill = _.pick(req.body, ['amountPaid', 'paymentDate']);
	if (!bill.amountPaid || !bill.paymentDate) {
		return res.status(400).send({ errors: ['bill.setAsPayd.invalidParams'] });
	}
	billService
		.setBillAsPayd(bill.amountPaid, bill.paymentDate, req.params.id, req.walletId)
		.then(success => {
			if (success) {
				return res.sendStatus(200);
			}
			res.status(500).send({ errors: ['bill.setAsPayd.genericError'] });
		})
		.catch(error => {
			console.error('setAsPayd error', error);
			res.status(500).send({ errors: ['bill.setAsPayd.genericError'] });
		});
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
