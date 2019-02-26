const { Router } = require('express');

module.exports = server => {
	const oapi = Router();
	//force autenticate for all request
	// api.use(auth);
	//register api in server
	server.use('/oapi', oapi);

	require('./user')(oapi);
};
