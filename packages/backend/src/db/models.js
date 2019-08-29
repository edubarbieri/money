const {
	Sequelize,
	Model
} = require('sequelize');
require('sequelize-hierarchy')(Sequelize);
const env = require('../env');

const sequelize = new Sequelize(env.databaseURL,{
	pool:{
		max: 20,
		min: 2, 
		acquire: 5000,
		idle: 10000
	},
	define:{
		freezeTableName: true,
		underscored: true
	},
	logging: env.dbLogging
});


// /**
//  * @class Bill model
//  */
// class Bill extends Model {}
// Bill.init({
//   id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, field: 'id'},
//   description: { type: Sequelize.STRING, allowNull: false, field: 'description'},
//   dueDate: { type: Sequelize.DATE, allowNull: false, field: 'due_date'},
//   payDate: { type: Sequelize.DATE, field: 'pay_date'},
//   value: { type: Sequelize.DECIMAL(10, 2), allowNull: false, field: 'value',
//     validate: { min: 0 }
//   },
//   recurrent: { type: Sequelize.BOOLEAN, defaultValue: false, field: 'recurrent'},
//   recurrentTotal: { type: Sequelize.INTEGER, field: 'recurrent_total'},
//   recurrentCount: { type: Sequelize.INTEGER, field: 'recurrent_count'}
// }, {
//   sequelize,
// 	modelName: 'bill',
// 	tableName: 'bill'
// });

// Bill.belongsTo(Category, {foreignKey: 'category_id'});

// /**
//  * @class Debt model
//  */
// class Debt extends Model {}
// Debt.init({
// 	id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, field: 'id' },
// 	month: { type: Sequelize.INTEGER, allowNull: false, validate: { min: 1, max: 12 }, field: 'month'},
// 	year: { type: Sequelize.INTEGER, allowNull: false, validate: { min: 1970, max: 2100 }, field: 'year' },
// 	name: { type: Sequelize.STRING, allowNull: false, field: 'name'},
// 	value: { type: Sequelize.DECIMAL(10, 2), allowNull: false, validate: { min: 0 }, field: 'value' },
// 	entryDate: {type: Sequelize.DATEONLY, field: 'entry_date',
// 	 	set: function(value){
// 			 let date;
// 			 if(value instanceof Date){
// 				 date = value
// 			 }else{
// 				 date = moment(value).toDate()
// 			 }
// 			this.setDataValue('month', date.getMonth() + 1)
// 			this.setDataValue('year', date.getFullYear())
// 			return this.setDataValue('entryDate', date)
// 		}
// 	},
// 	status: { type: Sequelize.ENUM('PAYD', 'SCHEDULED', 'PENDING'), field: 'status'},
// 	importHash: { type: Sequelize.STRING, field: 'import_hash'}
// },{
// 	sequelize,
// 	modelName: 'debt',
// 	tableName: 'debt',
// 	getterMethods: {
// 		formattedDate(){
// 			return this.entryDate ? moment(this.entryDate).format('DD/MM/YYYY') : '';
// 		}
// 	}
// }
// );
// Debt.belongsTo(Category)

// /**
//  * @class Credit model
//  */
// class Credit extends Model {}
// Credit.init({
// 	id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, field: 'id'},
// 	month: { type: Sequelize.INTEGER, allowNull: false, validate: { min: 1, max: 12 }, field: 'month'},
// 	year: { type: Sequelize.INTEGER, allowNull: false, validate: { min: 1970, max: 2100 }, field: 'year' },
// 	name: { type: Sequelize.STRING, allowNull: false, field: 'name'},
// 	value: { type: Sequelize.DECIMAL(10, 2), allowNull: false, validate: { min: 0 }, field: 'value'},
// 	entryDate: {type: Sequelize.DATEONLY, field: 'entry_date',
// 		set: function(value){
// 			let date;
// 			if(value instanceof Date){
// 				date = value
// 			}else{
// 				date = moment(value).toDate()
// 			}
// 		 this.setDataValue('month', date.getMonth() + 1)
// 		 this.setDataValue('year', date.getFullYear())
// 		 return this.setDataValue('entryDate', date)
// 	 }
// 	},
// 	importHash: { type: Sequelize.STRING, field: 'import_hash'}
// },{
// 	sequelize,
// 	modelName: 'credit',
// 	tableName: 'credit',
// 	getterMethods: {
// 		formattedDate(){
// 			return this.entryDate ? moment(this.entryDate).format('DD/MM/YYYY') : '';
// 		}
// 	}
// }
// );

// Credit.belongsTo(Category, {foreignKey: 'category_id'});

/**
 * @class User model
 */
