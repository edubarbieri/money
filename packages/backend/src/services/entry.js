const { Entry, Category, paginatedQuery , queryUtil, sanitazyQuery, sequelize} = require('../db');
const _ = require('lodash');
const moment = require('moment');
const ENTRY_ATTRIBUTES = [
	'id',
	'description',
	'entryDate',
	'amount',
	'recurrent',
	'recurrentTotal',
	'recurrentCount',
	'categoryId'
];

const defaultsFindAll = {
	withCategory: false,
	withUser: false,
	order: 'entryDate_ASC',
	page: 1,
	pageSize: 15
};
function _fixRecurrent(data){
	if(data.recurrentTotal == '' || data.recurrentTotal == 0){
		data.recurrentTotal = null;
		data.recurrentCount = null;
	}else if(data.recurrentTotal && !data.recurrentCount){
		data.recurrentCount = 1;
	}
}


function _createEntry(data) {
	_fixRecurrent(data);
	return Entry.create(data)
		.then(entry => _.pick(entry, ENTRY_ATTRIBUTES));
}

function _updateEntry(data, id, walletId, type) {
	delete data.walletId;
	delete data.type;
	delete data.id;
	_fixRecurrent(data);
	return Entry.update(data, {
		where: {
			id: id,
			walletId: walletId,
			type: type
		}
	}).then(affectedRows => affectedRows[0]);
}

function _deleteEntry(id, walletId, type) {
	return Entry.destroy({
		where: {
			id: id,
			walletId: walletId,
			type: type
		}
	});
}

function _getEntry(id, walletId, type) {
	return Entry.findOne({
		attributes: ENTRY_ATTRIBUTES,
		where: { id, walletId, type },
		include: {
			model: Category,
			attributes: ['id', 'name']
		}
	});
}

function _findAll(options, type){
	const finalOptions = { ...defaultsFindAll, ...options };
	return paginatedQuery(Entry, {
		attributes: ENTRY_ATTRIBUTES,
		where: queryUtil.where(finalOptions, w => w.type = type, 'entryDate'),
		include: queryUtil.include(finalOptions),
		order: [queryUtil.order(finalOptions)]
	}, finalOptions.page, finalOptions.pageSize);
}

function createDebit(data, walletId) {
	return _createEntry({
		...data,
		walletId: walletId,
		type: Entry.DEBIT
	});
}

function createCredit(data, walletId) {
	return _createEntry({
		...data,
		walletId: walletId,
		type: Entry.CREDIT
	});
}

async function _entryAmountMonthResume(walletId, type){
	const query = sanitazyQuery(`
		select * from (
			select 
				EXTRACT(year from entry.entry_date) as "year",
				EXTRACT(month from entry.entry_date) as "month", 	
				sum(entry.amount) as "amount"
			FROM entry
			WHERE
			  entry.entry_date >= date_trunc('month', current_date - interval '6' month)
				AND entry.wallet_id = :walletId
				AND entry.type = :type
			group by EXTRACT(year from entry.entry_date), EXTRACT(month from entry.entry_date)
		) as b
		order by 1, 2
	`);

	try {
		
		return await sequelize.query(query, {
			replacements: {
				walletId, type
			},
			type: sequelize.QueryTypes.SELECT
		});
	} catch (error) {
		console.error('_entryAmountMonthResume - error', error);
		return {
			errors: ['entry.entryAmountMonthResume.genericError']
		}
	}
}

function updateDebit(data, id, walletId) {
	return _updateEntry(data, id, walletId, Entry.DEBIT);
}
function updateCredit(data, id, walletId) {
	return _updateEntry(data, id, walletId, Entry.CREDIT);
}
function deleteDebit(id, walletId) {
	return _deleteEntry(id, walletId, Entry.DEBIT);
}
function deleteCredit(id, walletId) {
	return _deleteEntry(id, walletId, Entry.CREDIT);
}
function getCredit(id, walletId) {
	return _getEntry(id, walletId, Entry.CREDIT);
}
function getDebit(id, walletId) {
	return _getEntry(id, walletId, Entry.DEBIT);
}
function findAllDebits(options) {
	return _findAll(options, Entry.DEBIT);
}
function findAllCredits(options) {
	return _findAll(options, Entry.CREDIT);
}

function creditAmountMonthResume(walletId){
	return _entryAmountMonthResume(walletId, Entry.CREDIT)
}

function debitAmountMonthResume(walletId){
	return _entryAmountMonthResume(walletId, Entry.DEBIT)
}

async function findOrCreateDebit(description, amount, date, walletId, source) {
	const debit = await Entry.findOne({
		attributes: ['id'],
		where: {
			amount: amount,
			entryDate: date,
			walletId: walletId,
			type: Entry.DEBIT
		}
	});
	if(debit){
		return {status: 'ALREADY_EXISTS'}
	}
	const newDebit = await createDebit({
		description: description,
		amount: amount,
		entryDate: date,
		importSource: source
	}, walletId);

	return {
		status: 'CREATED',
		entry: newDebit
	};
}


async function generateMonthRecurrentEntries(walletId, month, year){
	const query = sanitazyQuery(`
	INSERT INTO entry
	(id, description, entry_date, amount, "type", recurrent, recurrent_total, recurrent_count, category_id, wallet_id, user_id, source_entry_id, created_at, updated_at)
	select
		uuid_generate_v4(), 
		entry.description, 
		entry.entry_date + INTERVAL '1 month' entry_date, 
		entry.amount, 
		entry.type, 
		true recurrent, 
		entry.recurrent_total, 
		entry.recurrent_count + 1, 
		category_id, 
		wallet_id, 
		user_id, 
		entry.id, 
		current_timestamp created_at,
		current_timestamp updated_at
	from
		entry
	where
		entry.recurrent = true
		and (entry.recurrent_count is null or entry.recurrent_count < entry.recurrent_total)
		and extract(month from entry.entry_date) = :prevMonth
		and extract(year from entry.entry_date) = :prevYear
		and entry.wallet_id = :walletId 
		AND NOT EXISTS (
			select 1 from entry b2
			where 
			b2.source_entry_id = entry.id
			AND EXTRACT(month from b2.entry_date) = :curMonth
			AND EXTRACT(year from b2.entry_date) = :curYear
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
			entriesCreated: resp[1]
		}
	} catch (error) {
		console.error('generateMonthRecurrentEntries - error', error);
		return {
			errors: ['entry.generateMonthRecurrentEntries.genericError']
		}
	}
}

module.exports = {
	createDebit: createDebit,
	createCredit: createCredit,
	updateDebit: updateDebit,
	updateCredit: updateCredit,
	deleteDebit: deleteDebit,
	deleteCredit: deleteCredit,
	getCredit: getCredit,
	getDebit: getDebit,
	findAllDebits: findAllDebits,
	findAllCredits: findAllCredits,
	creditAmountMonthResume: creditAmountMonthResume,
	debitAmountMonthResume : debitAmountMonthResume,
	ENTRY_ATTRIBUTES: ENTRY_ATTRIBUTES,
	findOrCreateDebit: findOrCreateDebit,
	generateMonthRecurrentEntries: generateMonthRecurrentEntries
};
