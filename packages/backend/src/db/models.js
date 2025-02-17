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
	id: { type: Sequelize.DataTypes.UUID, primaryKey: true, field: 'id', defaultValue: Sequelize.UUIDV4},
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
		type: Sequelize.DataTypes.UUID,
		primaryKey: true,
		field: 'id',
		defaultValue: Sequelize.UUIDV4
	},
	name: {type: Sequelize.STRING, allowNull: false, field: 'name'},
	description: {type: Sequelize.STRING, field: 'description'}
}, { sequelize, modelName: 'wallet', tableName: 'wallet', paranoid: true});


class UserWallet extends Model {}
UserWallet.init({
	userId: {
		type: Sequelize.DataTypes.UUID,
		field: 'user_id'
	},
	walltId: {
		type: Sequelize.DataTypes.UUID,
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
	walletId: { type: Sequelize.DataTypes.UUID, allowNull: false, field: 'wallet_id'},
	parentId: { type: Sequelize.DataTypes.UUID, allowNull: true, field: 'parent_id'},
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
class Bill extends Model {}
Bill.init({
	id: { 
		type: Sequelize.DataTypes.UUID, 
		primaryKey: true, 
		allowNull: false,
		field: 'id',
		defaultValue: Sequelize.UUIDV4
	},
	description: { type: Sequelize.STRING, allowNull: false, field: 'description'},
	dueDate: { type: Sequelize.DATEONLY, allowNull: false, field: 'due_date'},
	paymentDate: { type: Sequelize.DATEONLY, field: 'payment_date'},
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
	isPayd: { type: Sequelize.VIRTUAL,
		get() {
			// Workaround until sequelize issue #8019 is fixed
			const paymentDate = this.getDataValue('amountPaid');
			return paymentDate != null;
		}
	},
	recurrent: { type: Sequelize.BOOLEAN, defaultValue: false, field: 'recurrent'},
	recurrentTotal: { type: Sequelize.INTEGER, field: 'recurrent_total', validate: { min: 0 }},
	recurrentCount: { type: Sequelize.INTEGER, field: 'recurrent_count', validate: { min: 0 }},

	categoryId: { type: Sequelize.INTEGER, allowNull: true, field: 'category_id'},
	walletId: { type: Sequelize.DataTypes.UUID, allowNull: false, field: 'wallet_id'},
	userId: { type: Sequelize.DataTypes.UUID, allowNull: true, field: 'user_id'}
}, {
	sequelize,
	modelName: 'bill',
	tableName: 'bill'
});

Bill.belongsTo(Category, {foreignKey: 'category_id'});
Bill.belongsTo(Wallet, {foreignKey: 'wallet_id', allowNull: false});
Bill.belongsTo(User, {foreignKey: 'user_id'});
Bill.belongsTo(Bill, {foreignKey: 'source_bill_id', as: 'sourceBill'});

/**
 * @class Entry model
 */
class Entry extends Model {}
Entry.CREDIT = 'CREDIT';
Entry.DEBIT = 'DEBIT';
Entry.init({
	id: { type: Sequelize.DataTypes.UUID, primaryKey: true, allowNull: false, field: 'id',
		defaultValue: Sequelize.UUIDV4
	},
	description: { type: Sequelize.STRING, allowNull: false, field: 'description'},
	entryDate: { type: Sequelize.DATEONLY, allowNull: false, field: 'entry_date'},
	amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false, field: 'amount',
		validate: { min: 0 },
		get() {
			// Workaround until sequelize issue #8019 is fixed
			const value = this.getDataValue('amount');
			return value === null ? null : parseFloat(value);
		}
	},
	type: { type: Sequelize.ENUM(Entry.CREDIT, Entry.DEBIT), allowNull: false, field: 'type'},
	recurrent: { type: Sequelize.BOOLEAN, defaultValue: false, field: 'recurrent'},
	recurrentTotal: { type: Sequelize.INTEGER, field: 'recurrent_total', validate: { min: 0 }},
	recurrentCount: { type: Sequelize.INTEGER, field: 'recurrent_count', validate: { min: 0 }},
	importHash: { type: Sequelize.STRING, field: 'import_hash'},
	importSource: { type: Sequelize.STRING, field: 'import_source'},

	categoryId: { type: Sequelize.INTEGER, allowNull: true, field: 'category_id'},
	walletId: { type: Sequelize.DataTypes.UUID, allowNull: false, field: 'wallet_id'},
	userId: { type: Sequelize.DataTypes.UUID, allowNull: true, field: 'user_id'}
}, {
	sequelize,
	modelName: 'entry',
	tableName: 'entry'
});

Entry.belongsTo(Category, {foreignKey: 'category_id'});
Entry.belongsTo(Wallet, {foreignKey: 'wallet_id', allowNull: false});
Entry.belongsTo(User, {foreignKey: 'user_id'});
Entry.belongsTo(Entry, {foreignKey: 'source_entry_id', as: 'sourceEntry'});

/**
 * @class Plan
 */
class Plan extends Model {}
Plan.init({
	id: { type: Sequelize.DataTypes.UUID, primaryKey: true, allowNull: false, field: 'id',
		defaultValue: Sequelize.UUIDV4
	},
	name: { type: Sequelize.STRING, allowNull: false, field: 'name'},
	goal: { type: Sequelize.STRING, field: 'goal'},
	startDate: { type: Sequelize.DATEONLY, allowNull: false, field: 'start_date'},
	endDate: { type: Sequelize.DATEONLY, allowNull: false, field: 'end_date'},
	type: { type: Sequelize.STRING, allowNull: false, field: 'type'},
	goalAmount: { type: Sequelize.DECIMAL(10, 2), allowNull: false, field: 'goal_amount',
		validate: { min: 0 },
		get() {
			// Workaround until sequelize issue #8019 is fixed
			const value = this.getDataValue('goalAmount');
			return value === null ? null : parseFloat(value);
		}
	},
	walletId: { type: Sequelize.DataTypes.UUID, allowNull: false, field: 'wallet_id'},
	userId: { type: Sequelize.DataTypes.UUID, allowNull: true, field: 'user_id'}
}, {
	sequelize,
	modelName: 'plan',
	tableName: 'plan',
});

/**
 * @class PlanItem
 */
class PlanItem extends Model {}
PlanItem.init({
	id: { type: Sequelize.DataTypes.UUID, primaryKey: true, allowNull: false, field: 'id',
		defaultValue: Sequelize.UUIDV4
	},
	itemDate: { type: Sequelize.DATEONLY, allowNull: false, field: 'item_date'},
	amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false, field: 'amount',
		validate: { min: 0 },
		get() {
			// Workaround until sequelize issue #8019 is fixed
			const value = this.getDataValue('amount');
			return value === null ? null : parseFloat(value);
		}
	},
	type: { type: Sequelize.ENUM('CREDIT', 'DEBIT'), allowNull: false, field: 'type'}
}, {
	sequelize,
	modelName: 'plan_item',
	tableName: 'plan_item'
});

Plan.hasMany(PlanItem, {as: 'planItems'});
PlanItem.belongsTo(Plan, {foreignKey: 'plan_id', allowNull: false});

module.exports = {
	sequelize,
	Category,
	User,
	Wallet,
	UserWallet,
	Bill,
	Entry,
	Plan,
	PlanItem
}