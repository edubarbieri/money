const INITIAL_STATE = {
	monthResume: []
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case 'SET_BILLS_MONTH_RESUME':
			return {...state, monthResume: action.payload.data};
		default:
			return state;
	}
};