const {sequelize, sanitazyQuery, UserWallet } = require('../db');

async function isWalletOwner(walletId, userId){
    const query = sanitazyQuery(`
        select  wu.is_owner as "isOwner"
        from  user_wallet wu
        where 1 = 1  and wu.wallet_id = :walletId and  wu.user_id = :userId`);
    const wallates = await sequelize.query(query, { replacements: { walletId, userId}, type: sequelize.QueryTypes.SELECT });
    if(wallates.length == 0 || !wallates[0].isOwner){
        return false;
    }
    return true;
}

async function userInWallet(userId, walletId){
    if(!userId || !walletId){
        return false;
    }
    const total = await UserWallet.count({
        where : {
            userId,  walltId: walletId
        }
    })

    return total > 0;
}

async function listUserWallets(userId, withMember = false){
    const query = sanitazyQuery(`
        select  w.id as "id", w.name as "name", wu.is_owner as "isOwner", w.description as "description"
        from  wallet w, user_wallet wu
        where 1 = 1  and w.id = wu.wallet_id 
            and w.deleted_at is null
            and  wu.user_id = :userId`);
    const wallates = await sequelize.query(query, { replacements: { userId: userId }, type: sequelize.QueryTypes.SELECT});

    if(!withMember){
        return wallates;
    }
    const queryUser = sanitazyQuery(`select  
            wu.user_id as "id",
            wu.is_owner as "isOwner",
            u.name as "name",
            u.avatar as "avatar"
        from  
        wallet w, user_wallet wu, app_user u
        where 1 = 1  
        and w.id = wu.wallet_id
        and wu.user_id = u.id
        and w.id = :walletId`);

    for (const wallet of wallates) {
        wallet.users = await sequelize.query(queryUser, { replacements: { walletId: wallet.id }, type: sequelize.QueryTypes.SELECT});
    }

    return wallates;
}

module.exports = {
    isWalletOwner,
    listUserWallets,
    userInWallet
}