const INITIAL_STATE = {
    monthResume: [],
    refresh: '',
    all: [],
    removeCredit: null,
    editCredit: null,
    filter: {},
    totalMonth: {}
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_CREDIT_MONTH_RESUME':
            return { ...state, monthResume: action.payload.data || [] };
        case 'SET_CREDITS':
            return { ...state, all: action.payload.data || [] };
        case 'SET_TOTAL_CREDITS':
            return { ...state, totalMonth: action.payload.data || {} };
        case 'SET_CREDIT_FILTER':
            return { ...state, filter: action.payload };
        case 'SET_REMOVE_CREDIT_CONFIRMATION':
            return { ...state, removeCredit: action.payload };
        case 'SET_EDIT_CREDIT':
            return { ...state, editCredit: action.payload };
        case 'SET_CREDIT_REFRESH':
            return { ...state, refresh: new Date().getTime() };
        default:
            return state;
    }
};
