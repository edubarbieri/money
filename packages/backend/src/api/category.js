const { Category, Catalog, formatDbError, paginatedQuery} = require('../sequelize');
const {convertToDate} = require('../util/date');
const {queryTagsDebt} = require('../services/tags');

const findAll = (req, res) => {
	Category.findAll({ order: [['createdAt', 'DESC']], hierarchy: true })
		.then(items => {
			res.json(items || []);
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


module.exports = router => {
	router.get('/category', findAll);
	router.get('/category/:id', findOne);
	router.put('/category/:id', update);
	router.post('/category', create);
	router.post('/category/:id/parent', updateParent);
	// router.put('/category/:id', update);
	// router.delete('/category/:id', remove);
};
