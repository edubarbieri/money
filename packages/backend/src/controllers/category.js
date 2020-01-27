const { Category, formatDbError} = require('../db');
const categoryService = require('../services/categories')
const { Router } = require('express');
const walletMiddleware = require('../middleware/wallet')

const route = Router();
route.use('/category', walletMiddleware)
route.get('/category', (req, res) => {
	Category.findAll({
		attributes: ['id', 'name', 'keywords', 'parentId', 'walletId', 'parent_id'],
		where:{ wallet_id : req.walletId },
		order: [['createdAt', 'DESC']], 
		hierarchy: true })
		.then(items => {
			res.json(items || []);
		})
		.catch(e => {
			console.error('get all category error', e);
			formatDbError(res, e);
		});
});

route.get('/category/path', (req, res) => {
	categoryService.listWithPath(req.walletId)
		.then(resp => {
			res.json(resp || []);
		})
		.catch(e => {
			console.error('get category with path', e);
			formatDbError(res, e);
		});
});

route.get('/category/:id', (req, res) => {
	Category.findByPk(req.params.id)
		.then(cat =>{
			if(cat.walletId === req.walletId){
				res.json(cat)
			}else{
				res.sendStatus(404);
			}
		}) 
		.catch(e => {
			console.error('get category error', e);
			formatDbError(res, e)
		});
});

route.post('/category', (req, res) => {
	const category = req.body;
	Category.create({
		...category,
		walletId: req.walletId
	})
		.then(cat => res.json(cat))
		.catch(e => {
			console.error('create category error', e);
			formatDbError(res, e);
		});
});

route.post('/category/:id/parent', async (req, res) => {
	try {
		const affectedRows = await Category.update({
			parentId: req.body.parentId
		},{
			where: { id: req.params.id, walletId : req.walletId}
		});
		if (affectedRows[0] === 0) {
			return res.status(400).send({ errors: ['category.update.noUpdateItem'] });
		}
		res.json(await Category.findByPk(req.params.id));
	} catch (e) {
		console.error('Update parent error', e);
		formatDbError(res, e)
	}
});

route.delete('/category/:id', (req, res) => {
	Category.destroy({
		where: { id: req.params.id, walletId : req.walletId }
	}).then(deleteRows => {
		if (deleteRows > 0) {
			return res.status(200).send();
		}
		return res.status(400).send({ errors: ['category.delete.noDeletedItem'] });
	});
});

module.exports = route;
