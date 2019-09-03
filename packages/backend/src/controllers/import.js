const importItau = require('../services/importItau')
const { Router } = require('express');
const walletMiddleware = require('../middleware/wallet');
const {Entry} = require('../db')


const route = Router();
route.use('/import', walletMiddleware);

route.post('/import/itau/preview', (req, res) => {
	const {lines} = req.body;
	importItau.generatePreview(lines || [], req.walletId)
		.then(lines => res.json(lines))
		.catch((error) => {
			console.error(error)
			res.status(500).send({errors: ['import.previewItau.error']})
		})
});
route.post('/import/itau/save', async (req, res) => {
	const typesMap = {
		[Entry.CREDIT]: 'credits',
		[Entry.DEBIT]: 'debits'
	}
	try {
		const entries = req.body.entries || [];
		const result = {};
		let alreadyImporteds = 0;
		for (const entry of entries) {
			const value = await importItau.insert(entry, req.walletId);
			if(value){
				const modelName = typesMap[value.type];
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
		
	} catch (error) {
		console.error(error)
		res.status(500).send({errors: ['import.saveItau.error']})
	}
});

module.exports = route;
