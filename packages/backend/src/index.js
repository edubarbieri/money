const { initDb } = require('./sequelize');
const server = require('./server');

const prod = process.env.NODE_ENV === 'production';

initDb(prod)
	.then(() => {
		console.log('starting server...');
		server();
	})
	.catch(error => {
		console.log('Error initing databse, could not start server', error);
	});
