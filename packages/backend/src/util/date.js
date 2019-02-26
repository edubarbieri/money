const moment = require('moment');
const formateDate = date => {
	const day = date.getDate();
	const month = date.getMonth() + 1;
	return (
		(day > 9 ? day : '0' + day) +
		'/' +
		(month > 9 ? month : '0' + month) +
		'/' +
		date.getFullYear()
	);
};

const convertToDate = strDt =>{
	return moment.tz(strDt, 'America/Sao_Paulo').toDate();
};

module.exports = {
	formateDate,
	convertToDate
};
