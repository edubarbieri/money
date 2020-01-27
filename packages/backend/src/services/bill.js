const { Bill, paginatedQuery, sanitazyQuery, sequelize } = require('../db');
const { Op} = require('sequelize');
const _ = require('lodash');
const moment = require('moment');
const queryUtil = require('../db/queryUtil')
const entryService = require('./entry')
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
	return queryUtil.include(options);
}
function _where(options) {
	return queryUtil.where(options, (where) => {
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
	});
}
function _order(options) {
	return queryUtil.order(options);
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

function _fixRecurrent(data){
	if(data.recurrentTotal == '' || data.recurrentTotal == 0){
		data.recurrentTotal = null;
		data.recurrentCount = null;
	}else if(data.recurrentTotal && !data.recurrentCount){
		data.recurrentCount = 1;
	}
	
}

async function _update(data, id, walletId) {
	try {
		_fixRecurrent(data);
		delete data.walletId;
		delete data.id;
		const affectedRows = await Bill.update(data, {
			where: { id: id, walletId: walletId }
		});
		return affectedRows[0];
	} catch (e) {
		console.log('Update bill error', e);
		throw e;
	}
}

function updateBill(data, id, walletId){
	return _update(data, id, walletId)
}

function getBill(id, walletId) {
	if (walletId) {
		return Bill.findOne({
			where: {
				id: id,
				walletId: walletId
			}
		});
	}
	return Bill.findByPk(id, { attributes: BILL_ATTRIBUTES });
}

function createBill(data){
	_fixRecurrent(data);
	return Bill.create(data);
}



async function setBillAsPayd(amountPaid, paymentDate, id, walletId) {
	const affectedRows = await Bill.update(
		{ amountPaid, paymentDate	},
		{where: { id: id, walletId: walletId }}
	);
	if (affectedRows[0] > 0) {
		const {description, amountPaid, paymentDate} = await getBill(id, walletId);
		await entryService.findOrCreateDebit(description, amountPaid, paymentDate, walletId, 'BILL');
		return true;
	}
	return false;
}


async function totalMonth(walletId, month, year){
	const query = sanitazyQuery(`
	select * from (
		select 
			EXTRACT(year from bill.due_date) as "year",
			EXTRACT(month from bill.due_date) as "month", 	
			sum(bill.amount) as "amount", 	
			sum(bill.amount_paid) as "amountPayed"
		FROM bill
		WHERE wallet_id = :walletId
			AND EXTRACT(month from bill.due_date) = :month
			AND EXTRACT(year from bill.due_date) = :year
		group by EXTRACT(year from bill.due_date), EXTRACT(month from bill.due_date)
  ) as b
  order by 1, 2
	`);

	try {
		
		return await sequelize.query(query, {
			replacements: {
				walletId,
				month, 
				year
			},
			type: sequelize.QueryTypes.SELECT
		});
	} catch (error) {
		console.error('bill.totalMonth - error', error);
		return {
			errors: ['bill.totalMonth.genericError']
		}
	}
}

async function overdueBills(walletId){
	const query = sanitazyQuery(`
		select * from (
			select
				bill.id as "id",
				bill.description as "description",
				bill.due_date as "dueDate",
				bill.amount as "amount",
				CASE
					WHEN bill.due_date < now() THEN 'overdue'
					ELSE 'almost.overdue'
				END 
				AS "state"
			from bill 
			where EXTRACT(month from bill.due_date) = 11
				and bill.payment_date is null
				and bill.wallet_id = :walletId
				and (bill.due_date < now() or bill.due_date <= current_date + INTERVAL '5 day')
	) as b
	order by 3,2
	`);

	try {
		
		return await sequelize.query(query, {
			replacements: {
				walletId
			},
			type: sequelize.QueryTypes.SELECT
		});
	} catch (error) {
		console.error('bill.overdueBills - error', error);
		return {
			errors: ['bill.overdueBills.genericError']
		}
	}
}


module.exports = {
	findAll: findAll,
	BILL_ATTRIBUTES: BILL_ATTRIBUTES,
	generateMonthRecurrentBills: generateMonthRecurrentBills,
	billAmountMonthResume: billAmountMonthResume,
	updateBill: updateBill,
	getBill: getBill,
	createBill: createBill,
	setBillAsPayd : setBillAsPayd,
	totalMonth: totalMonth,
	overdueBills: overdueBills
};