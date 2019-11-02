const INITIAL_STATE = {
	data: {}
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case 'SET_DATA':
			return {...state, data: action.payload};
		default:
			return state;
	}
};