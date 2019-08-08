const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const {production} = require('./env');
const queryParser = require('express-query-int');
const {sequelize} = require('./db/models')



module.exports = async () => {
	const app = express();
	app.use(morgan(production ? 'tiny' : 'dev'));
	// app.use(bodyParser.urlencoded({ extended: true}));
	app.use(bodyParser.json());
	app.use(cors({
		"origin": "*",
		"methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
		"preflightContinue": false,
		"allowedHeaders" : ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
	}));
	app.use(queryParser());
	
	//register api
	require('./api')(app);
	//register open api
	require('./oapi')(app);
	app.disable('x-powered-by');
	
	await sequelize.sync();

	return app;
};
