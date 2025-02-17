const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const {morganFormat} = require('./env');
const queryParser = require('express-query-int');
const authMiddleware = require('./middleware/auth')


const app = express();
if(morganFormat){
	app.use(morgan(morganFormat));
}
app.use(bodyParser.json());
app.use(cors({
	'origin': '*',
	'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
	'preflightContinue': false,
	'allowedHeaders' : ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'walletId'],
	'maxAge' : 86400
}));
app.use(queryParser());
app.disable('x-powered-by');

//Routers
app.use(require('./controllers/auth'));
app.use(authMiddleware);
app.use(require('./controllers/bill'));
app.use(require('./controllers/category'));
app.use(require('./controllers/wallet'));
app.use(require('./controllers/user'));
app.use(require('./controllers/credit'));
app.use(require('./controllers/debit'));
app.use(require('./controllers/import'));
app.use(require('./controllers/entry'));
app.use(require('./controllers/plan'));
// app.use(require('./controllers/credit'));
// app.use(require('./controllers/creditCard'));
// app.use(require('./controllers/dashboard'));
// app.use(require('./controllers/debt'));
// app.use(require('./controllers/investiment'));
// app.use(require('./controllers/monthDetails'));
// app.use(require('./controllers/summary'));

module.exports = app
