const Sequelize = require('sequelize');
const {formateDate} = require('./util/date');
const env = require('./env');
const sequelize = new Sequelize(env.mysqlURl, {
	dialect: 'mysql',
	pool: {
		max: 10,
		min: 0,
		acquire: 30000,
		idle: 10000
	},
	dialectOptions: {
	},
	timezone: '-03:00', // -->Add this line. for writing to database
});


const Debt = sequelize.define('debt',{
	id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	month: { type: Sequelize.INTEGER, allowNull: false, validate: { min: 1, max: 12 }},
	year: { type: Sequelize.INTEGER, allowNull: false, validate: { min: 1970, max: 2100 } },
	name: { type: Sequelize.STRING, allowNull: false},
	value: { type: Sequelize.DOUBLE(10, 2), allowNull: false, validate: { min: 0 } },
	entryDate: {type: Sequelize.DATE },
	tag: { type: Sequelize.STRING },
	status: { type: Sequelize.ENUM('PAYD', 'SCHEDULED', 'PENDING') },
	recurrent: { type: Sequelize.BOOLEAN, defaultValue: false },
	recurrentCount: {type: Sequelize.INTEGER, defaultValue: 0},
	recurrentTotal: {type: Sequelize.INTEGER, defaultValue: 0},
	importHash: { type: Sequelize.STRING }
},{
	getterMethods: {
		formattedDate(){
			return this.entryDate ? formateDate(this.entryDate) : '';
		}
	}
}
);

const Credit = sequelize.define('credit',{
	id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	month: { type: Sequelize.INTEGER, allowNull: false, validate: { min: 1, max: 12 }},
	year: { type: Sequelize.INTEGER, allowNull: false, validate: { min: 1970, max: 2100 } },
	name: { type: Sequelize.STRING, allowNull: false},
	value: { type: Sequelize.DOUBLE(10, 2), allowNull: false, validate: { min: 0 } },
	entryDate: {type: Sequelize.DATE },
	tag: { type: Sequelize.STRING },
	recurrent: { type: Sequelize.BOOLEAN, defaultValue: false },
	recurrentCount: {type: Sequelize.INTEGER, defaultValue: 0},
	recurrentTotal: {type: Sequelize.INTEGER, defaultValue: 0},
	importHash: { type: Sequelize.STRING }
},{
	getterMethods: {
		formattedDate(){
			return formateDate(this.entryDate);
		}
	}
}
);


const CreditCard = sequelize.define('credit_card',{
	id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	month: { type: Sequelize.INTEGER, allowNull: false, validate: { min: 1, max: 12 }},
	year: { type: Sequelize.INTEGER, allowNull: false, validate: { min: 1970, max: 2100 } },
	name: { type: Sequelize.STRING, allowNull: false},
	value: { type: Sequelize.DOUBLE(10, 2), allowNull: false, validate: { min: 0 } },
	entryDate: {type: Sequelize.DATE, allowNull: false},
	tag: { type: Sequelize.STRING },
	card: { type: Sequelize.STRING },
	recurrent: { type: Sequelize.BOOLEAN, defaultValue: false },
	recurrentCount: {type: Sequelize.INTEGER, defaultValue: 0},
	recurrentTotal: {type: Sequelize.INTEGER, defaultValue: 0}
},{
	getterMethods: {
		formattedDate(){
			return formateDate(this.entryDate);
		}
	}
}
);

const Investiment = sequelize.define('investiment',{
	id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	month: { type: Sequelize.INTEGER, allowNull: false, validate: { min: 1, max: 12 }},
	year: { type: Sequelize.INTEGER, allowNull: false, validate: { min: 1970, max: 2100 } },
	value: { type: Sequelize.DOUBLE(10, 2), allowNull: false, validate: { min: 0 } },
	entryDate: {type: Sequelize.DATE, allowNull: false},
	type: { type: Sequelize.STRING }
},{
	getterMethods: {
		formattedDate(){
			return formateDate(this.entryDate);
		}
	}
}
);
const User = sequelize.define('user',{
	id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	name: { type: Sequelize.STRING, allowNull: false},
	email: { type: Sequelize.STRING, allowNull: false, validate: { isEmail: true }},
	password: { type: Sequelize.STRING, allowNull: false},
}
);

const initDb = (production) => {
	console.log(`initlizing sequelize with env ${production ? 'production' : 'development'}`);
	return sequelize.sync();
};

const formatDbError = (res, seqError) => {
	const errors = [];
	if(seqError.name === 'SequelizeValidationError'){
		const errorMessages = seqError.errors.map(error => {
			return `O valor "${error.value}" informado para a propriedade ${error.path} é inválido.`;
		});
		errors.push(errorMessages);

	}else if(seqError.name === 'SequelizeConnectionRefusedError'|| seqError.name === 'ConnectionTimedOutError'){
		errors.push('Erro de conexão com o banco de dados. Por favor, tente novamente, se o erro persistir entre em contato com o administrador do sistema.');
		console.error(seqError);
	}else if(seqError.message){
		errors.push(seqError.message);
		console.error(seqError);
	}

	res.status(500).send({
		errors: errors
	});
};

const paginatedQuery = (entity, options, page = 1, itemsPerPage = env.defaultPageSize) => {
	return new Promise((resolve, reject) => {
		entity.count(options).then(count => {
			if(count === 0){
				resolve({
					page: 0,
					totalItems: 0,
					totalPages: 0,
					items: []
				});
				return;
			}
			const totalPages = Math.ceil(count / itemsPerPage);
			if(page > totalPages){
				page = totalPages;
			}
			const offset = itemsPerPage * (page - 1);

			entity.findAll({
				...options,
				limit: itemsPerPage,
				offset
			}).then(result => {
				resolve({
					totalPages,
					page,
					itemsPerPage,
					totalItems: count,
					items: result ||[],
				});
			}).catch(e => reject(e));
		}).catch(e => reject(e));
	});
};

module.exports = {
	Debt,
	Credit,
	Investiment,
	CreditCard,
	User,
	sequelize,
	initDb,
	formatDbError,
	paginatedQuery
};

