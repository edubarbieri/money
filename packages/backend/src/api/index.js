const { Router } = require('express');
const auth = require('../middleware/auth');

module.exports = app => {
	const api = Router();
	//force autenticate for all request
	api.use(auth);
	//register api in server
	app.use('/api', api);

	require('./debt')(api);
	require('./credit')(api);
	require('./creditCard')(api);
	require('./investiment')(api);
	require('./dashboard')(api);
	require('./import')(api);
	require('./summary')(api);
	require('./category')(api);
	require('./monthDetails')(api);
	// require('./billToPay')(api);
};
