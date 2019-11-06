const { Router } = require('express');
const walletMiddleware = require('../middleware/wallet');
const entryService = require('../services/entry')

const route = Router();
route.use('/entry', walletMiddleware);


route.post('/entry/generateMonthRecurrentEntries', (req, res) => {
	const {year, month} = req.body;
	if(!year || !month){
		return res.status(400).send({ errors: ['entry.generateMonthRecurrentEntries.invalidParams'] });
	}
	entryService.generateMonthRecurrentEntries(req.walletId, parseInt(month), parseInt(year))
		.then(r => res.json(r));
});


module.exports = route;