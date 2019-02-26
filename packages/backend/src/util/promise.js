/*
 * promiseSerial resolves Promises sequentially.
 * @example
 * const urls = ['/url1', '/url2', '/url3']
 * const funcs = urls.map(url => () => $.ajax(url))
 *
 * promiseSerial(funcs)
 *   .then(console.log)
 *   .catch(console.error)
 */
module.exports.promiseSerial = tasks =>{
	return tasks.reduce((promiseChain, currentTask) => {
		return promiseChain.then(chainResults =>
			currentTask.then(currentResult =>
				[ ...chainResults, currentResult ]
			)
		);
	}, Promise.resolve([]));
};
