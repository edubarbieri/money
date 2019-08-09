const { Category, formatDbError} = require('../db');
const categoryService = require('../services/categories')
const { Router } = require('express');

const route = Router();

route.get('/category', (req, res) => {
	Category.findAll({ order: [['createdAt', 'DESC']], hierarchy: true })
		.then(items => {
			res.json(items || []);
		})
		.catch(e => {
			formatDbError(res, e);
		});
});

route.get('/category/path', async (req, res) => {
	categoryService.listWithPath()
		.then(resp => {
			res.json(resp || []);
		})
		.catch(e => {
			formatDbError(res, e);
		});
});

route.get('/category/:id', (req, res) => {
	Category.findByPk(req.params.id)
		.then(debt => res.json(debt))
		.catch(e => formatDbError(res, e));
});

route.post('/category', (req, res) => {
	const category = req.body;
	Category.create(category)
		.then(cat => {
			res.json(cat);
		})
		.catch(e => formatDbError(res, e));
});

route.post('/category/:id/parent', (req, res) => {
	Category.update({
		parentId: req.body.parentId
	},{
		where: { id: req.params.id }
	}).then(affectedRows => {
		if (affectedRows[0] === 0) {
			return res
				.status(400)
				.send({ errors: 'Nenhum registro atualizado.' });
		}
		return findOne(req, res);
	})
	.catch(e => formatDbError(res, e));
});


route.put('/category/:id', (req, res) => {
	const category = req.body;

	Category.update(category, {
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


route.delete('/category/:id', (req, res) => {
	//TODO validar se não possui despesas/receitas associadas
	Category.destroy({
		where: { id: req.params.id }
	}).then(deleteRows => {
		if (deleteRows > 0) {
			return res.status(200).send();
		}
		return res.status(400).send({ errors: 'Nenhum deletado.' });
	});
});

module.exports = route;
