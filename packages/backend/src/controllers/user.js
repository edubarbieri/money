const { formatDbError, User } = require('../db');
const { Router } = require('express');
const _ = require('lodash');

const route = Router();
route.post('/user/findByEmail', (req, res) => {
    User.findOne({
		where: { email : req.body.email}
	})
    .then(item => {
        if(!item){
            return res.json({});
        }
        res.json(_.pick(item, ['id', 'email', 'name']));
    })
    .catch(e => {
        formatDbError(res, e);
    });
});

module.exports = route;