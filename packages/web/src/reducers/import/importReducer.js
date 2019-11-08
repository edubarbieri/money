const INITIAL_STATE = {
	itauPreview: [],
	importItau: null
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case 'SET_ITAU_PREVIEW':
			return {...state, itauPreview: action.payload.data};
		case 'SET_CHANGE_ITAU_PREVIEW':
			return {...state, itauPreview: action.payload};
		case 'SET_ITAU_IMPORT':
			return {...state, importItau: action.payload.data};
		case 'SET_CLEAR_ITAU_IMPORT':
			return {...state, importItau: null};
		case 'SET_CLEAR_ITAU_PREVIEW':
			return {...state, itauPreview: []}
		default:
			return state;
	}
};