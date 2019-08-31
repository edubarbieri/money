const { Bill, User, Category, paginatedQuery, sanitazyQuery, sequelize } = require('../db');
const { Op, col} = require('sequelize');
const _ = require('lodash');
const moment = require('moment');
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



async function generateMonthRecurrentBills(walletId, month, year){
	const query = sanitazyQuery(`
		insert into bill (source_bill_id, description, due_date, amount, recurrent, recurrent_total, recurrent_count, wallet_id, category_id, user_id, created_at, updated_at)
		select bill.id, 
			bill.description, 
			due_date + INTERVAL '1 month' due_date, 
			COALESCE(bill.amount_paid, bill.amount) amount,
			true recurrent,
			bill.recurrent_total,
			bill.recurrent_count + 1 recurrent_count,
			bill.wallet_id,
			bill.category_id,
			bill.user_id,
			current_timestamp created_at,
			current_timestamp updated_at
		from bill
		where
		bill.recurrent = true
		AND (bill.recurrent_count IS NULL or bill.recurrent_count < bill.recurrent_total)
		AND EXTRACT(month from bill.due_date) = :prevMonth
		AND EXTRACT(year from bill.due_date) = :prevYear
		and bill.wallet_id = :walletId
		AND NOT EXISTS (
			select 1 from bill b2
			where 
			b2.source_bill_id = bill.id
			AND EXTRACT(month from b2.due_date) = :curMonth
			AND EXTRACT(year from b2.due_date) = :curYear
			and b2.wallet_id = :walletId
		)
	`);

	try {
		// month in js start in 0
		const previewMonthDate = moment([year, month - 1]).subtract(1, 'month');

		
		const resp = await sequelize.query(query, {
			replacements: {
				prevMonth: previewMonthDate.month() + 1,
				prevYear: previewMonthDate.year(),
				curMonth: month,
				curYear: year,
				walletId
			},
			type: sequelize.QueryTypes.INSERT
		});
		return {
			billsCreated: resp[1]
		}
	} catch (error) {
		console.error('generateMonthRecurrentBills - error', error);
		return {
			errors: ['bill.generateMonthRecurrentBills.genericError']
		}
	}
}

async function billAmountMonthResume(walletId){
	const query = sanitazyQuery(`
	select * from (
		select 
			EXTRACT(year from bill.due_date) as "year",
			EXTRACT(month from bill.due_date) as "month", 	
			sum(COALESCE(bill.amount_paid, bill.amount)) as "amount"
		FROM bill
		WHERE
			bill.due_date >= date_trunc('month', current_date - interval '6' month)
			AND wallet_id = :walletId
		group by EXTRACT(year from bill.due_date), EXTRACT(month from bill.due_date)
  ) as b
  order by 1, 2
	`);

	try {
		
		return await sequelize.query(query, {
			replacements: {
				walletId
			},
			type: sequelize.QueryTypes.SELECT
		});
	} catch (error) {
		console.error('generateMonthRecurrentBills - error', error);
		return {
			errors: ['bill.generateMonthRecurrentBills.genericError']
		}
	}
}


module.exports = {
	findAll: findAll,
	BILL_ATTRIBUTES: BILL_ATTRIBUTES,
	generateMonthRecurrentBills: generateMonthRecurrentBills,
	billAmountMonthResume: billAmountMonthResume
};