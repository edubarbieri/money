const INITIAL_STATE = {
	loading: true,
	initialized: false,
	error: {
		auth: [],
		generic: [],
	}
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case 'SET_LOADING':
			return {...state, loading: action.payload};
		case 'SET_INITIALIZED':
			return {...state, initialized: true};
		case 'SET_AUTH_ERROR':
			return {...state, error: {...state.error, auth: action.payload}};
		case 'SET_GENERIC_ERROR':
			return {...state, error: {...state.error, generic: action.payload}};
		default:
			return state;
	}
};