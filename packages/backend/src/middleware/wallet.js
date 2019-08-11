module.exports = (req, res, next) => {
    const walletId = req.header('wallteId');
    if(!walletId){
        return res.status(400).send({
            errors: ['wallet.not.found']
        });
    }
    req.walletId = walletId;
    next();
};
