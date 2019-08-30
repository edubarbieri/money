
const formatDbError = (res, seqError) => {
	const errors = [];
	if(seqError.name === 'SequelizeValidationError'){
		const errorMessages = seqError.errors.map(error => {
			return `O valor "${error.value}" informado para a propriedade ${error.path} é inválido.`;
		});
		errors.push(errorMessages);

	}else if(seqError.name === 'SequelizeConnectionRefusedError'|| seqError.name === 'ConnectionTimedOutError'){
		errors.push('Erro de conexão com o banco de dados. Por favor, tente novamente, se o erro persistir entre em contato com o administrador do sistema.');
		console.error(seqError);
	}else if(seqError.message){
		errors.push(seqError.message);
		console.error(seqError);
	}

	res.status(500).send({
		errors: errors
	});
};

const paginatedQuery = (entity, options, page = 1, pageSize = 20) => {
	return new Promise((resolve, reject) => {
		const countOptions = {...options};
		delete countOptions.attributes;
		entity.count(countOptions).then(count => {
			if(count === 0){
				resolve({
					page: 0,
					totalPages: 0,
					pageSize: pageSize,
					totalItems: 0,
					data: []
				});
				return;
			}
			const totalPages = Math.ceil(count / pageSize);
			if(page > totalPages){
				page = totalPages;
			}
			const offset = pageSize * (page - 1);

			entity.findAll({
				...options,
				limit: pageSize,
				offset
			}).then(result => {
				resolve({
					page,
					totalPages,
					pageSize: pageSize,
					totalItems: count,
					data: result ||[],
				});
			}).catch(e => reject(e));
		}).catch(e => reject(e));
	});
};

function sanitazyQuery(query) {
	return query.replace(/\n/g, '').replace(/\s\s+/g, ' ');
}
module.exports = {
  formatDbError, paginatedQuery, sanitazyQuery
}