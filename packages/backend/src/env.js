module.exports = {
	port: process.env.PORT || 3003,
	authSecret: process.env.AUTH_SECRET || 'd4d11e98cbbcb84e773b8b3328627267',
	staticPath : process.env.STATIC || '../public',
	mysqlURl : process.env.MYSQL_URL || 'mysql://mymoney:mymoney@localhost:3306/mymoney',
	defaultPageSize: 10
};
