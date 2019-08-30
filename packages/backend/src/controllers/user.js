const { formatDbError, User } = require('../db');
const { Router } = require('express');

const route = Router();
route.post('/user/findByEmail', (req, res) => {
    User.findOne({
		attributes: ['id', 'email', 'name', 'avatar'],
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

route.put('/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findOne({
            attributes: ['id'],
            where: { id : userId}
        });
        
        if(!user){
            return res.status(404).json({
                errors: ['user.update.genericError']
            });
        }
        const updateObject = {
            name: req.body.name
        };
        if(req.body.avatar){
            updateObject.avatar = req.body.avatar;
        }
        const rowsUpdated = await User.update(updateObject, { where: {id: parseInt(user.id)} });
        if(rowsUpdated[0] > 0){
            return res.send(await User.findByPk(user.id, {attributes: ['id', 'email', 'name', 'avatar']}));
        }
        res.status(400).json({erros: ['user.update.noRowsUpdateds']});

    } catch (error) {
        console.error("Error updating wallet", error);
        res.status(500).json({
            errors: ['user.update.genericError']
        })
    }
});

module.exports = route;
