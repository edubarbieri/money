
const { formatDbError } = require('../db');
const { Router } = require('express');
const walletMiddleware = require('../middleware/wallet');
const entryService = require('../services/entry')
const _ = require('lodash');

const route = Router();
route.use('/debit', walletMiddleware);

route.get('/debit', (req, res) => {
	const options = {..._.pick(req.query, ['withCategory', 'withUser', 'order', 'month', 'year', 'pageSize', 'page']),
		walletId: req.walletId
	}
	entryService.findAllDebits(options)
		.then(items => {
			res.json(items || []);
		})
		.catch(e => {
			console.error('get debit error', e);
			formatDbError(res, e);
		});
});
route.get('/debit/amountMonthResume', (req, res) => {
	entryService.debitAmountMonthResume(req.walletId)
		.then(r => res.json(r));
});

route.get('/debit/totalMonth', (req, res) => {
	const {year, month} = req.query;
	if(!year || !month){
		return res.status(400).send({ errors: ['debit.totalMonth.invalidParams'] });
	}
	entryService.getDebitTotal(req.walletId, parseInt(month), parseInt(year))
		.then(r => {
			const response = r;
			if(response.length){
				res.json(response[0])
				return;
			}
			res.json({})
		});
});

route.get('/debit/:id', (req, res) => {
	entryService.getDebit(req.params.id, req.walletId)
		.then(bill => (bill) ? res.json(bill) : res.sendStatus(404))
		.catch(e => formatDbError(res, e));
});

route.post('/debit', (req, res) => {
	const data = req.body;
	entryService.createDebit({...data, userId: req.body.userId || req.userId}, req.walletId)
		.then(entry => res.json(entry))
		.catch(e => {
			console.error('create debit error', e);
			formatDbError(res, e);
		});
});



route.put('/debit/:id', async (req, res) => {
	try {
		const data = req.body;
		const affectedRows = await entryService.updateDebit(data, req.params.id, req.walletId)
		if (affectedRows === 0) {
			return res.status(400).send({ errors: ['debit.update.noUpdateItem'] });
		}
		res.json(
			await entryService.getDebit(req.params.id, req.walletId)
		);
	} catch (e) {
		console.log('Update debit error', e);
		formatDbError(res, e);
	}
});

route.delete('/debit/:id', async (req, res) => {
	try {
		const affectedRows = await entryService.deleteDebit(req.params.id, req.walletId)
		if (!affectedRows || affectedRows === 0) {
			return res.status(400).send({ errors: ['debit.delete.noDeletedItem'] });
		}
		res.sendStatus(200)
	} catch (e) {
		console.log('delete debit error', e);
		formatDbError(res, e);
	}
});

route.put('/debit/:id/setCategory', async (req, res) => {
	try {
		const data = _.pick(req.body, ['categoryId']);
		if (!data.categoryId) {
			return res.status(400).send({ errors: ['debit.setCategory.invalidParams'] });
		}
		const affectedRows = await entryService.updateDebit(data, req.params.id, req.walletId);
		if (affectedRows === 0) {
			return res.status(400).send({ errors: ['debit.setCategory.noUpdateItem'] });
		}
		res.json(
			await entryService.getDebit(req.params.id, req.walletId)
		);
	} catch (e) {
		console.log('Update setCategory error', e);
		formatDbError(res, e);
	}
});

module.exports = route;
