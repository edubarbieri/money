const { Router } = require('express');
const walletMiddleware = require('../middleware/wallet');
const { Plan, PlanItem, formatDbError } = require('../db');
const route = Router();
route.use('/plan', walletMiddleware);

route.get('/plan', async (req, res) => {
	try {
		const items = await Plan.findAll({
			where: { wallet_id: req.walletId },
			order: [['createdAt', 'DESC']]
		});
		const resp = []
		for (const item of items) {
			const planItems = await PlanItem.findAll({
				where: {planId: item.id},
				order: [['itemDate', 'ASC'], ['type', 'DESC']]
			});
			resp.push({
				...item.dataValues, 
				planItems: planItems
			});
		}
		res.json(resp);
	} catch (error) {
		console.error(error);
		res.status(500).send({ errors: ['plan.get'] });
	}
	
});

route.post('/plan', (req, res) => {
	const plan = req.body;
	Plan.create({
		...plan,
		walletId: req.walletId,
		userId: req.body.userId || req.userId
	})
		.then(cat => res.json(cat))
		.catch(e => {
			console.error('create plan error', e);
			formatDbError(res, e);
		});
});

route.put('/plan/:id', async (req, res) => {
	try {
		const plan = {
			...req.body,
			walletId: req.walletId,
			userId: req.body.userId || req.userId
		};
		const affectedRows = await Plan.update(plan, {
			where: { id: req.params.id, walletId: req.walletId }
		});
		if (affectedRows[0] === 0) {
			return res.status(400).send({ errors: ['plan.update.noUpdateItem'] });
		}
		res.json(await Plan.findByPk(req.params.id));
	} catch (e) {
		console.log('Update plan error', e);
		formatDbError(res, e);
	}
});

route.delete('/plan/:id', async (req, res) => {
	try {
		const plan = await Plan.findByPk(req.params.id, {
			include: {
				model: PlanItem,
				as: 'planItems'
			},
		});
		if (plan.walletId !== req.walletId) {
			return res
				.status(400)
				.send({ errors: ['plan.delete.invalidWallet'] });
		}
		for (const item of plan.planItems) {
			await PlanItem.destroy({where: { id: item.id}});
		}
		Plan.destroy({
			where: { id: req.params.id, walletId: req.walletId }
		}).then(deleteRows => {
			if (deleteRows > 0) {
				return res.status(200).send();
			}
			return res.status(400).send({ errors: ['plan.delete.noDeletedItem'] });
		});
	} catch (error) {
		console.error(error);
	}
});

route.post('/plan/:id/item', async (req, res) => {
	const planItem = {
		...req.body,
		planId: req.params.id
	};

	if (!planItem.itemDate) {
		planItem.itemDate = new Date();
	}
	PlanItem.create(planItem)
		.then(item => res.json(item))
		.catch(e => {
			console.error('create plan item error', e);
			formatDbError(res, e);
		});
});

route.delete('/plan-item/:id', async (req, res) => {
	PlanItem.findByPk(req.params.id, {
		include: {
			model: Plan,
			attributes: ['id', 'wallet_id']
		}
	}).then(item => {
		if (item.plan.wallet_id !== req.walletId) {
			return res
				.status(400)
				.send({ errors: ['planItem.delete.invalidWallet'] });
		}
		PlanItem.destroy({
			where: { id: item.id }
		})
			.then(deleteRows => {
				if (deleteRows > 0) {
					return res.status(200).send();
				}
				return res
					.status(400)
					.send({ errors: ['planItem.delete.noDeletedItem'] });
			})
			.catch(e => {
				console.error('delete plan error', e);
				formatDbError(res, e);
			});
	});
});

module.exports = route;
