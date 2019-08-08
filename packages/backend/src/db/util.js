
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

const paginatedQuery = (entity, options, page = 1, itemsPerPage = 10) => {
	return new Promise((resolve, reject) => {
		entity.count(options).then(count => {
			if(count === 0){
				resolve({
					page: 0,
					totalItems: 0,
					totalPages: 0,
					items: []
				});
				return;
			}
			const totalPages = Math.ceil(count / itemsPerPage);
			if(page > totalPages){
				page = totalPages;
			}
			const offset = itemsPerPage * (page - 1);

			entity.findAll({
				...options,
				limit: itemsPerPage,
				offset
			}).then(result => {
				resolve({
					totalPages,
					page,
					itemsPerPage,
					totalItems: count,
					items: result ||[],
				});
			}).catch(e => reject(e));
		}).catch(e => reject(e));
	});
};

module.exports = {
  formatDbError, paginatedQuery
}