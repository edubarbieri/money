const INITIAL_STATE = {
	token: '',
	transient: true
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case 'SET_TOKEN':
			return {...state, token: action.payload.token, transient: false};
		case 'LOGOUT':
			return {...state, token: '', transient: true};
		default:
			return state;
	}
};