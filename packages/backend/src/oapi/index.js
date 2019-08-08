module.exports = app => {
	//force autenticate for all request
	// api.use(auth);
	//register api in server
	app.use('/oapi', require('./auth'));
};
