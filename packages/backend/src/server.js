

const bodyParser = require('body-parser');
const express = require('express');
const cors = require('./middleware/cors');
const morgan = require('morgan');
const env = require('./env');
const queryParser = require('express-query-int');

module.exports = (production) => {
	const server = express();
	server.use(morgan(production ? 'tiny' : 'dev'));
	server.use(bodyParser.urlencoded({ extended: true}));
	server.use(bodyParser.json());
	server.use(cors);
	server.use(queryParser());

	//register api
	require('./api')(server);
	//register open api
	require('./oapi')(server);

	//static content
	server.use(express.static(env.staticPath));

	server.disable('x-powered-by');

	server.listen(env.port, () => {
		console.log(`================== Server is running in port ${env.port}`);
	});
};

