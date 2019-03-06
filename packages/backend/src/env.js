module.exports = {
	port: process.env.PORT || 3003,
	authSecret: process.env.AUTH_SECRET || 'd4d11e98cbbcb84e773b8b3328627267',
	staticPath : process.env.STATIC || '../public',
	mysqlURL : process.env.MYSQL_URL || 'mysql://mymoney:mymoney@localhost:3306/mymoney',
	postgresURL : process.env.POSTGRES_URL || 'postgres://mymoney:mymoney@localhost:5432/mymoney',
	defaultPageSize: 10
};
