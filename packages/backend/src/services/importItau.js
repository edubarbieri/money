const moment = require('moment');
const crypto = require('crypto');
const { Category, Entry } = require('../db');
const _ = require('lodash');
const entryService = require('./entry')

async function generatePreview(rawLines, walletId) {
	const result = [];
	const categories = await Category.findAll({ where: { walletId } });
	for (const line of rawLines) {
		if (_.isEmpty(line)) {
			continue;
		}
		const data = processLine(line, categories);
		const withSameHash = result.filter(it => it.importHash === data.importHash)
			.length;
		if (withSameHash > 0) {
			data.importHash = data.importHash + '_' + (withSameHash - 1);
		}
		result.push(data);
	}
	return result;
}

function processLine(line, categories) {
	const split = line.split(';');

	if (split.length !== 3) {
		return;
	}
	const description = split[1].trim();
	let amount = parseFloat(split[2].replace(',', '.').trim());
	let isExpense = false;
	if (amount < 0) {
		isExpense = true;
		amount = amount * -1;
	}
	const category = categoryFromName(categories, description);
	let categoryId = '';
	if (category) {
		categoryId = category.id;
	}
	return {
		description,
		entryDate: parseDate(split[0]),
		importHash: crypto
			.createHash('md5')
			.update(line)
			.digest('hex'),
		isExpense,
		amount,
		categoryId
	};
}

function parseDate(strDate) {
	//str date is in formate 03/09/2018;
	const split = strDate.split('/');
	const date = moment(`${split[2]}-${split[1]}-${split[0]}`).format(
		'YYYY-MM-DD'
	);
	return date;
}

function categoryFromName(categories, name) {
	for (const category of categories) {
		if (matchAny(category.keywords, name)) {
			return category;
		}
	}
	return null;
}

function matchAny(keywords, name) {
	if (!keywords || keywords.length === 0) {
		return false;
	}
	return name.toLowerCase().match(keywords.join('|').toLowerCase()) !== null;
}

async function insert(data, walletId) {
	const type = data.isExpense ? Entry.DEBIT : Entry.CREDIT;
	const already = await Entry.findOne({
		where: { 
			importHash: data.importHash, 
			walletId : walletId,
			type: type
		}
	});
	if (already) {
		console.log('Entrada já inserida ', data);
		return null;
	}
	if (data.categoryId === '') {
		data.categoryId = null;
	}
	const created = await Entry.create({
		...data,
		walletId : walletId,
		type: type
	});
	return await Entry.findByPk(created.get('id'),{
		attributes: [...entryService.ENTRY_ATTRIBUTES, 'type']
	});
}

module.exports = {
	generatePreview: generatePreview,
	insert: insert
};
