const { Debt, Credit } = require('../db/models');
const importItau = require('../services/importItau')
const {promiseSerial} = require('../util/promise');


async function insert(data){
	const Entity = data.isDebt ? Debt: Credit;
	const already = await Entity.findOne({where: { importHash : data.importHash }})
	if(already){
		console.log('Entrada já inserida ', data)
		return null;
	}
	if(data.isDebt){
		data.status = 'PAYD';
	}
	if(data.categoryId === ''){
		data.categoryId = null
	}
	const created = await Entity.create(data);
	return await Entity.findById(created.get('id'))
}



const generatePreviewItau = (req, resp) => {
	const {lines} = req.body;
	const result = importItau.generatePreview(lines || [])
		.then(lines => resp.json(lines))
		.catch((error) => {
			console.error(error)
			resp.status(500).send({errors: [error.toString()]})

		})
}

const save = async (req, res) => {
	const entries = req.body.entries || [];
	const result = {};
	let alreadyImporteds = 0;
	for (const entry of entries) {
		const value = await insert(entry);
		if(value){
			const modelName = value._modelOptions.name.plural;
			if(!result[modelName]){
				result[modelName] = [];
			}
			result[modelName].push(value);
		}else{
			alreadyImporteds = alreadyImporteds + 1
		}
	}
	result.alreadyImporteds = alreadyImporteds;
	res.json(result);
}

module.exports = router => {
	router.post('/import/itau/preview', generatePreviewItau);
	router.post('/import/itau/save', save);
};
