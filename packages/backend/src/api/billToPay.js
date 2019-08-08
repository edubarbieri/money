
const {BillToPay, formatDbError } = require('../sequelize');
const findAll = (req, res) => {
	BillToPay.findAll({ order: [['createdAt', 'DESC']], hierarchy: true })
		.then(items => {
			res.json(items || []);
		})
		.catch(e => {
			formatDbError(res, e);
		});
};

const findOne = (req, res) => {
	BillToPay.findById(req.params.id)
		.then(debt => res.json(debt))
		.catch(e => formatDbError(res, e));
};

const create = (req, res) => {
	const billToPay = req.body;
	BillToPay.create(billToPay)
		.then(b => {
			res.json(b);
		})
		.catch(e => formatDbError(res, e));
};

const update = (req, res) => {
	const billToPay = req.body;

	BillToPay.update(billToPay, {
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
  router.get('/billtopay', findAll);
	router.get('/billtopay/:id', findOne);
	router.put('/billtopay/:id', update);
	router.post('/billtopay', create);
	router.delete('/billtopay/:id', remove);
};