class User extends Model {}
User.init({
	id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, field: 'id'},
	name: { type: Sequelize.STRING, allowNull: false, field: 'name'},
	email: { type: Sequelize.STRING, allowNull: false, validate: { isEmail: true}, field: 'email'},
	password: { type: Sequelize.STRING, allowNull: false, field: 'password'},
	avatar: { type: Sequelize.STRING, field: 'avatar'}
},{
	sequelize,
	modelName: 'user',
	tableName: 'app_user'
});

/**
 * @class Wallet model
 */
class Wallet extends Model {}
Wallet.init({
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true,
		field: 'id'
	},
	name: {type: Sequelize.STRING, allowNull: false, field: 'name'},
	description: {type: Sequelize.STRING, field: 'description'}
}, { sequelize, modelName: 'wallet', tableName: 'wallet', paranoid: true});


class UserWallet extends Model {}
UserWallet.init({
	userId: {
		type: Sequelize.INTEGER,
		field: 'user_id'
	},
	walltId: {
		type: Sequelize.INTEGER,
		field: 'wallet_id'
	},
	isOwner: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false,
		field: 'is_owner'
	}
}, { sequelize, modelName: 'userWallet', tableName: 'user_wallet'});




User.belongsToMany(Wallet, {
	through: {
		model: UserWallet,
		unique: false
	},
	foreignKey: 'user_id',
	constraints: false
});

Wallet.belongsToMany(User, {
	through: {
		model: UserWallet,
		unique: false
	},
	foreignKey: 'wallet_id',
	constraints: false
});


/**
 * @class Category model
 */
class Category extends Model {}
Category.init({
	id: { type: Sequelize.INTEGER,  primaryKey: true, autoIncrement: true, field: 'id'},
	name: { type: Sequelize.STRING, allowNull: false, field: 'name'},
	walletId: { type: Sequelize.INTEGER, allowNull: false, field: 'wallet_id'},
	parentId: { type: Sequelize.INTEGER, allowNull: true, field: 'parent_id'},
	keywords: { type: Sequelize.ARRAY(Sequelize.STRING), field: 'keywords'}
}, {
	sequelize,
	hierarchy: {
		levelFieldName: 'hierarchy_level',
		foreignKey:'parent_id',
		throughKey: 'category_id',
		throughForeignKey: 'ancestor_id',
		throughTable: 'category_ancestors'
	},
	modelName: 'category',
	tableName: 'category'
});
Category.belongsTo(Wallet, {foreignKey: 'wallet_id', allowNull: false});



/**
 * @class Bill model
 */
class Bill extends Model {
	get isPayd(){
		return this.payDate !== null;
	}
}
Bill.init({
	id: { 
		type: Sequelize.DataTypes.UUID, 
		primaryKey: true, 
		allowNull: false,
		field: 'id',
		defaultValue: Sequelize.UUIDV4
	},
	description: { type: Sequelize.STRING, allowNull: false, field: 'description'},
	dueDate: { type: Sequelize.DATE, allowNull: false, field: 'due_date'},
	paymentDate: { type: Sequelize.DATE, field: 'payment_date'},
	amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false, field: 'amount',
		validate: { min: 0 },
		get() {
			// Workaround until sequelize issue #8019 is fixed
			const value = this.getDataValue('amount');
			return value === null ? null : parseFloat(value);
		}
	},
	amountPaid: { type: Sequelize.DECIMAL(10, 2), field: 'amount_paid',
		validate: { min: 0 },
		get() {
			// Workaround until sequelize issue #8019 is fixed
			const value = this.getDataValue('amountPaid');
			return value === null ? null : parseFloat(value);
		}
	},
	recurrent: { type: Sequelize.BOOLEAN, defaultValue: false, field: 'recurrent'},
	recurrentTotal: { type: Sequelize.INTEGER, field: 'recurrent_total', validate: { min: 0 }},
	recurrentCount: { type: Sequelize.INTEGER, field: 'recurrent_count', validate: { min: 0 }},

	categoryId: { type: Sequelize.INTEGER, allowNull: true, field: 'category_id'},
	walletId: { type: Sequelize.INTEGER, allowNull: false, field: 'wallet_id'},
	userId: { type: Sequelize.INTEGER, allowNull: true, field: 'user_id'}
}, {
	sequelize,
	modelName: 'bill',
	tableName: 'bill'
});

Bill.belongsTo(Category, {foreignKey: 'category_id'});
Bill.belongsTo(Wallet, {foreignKey: 'wallet_id', allowNull: false});
Bill.belongsTo(User, {foreignKey: 'user_id'});

module.exports = {
	sequelize,
	Category,
	User,
	Wallet,
	UserWallet,
	Bill
}