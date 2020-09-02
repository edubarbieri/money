const INITIAL_STATE = {
	monthResume: [],
	refresh: '',
	all: [],
	removeBill: null,
	editBill: null,
	payBill: null,
	totalMonth: {},
	overdueBills: []
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case 'SET_BILLS_MONTH_RESUME':
			return {...state, monthResume: action.payload.data || []};
		case 'SET_BILLS':
			return {...state, all: action.payload.data || []};
		case 'SET_TOTAL_BILLS':
			return {...state, totalMonth: action.payload.data || {}};
		case 'SET_OVERDUE_BILLS':
			return {...state, overdueBills: action.payload.data || {}};
		case 'SET_REMOVE_BILL_CONFIRMATION':
			return {...state, removeBill: action.payload};
		case 'SET_EDIT_BILL':
			return {...state, editBill: action.payload};
		case 'SET_PAY_BILL':
			return {...state, payBill: action.payload};
		case 'SET_BILL_REFRESH':
			return {...state, refresh:new Date().getTime()};
		default:
			return state;
	}
};