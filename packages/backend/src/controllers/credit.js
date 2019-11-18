const { formatDbError } = require('../db');
const { Router } = require('express');
const walletMiddleware = require('../middleware/wallet');
const entryService = require('../services/entry')
const _ = require('lodash');

const route = Router();
route.use('/credit', walletMiddleware);

route.get('/credit', (req, res) => {
	const options = {..._.pick(req.query, ['withCategory', 'withUser', 'order', 'month', 'year', 'pageSize', 'page']),
		walletId: req.walletId
	}
	entryService.findAllCredits(options)
		.then(items => {
			res.json(items || []);
		})
		.catch(e => {
			console.error('get credit error', e);
			formatDbError(res, e);
		});
});
route.get('/credit/amountMonthResume', (req, res) => {
	entryService.creditAmountMonthResume(req.walletId)
		.then(r => res.json(r));
});


route.get('/credit/totalMonth', (req, res) => {
	const {year, month} = req.query;
	if(!year || !month){
		return res.status(400).send({ errors: ['credit.totalMonth.invalidParams'] });
	}
	entryService.getCreditTotal(req.walletId, parseInt(month), parseInt(year))
		.then(r => {
			const response = r;
			if(response.length){
				res.json(response[0])
				return;
			}
			res.json({})
		});
});

route.get('/credit/:id', (req, res) => {
	entryService.getCredit(req.params.id, req.walletId)
		.then(bill => (bill) ? res.json(bill) : res.sendStatus(404))
		.catch(e => formatDbError(res, e));
});

route.post('/credit', (req, res) => {
	const data = req.body;
	entryService.createCredit({...data, userId: req.body.userId || req.userId}, req.walletId)
		.then(entry => res.json(entry))
		.catch(e => {
			console.error('create credit error', e);
			formatDbError(res, e);
		});
});


route.put('/credit/:id', async (req, res) => {
	try {
		const data = req.body;
		const affectedRows = await entryService.updateCredit(data, req.params.id, req.walletId)
		if (affectedRows === 0) {
			return res.status(400).send({ errors: ['credit.update.noUpdateItem'] });
		}
		res.json(
			await entryService.getCredit(req.params.id, req.walletId)
		);
	} catch (e) {
		console.log('Update credit error', e);
		formatDbError(res, e);
	}
});

route.delete('/credit/:id', async (req, res) => {
	try {
		const affectedRows = await entryService.deleteCredit(req.params.id, req.walletId)
		if (!affectedRows || affectedRows === 0) {
			return res.status(400).send({ errors: ['credit.delete.noDeletedItem'] });
		}
		res.sendStatus(200)
	} catch (e) {
		console.log('delete credit error', e);
		formatDbError(res, e);
	}
});

route.put('/credit/:id/setCategory', async (req, res) => {
	try {
		const data = _.pick(req.body, ['categoryId']);
		if (!data.categoryId) {
			return res.status(400).send({ errors: ['credit.setCategory.invalidParams'] });
		}
		const affectedRows = await entryService.updateCredit(data, req.params.id, req.walletId);
		if (affectedRows === 0) {
			return res.status(400).send({ errors: ['credit.setCategory.noUpdateItem'] });
		}
		res.json(
			await entryService.getCredit(req.params.id, req.walletId)
		);
	} catch (e) {
		console.log('Update setCategory error', e);
		formatDbError(res, e);
	}
});



module.exports = route;
