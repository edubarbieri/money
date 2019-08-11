const {sequelize, User} = require('../db');
module.exports = {
    async create(userId, body) {
        const user = await User.findByPk(userId, {attributes: ['id']});
        sequelize.transaction(t => {
            return Wallet.create({
                name: body.name
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
    },
    isWalletOwner: async function(walletId, userId){
        const query = `
            select  wu."isOwner" as "isOwner"
            from  user_wallets wu
            where 1 = 1  and wu."walletId" = :walletId and  wu."userId" = :userId`;
        const wallates = await sequelize.query(query, { replacements: { walletId, userId}, type: sequelize.QueryTypes.SELECT });
        if(wallates.length == 0 || wallates[0].isOwner !== 1){
            return false;
        }
        return true;
    }

}