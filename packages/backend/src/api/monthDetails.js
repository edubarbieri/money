const {Debt, Credit} = require('../sequelize')

async function listMonthDetails(req, res){
  const {month, year} = req.params;
  const options = {
    where: { month, year },
    order: [['entryDate', 'ASC']]
  }
  const credits = await Credit.findAll(options);
  const debits = await Debt.findAll(options);
  res.json({
    credits: credits || [], 
    debits: debits || []
  })
}

function availableMonths(req, resp){
  const currentYear = new Date().getFullYear();
  const result = [];
  for (let curYear = currentYear - 2; curYear < currentYear + 2; curYear++){
    for (let month = 1; month <=12; month++) {
      result.push({
        month,
        year: curYear,
        name: (month < 10 ? '0' + month : month) + '/' + curYear
      });
    }
  }
  resp.json(result);
}





module.exports = router => {
  router.get('/month-details/:year/:month', listMonthDetails);
  router.get('/month-details/available-months', availableMonths);
}