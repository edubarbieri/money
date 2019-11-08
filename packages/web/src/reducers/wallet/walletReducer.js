const INITIAL_STATE = {
	wallet: {},
	created: {},
	all: []
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case 'SET_WALLET':
			return {...state, wallet: action.payload};
		case 'SET_CREATED':
			return {...state, created: action.payload};
		case 'SET_ALL_WALLET':
			return {...state, all: action.payload.data};
		default:
			return state;
	}
};