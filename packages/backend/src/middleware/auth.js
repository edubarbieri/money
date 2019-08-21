const jwt = require('jsonwebtoken');
const env = require('../env.js');
module.exports = (req, res, next) => {
	// CORS preflight request
	if (req.method === 'OPTIONS') {
		next();
	} else {
		const token = req.body.token || req.query.token || req.headers['authorization'];
		if (!token) {
			return res.status(401).send({
				errors: ['no.token.provided.']
			});
		}
		jwt.verify(token, env.authSecret, function(err, decoded) {
			if (err) {
				return res.status(401).send({
					errors: ['failed.to.authenticate.token.']
				});
			} else {
				req.userId = decoded.userId;
				next();
			}
		});
	}
};
