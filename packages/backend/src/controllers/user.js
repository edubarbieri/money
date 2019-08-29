const { formatDbError, User } = require('../db');
const { Router } = require('express');

const route = Router();
route.post('/user/findByEmail', (req, res) => {
	User.findOne({
		attributes: ['id', 'email', 'name'],
		where: { email: req.body.email }
	})
		.then(item => {
			if (!item) {
				return res.json({});
			}
			res.json(item);
		})
		.catch(e => {
			formatDbError(res, e);
		});
});

module.exports = route;
