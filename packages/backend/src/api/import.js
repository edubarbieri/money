const { Debt, Credit } = require('../sequelize');
const crypto = require('crypto');
const moment = require('moment');

const {promiseSerial} = require('../util/promise');

const importTxt = (req, res) => {
	const lines = req.body.lines || [];
	const promises = [];
	lines.forEach(line => {
		const p = processLine(line);
		if(p){
			promises.push(p);
		}
	});
	promiseSerial(promises).then(results => {
		const result = {};
		results.forEach(value => {
			if(value){
				const modelName = value._modelOptions.name.plural;
				if(!result[modelName]){
					result[modelName] = [];
				}
				result[modelName].push(value);
			}
		});
		res.json(result);
	});
};

function processLine(line){
	const split = line.split(';');

	if(split.length !== 3){
		return;
	}
	const date = parseDate(split[0]);
	const hash = crypto.createHash('md5').update(line).digest('hex');
	const name = split[1].trim();
	let value = parseFloat(split[2].replace(',', '.').trim());
	let isDebt = false;
	if(value < 0){
		isDebt = true;
		value = value * -1;
	}
	const insertDate = { ...date, importHash: hash, name: name, value: value};

	return insert(isDebt, insertDate);
}
function parseDate(strDate){
	//str date is in formate 03/09/2018;
	const split = strDate.split('/');
	const date = moment.tz(`${split[2]}-${split[1]}-${split[0]}`, 'America/Sao_Paulo').toDate();
	return {
		entryDate: date,
		month: parseInt(split[1]),
		year: parseInt(split[2])
	};
}
function insert(isDebt, data){
	return new Promise(resolve => {
		const Entity = isDebt ? Debt: Credit;
		Entity.findOne({
			where: { importHash : data.importHash }
		}).then(entry => {
			if(entry){
				resolve();
				return;
			}
			if(isDebt){
				data.status = 'PAYD';
			}
			data.tag = parseTag(data.name);
			Entity.create(data).then(created => {
				Entity.findById(created.get('id')).then(d => {
					resolve(d);
				});
			});

		});

	});
}

function parseTag(name){
	if(name.match(/POSTO|PORTO SEGURO|MECANICA/)){
		return 'carro';
	}
	if(name.match(/ZAFFARI|MERCADO|COMERCIAL Z|STOK CENTER|BOURBON|VERDURAO/)){
		return 'mercado';
	}
	if(name.match(/PASSARINHO|SAN MARINO|PORTO FILES|CHURRASCARI|BELLA VENET|PIZZARIA|SHEIK LANCH|CACHORRAO|MC DONALDS|SAHIB|SUBWAY|RECEITA CAS/)){
		return 'alimentacao';
	}
	if(name.match(/NETFLIX|CORSAN|RGE|ALUGUEL/)){
		return 'fixa';
	}
	if(name.match(/CERTAGRO/)){
		return 'pets';
	}
	if(name.match(/ACADEMIA/)){
		return 'academia';
	}
	if(name.match(/PANVEL|FARMACIA/)){
		return 'farmacia';
	}
	if(name.match(/PRE-PAGO/)){
		return 'celular';
	}
	if(name.match(/ˆTAR|REND PAGO APLIC/)){
		return 'banco';
	}
	if(name.match(/SAQUE/)){
		return 'saque';
	}
	if(name.match(/SALARIO/)){
		return 'salario';
	}
}

module.exports = router => {
	router.post('/import/txt', importTxt);
};
