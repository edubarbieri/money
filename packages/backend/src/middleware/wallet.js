const { userInWallet } = require('../services/wallets');

function getWalletId(req) {
	const header = req.header('walletId');
	if (header) {
		return header;
	}
	if (req.query && req.query.walletId) {
		return req.query.walletId;
	}
}
module.exports = (req, res, next) => {
	const walletId = getWalletId(req);
	if (!walletId) {
		return res.status(400).send({
			errors: ['wallet.not.found']
		});
	}
	userInWallet(req.userId, walletId).then(inWlt => {
		if (inWlt) {
			req.walletId = walletId;
			next();
		} else {
			res.status(400).send({
				errors: ['wallet.not.found']
			});
		}
	});
};
