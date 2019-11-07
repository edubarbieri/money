const INITIAL_STATE = {
	loading: true,
	initialized: false,
	currentPage: '',
	toogle: '',
	refresh: '',
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
		case 'SET_TOOGLE':
			const toogle = action.payload === state.toogle ? '' : action.payload;
			return {...state, toogle};
		case 'SET_CURRENT_PAGE':
			return {...state, currentPage: action.payload};
		case 'SET_AUTH_ERROR':
			return {...state, error: {...state.error, auth: action.payload}};
		case 'SET_GENERIC_ERROR':
			return {...state, error: {...state.error, generic: action.payload}};
		case 'SET_REFRESH':
			return {...state, refresh: new Date().getTime()};
		default:
			return state;
	}
};