const INITIAL_STATE = {
	data: {},
	lang: 'pt-BR'
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case 'SET_DATA':
			return {...state, data: action.payload};
		case 'SET_LANG':
			return {...state, lang: action.payload};
		default:
			return state;
	}
};