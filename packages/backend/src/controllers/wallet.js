const { Router } = require('express');
const { sequelize, Wallet, User } = require('../db')
const {isWalletOwner} = require('../services/wallets');

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

route.get('/wallet', async (req, resp) => {
    const query = `
        select  w."id" as "id", w."name" as "name", wu."isOwner" as "isOwner"
        from  wallets w, user_wallets wu
        where 1 = 1  and w."id" = wu."walletId" and  wu."userId" = :userId`;
    const wallates = await sequelize.query(query, { replacements: { userId: req.userId }, type: sequelize.QueryTypes.SELECT});

    const queryUser = `select  
            wu."userId" as "id",
            wu."isOwner" as "isOwner",
            u.name as "name"
            
        from  
        wallets w, user_wallets wu, users u
        where 1 = 1  
        and w."id" = wu."walletId"
        and wu."userId" = u."id"
        and w.id = :walletId`;

    for (const wallet of wallates) {
        wallet.users = await sequelize.query(queryUser, { replacements: { walletId: wallet.id }, type: sequelize.QueryTypes.SELECT});
    }
    resp.json(wallates)
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