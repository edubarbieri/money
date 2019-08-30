const { Bill, User, Category, paginatedQuery } = require('../db');
const { Op } = require('sequelize');
const _ = require('lodash');
const BILL_ATTRIBUTES = [
	'id',
	'description',
	'dueDate',
	'paymentDate',
	'amount',
	'amountPaid',
	'recurrent',
	'recurrentTotal',
	'recurrentCount',
	'isPayd'
];

const defaultsFindAll = {
	withCategory: false,
	withUser: false,
	order: 'dueDate_ASC',
	page: 1,
	pageSize: 15
};

function findAll(options) {
	const finalOptions = { ...defaultsFindAll, ...options };
	return paginatedQuery(Bill, {
		attributes: BILL_ATTRIBUTES,
		where: _where(finalOptions),
		include: _include(finalOptions),
		order: [_order(finalOptions)]
	}, finalOptions.page, finalOptions.pageSize);
}
function _include(options) {
	const includes = [];
	if (options.withCategory === 'true') {
		includes.push({
			model: User,
			attributes: ['name']
		});
	}

	if (options.withUser === 'true') {
		includes.push({
			model: Category,
			attributes: ['id', 'name']
		});
	}

	return includes;
}
function _where(options) {
	const where = {
		wallet_id: options.walletId
	};

	if (_.has(options, 'isPayd')) {
		if (options.isPayd === 'true') {
			where.paymentDate = {
				[Op.not]: null
			};
		} else {
			where.paymentDate = {
				[Op.is]: null
			};
		}
	}
	if (_.has(options, 'month')) {
		let month = parseInt(options.month);
		if (month > 12) {
			month = 12;
		}
		const year = _.has(options, 'year') ? parseInt(options.year) : new Date().getFullYear();
		const monthYear = year + '-' + (month < 10 ? '0' + month : month);
		where.dueDate = {
			[Op.gte]: new Date(monthYear + '-01T00:00:00Z'),
			[Op.lt]: new Date(year + '-' + (month + 1 < 10 ? '0' + (month + 1) : month + 1) + '-01T00:00:00Z'
			)
		};
	}

	return where;
}

const orderModelMap = {
	'user': User,
	'category': Category
};
function _order(options) {
	let orders = options.order.split('_');

	if (orders.length === 1) {
		orders.push('DESC');
	}
	if (orders[0].split('.').length > 1) {
		const [model, field] = orders[0].split('.');
		if (orderModelMap[model]) {
			const direction = orders.length === 1 ? 'DESC' : orders[1];
			orders = [];
			orders.push(orderModelMap[model]);
			orders.push(field);
			orders.push(direction);
		}
	}

	return orders;
}

module.exports = {
	findAll: findAll
};
