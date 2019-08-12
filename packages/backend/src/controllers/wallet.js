const { Router } = require('express');
const { sequelize, Wallet, User } = require('../db')
const {isWalletOwner, listUserWallets} = require('../services/wallets');

const route = Router();

route.post('/wallet', (req, resp) => {
    User.findByPk(req.userId, { attributes: ['id'] }).then(user => {
        sequelize.transaction(t => {
            return Wallet.create({
                name: req.body.name,
                description: req.body.description
            }, {transaction: t}).then((wallet) => {
                return wallet.addUser(user, { through: { isOwner: true }, transaction: t});
            })
        })
        .then(() => resp.sendStatus(201))
        .catch((e) => {
            resp.status(500).json({
                erros: [e]
            })
        })
    });
});

route.put('/wallet/:walletId', async (req, resp) => {
    try {
        const { walletId } = req.params;
        const isOwner = await isWalletOwner(parseInt(walletId), req.userId);
        if(!isOwner){
            return resp.status(403).json({
                errors: ['wallet.update.noPermissionToUpdate']
            }) 
        }
        const rowsUpdated = await Wallet.update({
            name: req.body.name,
            description: req.body.description
        }, { where: {id: parseInt(req.params.walletId)} });
        if(rowsUpdated[0] > 0){
            return resp.send(await Wallet.findByPk(walletId));
        }
        resp.status(400).json({erros: ['wallet.update.noRowsUpdateds']})
    } catch (error) {
        console.error("Error updating wallet", error);
        resp.status(500).json({
            erros: ['wallet.update.genericError']
        })
    }
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
    if(!isOwner){
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