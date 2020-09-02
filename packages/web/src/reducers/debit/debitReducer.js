const INITIAL_STATE = {
    monthResume: [],
    refresh: '',
    all: [],
    removeDebit: null,
    editDebit: null,
    filter: {},
    totalMonth: {}
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_DEBIT_MONTH_RESUME':
            return { ...state, monthResume: action.payload.data || [] };
        case 'SET_DEBITS':
            return { ...state, all: action.payload.data || [] };
        case 'SET_TOTAL_DEBITS':
            return { ...state, totalMonth: action.payload.data || {} };
        case 'SET_DEBIT_FILTER':
            return { ...state, filter: action.payload };
        case 'SET_REMOVE_DEBIT_CONFIRMATION':
            return { ...state, removeDebit: action.payload };
        case 'SET_EDIT_DEBIT':
            return { ...state, editDebit: action.payload };
        case 'SET_DEBIT_REFRESH':
            return { ...state, refresh: new Date().getTime() };
        default:
            return state;
    }
};
