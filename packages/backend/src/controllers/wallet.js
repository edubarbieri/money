const { Router } = require('express');
const { sequelize, Wallet, User } = require('../db')
const {isWalletOwner, listUserWallets} = require('../services/wallets');

const route = Router();

route.post('/wallet', async (req, resp) => {
    const user = await User.findByPk(req.userId, { attributes: ['id'] });
    sequelize.transaction(t => {
        return Wallet.create({
            name: req.body.name,
            description: req.body.description
        }, {transaction: t}).then((wallet) => {
            return wallet.addUser(user, { through: { isOwner: true }, transaction: t});
        })
    })
    .then(() => resp.status(201))
    .catch((e) => {
        resp.status(500).json({
            erros: [e]
        })
    })
});

route.put('/wallet/:walletId', async (req, resp) => {
    User.update({
        name: req.body.name,
        description: req.body.description
    }, { where: {id: parsetInt(req.params.walletId)} })
    .then(() => resp.status(200))
    .catch((e) => {
        resp.status(500).json({
            erros: ['wallet.update.genericError']
        })
    })
});

route.get('/wallet', (req, resp) => {
    listUserWallets(req.userId, req.query.withUser).then(wallates => {
        resp.json(wallates)
    }).catch(error => {
        console.error(error);
        resp.status(500).json({erros: ['wallet.error.generic']})
    })
});

route.post('/wallet/:walletId/addUser', async (req, resp) => {
    const { walletId } = req.params;
    if(!walletId){
        return resp.status(400).json({
            errors: ['wallet.addUser.noWalletIdProvided']
        })
    }
    
    const isOwner = await isWalletOwner(parseInt(walletId), req.userId);
    if(isOwner){
        return resp.status(403).json({
            errors: ['wallet.addUser.noPermissionToAddUser']
        }) 
    }
    const { userId, owner } = req.body;
    const wallet = await Wallet.findByPk(walletId, {attributes: ['id']});
    const userToAdd = await User.findByPk(userId, {attributes: ['id']});
    await wallet.addUser(userToAdd, { through: { isOwner: owner }});

    resp.send(200);
});



module.exports = route;