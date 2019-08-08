module.exports = {
	port: process.env.PORT || 3003,
	authSecret: process.env.AUTH_SECRET || 'd4d11e98cbbcb84e773b8b3328627267',
	databaseURL : process.env.DATABASE_URL || 'postgres://mymoney:mymoney@localhost:5432/mymoney',
	production: process.env.NODE_ENV === 'production'
};
