const {sequelize, User} = require('../db');

async function isWalletOwner(walletId, userId){
    const query = `
        select  wu."isOwner" as "isOwner"
        from  user_wallets wu
        where 1 = 1  and wu."walletId" = :walletId and  wu."userId" = :userId`;
    const wallates = await sequelize.query(query, { replacements: { walletId, userId}, type: sequelize.QueryTypes.SELECT });
    if(wallates.length == 0 || !wallates[0].isOwner){
        return false;
    }
    return true;
}

async function listUserWallets(userId, withMember = false){
    const query = `
        select  w."id" as "id", w."name" as "name", wu."isOwner" as "isOwner"
        from  wallets w, user_wallets wu
        where 1 = 1  and w."id" = wu."walletId" and  wu."userId" = :userId`;
    const wallates = await sequelize.query(query, { replacements: { userId: userId }, type: sequelize.QueryTypes.SELECT});

    if(!withMember){
        return wallates;
    }
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

    return wallates;
}

module.exports = {
    isWalletOwner,
    listUserWallets
}