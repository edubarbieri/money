const {
  Sequelize,
	Model
} = require('sequelize');
require('sequelize-hierarchy')(Sequelize);
const moment = require('moment')
const env = require('../env');

const sequelize = new Sequelize(env.databaseURL,{
	pool:{
		max: 20,
		min: 2, 
		acquire: 5000,
		idle: 10000
	}
});

/**
 * @class Category model
 */
class Category extends Model {};
Category.init({
  id: { type: Sequelize.INTEGER,  primaryKey: true,autoIncrement: true },
  name: { type: Sequelize.STRING, allowNull: false },
  keywords: { type: Sequelize.TEXT,
    get: function () {
      const keywords = this.getDataValue('keywords');
      if (keywords) {
        return JSON.parse(keywords);
      }
      return []
    },
    set: function (val) {
      return this.setDataValue('keywords', JSON.stringify(val || []));
    }
  }
}, {
  sequelize,
  hierarchy: true,
  modelName: 'category'
});

/**
 * @class Bill model
 */
class Bill extends Model {}
Bill.init({
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  description: { type: Sequelize.STRING, allowNull: false },
  dueDate: { type: Sequelize.DATE, allowNull: false },
  payDate: { type: Sequelize.DATE },
  value: { type: Sequelize.DECIMAL(10, 2), allowNull: false,
    validate: { min: 0 }
  },
  recurrent: { type: Sequelize.BOOLEAN, defaultValue: false
  }
}, {
  sequelize,
  modelName: 'bill'
});

Bill.belongsTo(Category)

/**
 * @class Debt model
 */
class Debt extends Model {}
Debt.init({
	id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	month: { type: Sequelize.INTEGER, allowNull: false, validate: { min: 1, max: 12 }},
	year: { type: Sequelize.INTEGER, allowNull: false, validate: { min: 1970, max: 2100 } },
	name: { type: Sequelize.STRING, allowNull: false},
	value: { type: Sequelize.DECIMAL(10, 2), allowNull: false, validate: { min: 0 } },
	entryDate: {type: Sequelize.DATEONLY, 
	 	set: function(value){
			 let date;
			 if(value instanceof Date){
				 date = value
			 }else{
				 date = moment(value).toDate()
			 }
			this.setDataValue('month', date.getMonth() + 1)
			this.setDataValue('year', date.getFullYear())
			return this.setDataValue('entryDate', date)
		}
	},
	status: { type: Sequelize.ENUM('PAYD', 'SCHEDULED', 'PENDING') },
	recurrent: { type: Sequelize.BOOLEAN, defaultValue: false },
	recurrentCount: {type: Sequelize.INTEGER, defaultValue: 0},
	recurrentTotal: {type: Sequelize.INTEGER, defaultValue: 0},
	importHash: { type: Sequelize.STRING }
},{
	sequelize,
	modelName: 'debt',
	getterMethods: {
		formattedDate(){
			return this.entryDate ? moment(this.entryDate).format('DD/MM/YYYY') : '';
		}
	}
}
);
Debt.belongsTo(Category)

/**
 * @class Credit model
 */
class Credit extends Model {}
Credit.init({
	id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	month: { type: Sequelize.INTEGER, allowNull: false, validate: { min: 1, max: 12 }},
	year: { type: Sequelize.INTEGER, allowNull: false, validate: { min: 1970, max: 2100 } },
	name: { type: Sequelize.STRING, allowNull: false},
	value: { type: Sequelize.DECIMAL(10, 2), allowNull: false, validate: { min: 0 } },
	entryDate: {type: Sequelize.DATEONLY,
		set: function(value){
			let date;
			if(value instanceof Date){
				date = value
			}else{
				date = moment(value).toDate()
			}
		 this.setDataValue('month', date.getMonth() + 1)
		 this.setDataValue('year', date.getFullYear())
		 return this.setDataValue('entryDate', date)
	 }
	},
	recurrent: { type: Sequelize.BOOLEAN, defaultValue: false },
	recurrentCount: {type: Sequelize.INTEGER, defaultValue: 0},
	recurrentTotal: {type: Sequelize.INTEGER, defaultValue: 0},
	importHash: { type: Sequelize.STRING }
},{
	sequelize,
	modelName: 'credit',
	getterMethods: {
		formattedDate(){
			return this.entryDate ? moment(this.entryDate).format('DD/MM/YYYY') : '';
		}
	}
}
);

Credit.belongsTo(Category)

/**
 * @class User model
 */
class User extends Model {}
User.init({
	id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	name: { type: Sequelize.STRING, allowNull: false},
	email: { type: Sequelize.STRING, allowNull: false, validate: { isEmail: true}},
	password: { type: Sequelize.STRING, allowNull: false},
},{
	sequelize,
	modelName: 'user',
});



class UserWallet extends Model {}
UserWallet.init({
  userId: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  walletId: {
	type: Sequelize.INTEGER,
	primaryKey: true,
  },
  isOwner: {
	type: Sequelize.BOOLEAN,
	allowNull: false,
	defaultValue: false
  }
}, { sequelize, modelName: 'user_wallet' });


class Wallet extends Model {}
Wallet.init({
  id: {
	type: Sequelize.INTEGER,
	autoIncrement: true,
    primaryKey: true,
  },
  name: {type: Sequelize.STRING, allowNull: false},
  description: {type: Sequelize.STRING}
}, { sequelize, modelName: 'wallet' });

User.belongsToMany(Wallet, {
	through: {
	  model: UserWallet,
	  unique: false
	},
	foreignKey: 'userId',
	constraints: false
});

Wallet.belongsToMany(User, {
	through: {
	  model: UserWallet,
	  unique: false
	},
	foreignKey: 'walletId',
	constraints: false
});


module.exports = {
  sequelize,
  Category,
	Bill,
	Debt,
	Credit,
	User,
	Wallet,
	UserWallet
}