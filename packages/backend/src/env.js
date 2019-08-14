
const nodeEnv = process.env.NODE_ENV || 'dev';
const vars = {
	dev: {
		port: process.env.PORT || 3003,
		authSecret: process.env.AUTH_SECRET || 'd4d11e98cbbcb84e773b8b3328627267',
		databaseURL : process.env.DATABASE_URL || 'postgres://mymoney:mymoney@docker:5432/mymoney',
		production: false,
		dbLogging: true,
		morganFormat: 'dev'
	},
	test: {
		port: process.env.PORT || 3003,
		authSecret: process.env.AUTH_SECRET || '848015cb3001954aa03904ff3607083a',
		databaseURL : 'sqlite://./__tests__/database.sqlite',
		production: false,
		dbLogging: false,
	},
	production: {
		port: process.env.PORT || 3003,
		authSecret: process.env.AUTH_SECRET,
		databaseURL : process.env.DATABASE_URL,
		production: true,
		dbLogging: false,
		morganFormat: 'tiny'
	}
}
module.exports = vars[nodeEnv];
