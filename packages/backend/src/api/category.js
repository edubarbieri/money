const { Category, formatDbError} = require('../sequelize');
const categoryService = require('../services/categories')

const findAll = (req, res) => {
	Category.findAll({ order: [['createdAt', 'DESC']], hierarchy: true })
		.then(items => {
			res.json(items || []);
		})
		.catch(e => {
			formatDbError(res, e);
		});
};

const findAllWithPathName = async (req, res) => {
	categoryService.listWithPath()
		.then(resp => {
			res.json(resp || []);
		})
		.catch(e => {
			formatDbError(res, e);
		});
};

const findOne = (req, res) => {
	Category.findById(req.params.id)
		.then(debt => res.json(debt))
		.catch(e => formatDbError(res, e));
};

const create = (req, res) => {
	const category = req.body;
	Category.create(category)
		.then(cat => {
			res.json(cat);
		})
		.catch(e => formatDbError(res, e));
};

const updateParent = (req, res) => {
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
};


const update = (req, res) => {
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
};


const remove = (req, res) => {
	//TODO validar se não possui despesas/receitas associadas
	Category.destroy({
		where: { id: req.params.id }
	}).then(deleteRows => {
		if (deleteRows > 0) {
			return res.status(200).send();
		}
		return res.status(400).send({ errors: 'Nenhum deletado.' });
	});
};

module.exports = router => {
	router.get('/category', findAll);
	router.get('/category/path', findAllWithPathName);
	router.get('/category/:id', findOne);
	router.put('/category/:id', update);
	router.post('/category', create);
	router.post('/category/:id/parent', updateParent);
	router.delete('/category/:id', remove);
};
