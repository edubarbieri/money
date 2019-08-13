const { Router } = require('express');
const { sequelize, Wallet, User, UserWallet} = require('../db')
const {isWalletOwner, listUserWallets} = require('../services/wallets');

const route = Router();

route.get('/wallet', (req, resp) => {
    listUserWallets(req.userId, req.query.withUser).then(wallates => {
        resp.json(wallates)
    }).catch(error => {
        console.error(error);
        resp.status(500).json({erros: ['wallet.error.generic']})
    })
});

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
        const {name, description} = req.body;
        const rowsUpdated = await Wallet.update({name, description}, 
            { where: {id: parseInt(req.params.walletId)} });
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
route.delete('/wallet/:walletId', async (req, resp) => {
    try {
        const { walletId } = req.params;
        const isOwner = await isWalletOwner(parseInt(walletId), req.userId);
        if(!isOwner){
            return resp.status(403).json({
                errors: ['wallet.delete.noPermissionToDelete']
            }) 
        }
        const rowsDeletes = await Wallet.destroy({ where: {id: parseInt(req.params.walletId)} });
        if(rowsDeletes > 0){
            return resp.sendStatus(200);
        }
        resp.status(400).json({erros: ['wallet.delete.noRowsDeleteds']})
    } catch (error) {
        console.error("Error deleting wallet", error);
        resp.status(500).json({
            erros: ['wallet.delete.genericError']
        })
    }
});

route.post('/wallet/:walletId/addUser', async (req, resp) => {
    try {
        const { walletId } = req.params;
        if(!walletId){
            return resp.status(400).json({
                errors: ['wallet.addUser.noWalletIdProvided']
            })
        }
        const currentUserIsOwner = await isWalletOwner(parseInt(walletId), req.userId);
        if(!currentUserIsOwner){
            return resp.status(403).json({
                errors: ['wallet.addUser.noPermissionToAddUser']
            }) 
        }
        const { userId, isOwner } = req.body;
        const wallet = await Wallet.findByPk(walletId, {attributes: ['id']});
        const userToAdd = await User.findByPk(userId, {attributes: ['id']});
        await wallet.addUser(userToAdd, { through: { isOwner: isOwner }});
        resp.sendStatus(200);
    } catch (error) {
        console.error("Error adding user to wallet", error);
        resp.status(500).json({
            erros: ['wallet.addUser.genericError']
        })
    }
});

route.post('/wallet/:walletId/removeUser', async (req, resp) => {
    try {
        const { walletId } = req.params;
        if(!walletId){
            return resp.status(400).json({
                errors: ['wallet.removeUser.noWalletIdProvided']
            })
        }
        const isOwner = await isWalletOwner(parseInt(walletId), req.userId);
        if(!isOwner){
            return resp.status(403).json({
                errors: ['wallet.removeUser.noPermissionToAddUser']
            }) 
        }
        const { userId } = req.body;
        const wallet = await Wallet.findByPk(walletId, {attributes: ['id']});
        const userToAdd = await User.findByPk(userId, {attributes: ['id']});
        await wallet.removeUser(userToAdd);
        resp.sendStatus(200);
    } catch (error) {
        console.error("Error removing user from wallet", error);
        resp.status(500).json({
            erros: ['wallet.removeUser.genericError']
        })
    }
});

route.post('/wallet/:walletId/setOwner', async (req, resp) => {
    try {
        const { walletId } = req.params;
        if(!walletId){
            return resp.status(400).json({
                errors: ['wallet.setOwner.noWalletIdProvided']
            })
        }
        const userIsOwner = await isWalletOwner(parseInt(walletId), req.userId);
        if(!userIsOwner){
            return resp.status(403).json({
                errors: ['wallet.setOwner.noPermissionToAddUser']
            }) 
        }
        const { userId, isOwner } = req.body;
        await UserWallet.findAll();

        const rowsUpdated = await UserWallet.update({isOwner}, {where: {walltId: walletId, userId: userId}});

        if(rowsUpdated[0] > 0){
            return resp.sendStatus(200);
        }
        resp.status(400).json({erros: ['wallet.setOwner.noRowsUpdateds']})
    } catch (error) {
        console.error("Error adding user to wallet", error);
        resp.status(500).json({
            erros: ['wallet.setOwner.genericError']
        })
    }
});






module.exports = route;