const INITIAL_STATE = {
	editPlan: null
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case 'SET_EDIT_PLAN':
			return {...state, editPlan: action.payload};
		default:
			return state;
	}
};