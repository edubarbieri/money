const { sequelize, User, Category } = require('./models');
const { Op } = require('sequelize');
const _ = require('lodash');
const moment = require('moment');

function order({ order }, extendsFnc) {
	let orders = order.split('_');

	if (orders.length === 1) {
		orders.push('DESC');
	}
	if (orders[0].split('.').length > 1) {
		const [model, field] = orders[0].split('.');
		if (sequelize.models[model]) {
			const direction = orders.length === 1 ? 'DESC' : orders[1];
			orders = [];
			orders.push(sequelize.models[model]);
			orders.push(field);
			orders.push(direction);
		}
	}
	if (typeof extendsFnc === 'function') {
		extendsFnc(orders);
	}
	return orders;
}

function where(options, extendsFnc, dateColumn = 'dueDate') {
	const where = {};

	if (_.has(options, 'walletId')) {
		where.wallet_id = options.walletId;
	}

	if (_.has(options, 'month')) {
		let month = parseInt(options.month);
		if (month > 12) {
			month = 12;
		}
		const year = _.has(options, 'year') ? parseInt(options.year) : new Date().getFullYear();
		const monthYear = year + '-' + (month < 10 ? '0' + month : month);
		where[dateColumn] = {
			[Op.gte]: monthYear + '-01',
			[Op.lt]: moment(monthYear).add(1, 'month') .format('YYYY-MM-DD')
		};
	}

	if (typeof extendsFnc === 'function') {
		extendsFnc(where);
	}

	return where;
}

function include(options, extendsFnc) {
	const includes = [];
	if (options.withUser === 'true') {
		includes.push({
			model: User,
			attributes: ['id', 'name', 'avatar']
		});
	}

	if (options.withCategory === 'true') {
		includes.push({
			model: Category,
			attributes: ['id', 'name']
		});
	}

	if (typeof extendsFnc === 'function') {
		extendsFnc(includes);
	}

	return includes;
}

module.exports = {
	order: order,
	where: where,
	include: include
}
