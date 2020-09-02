import { call } from "services/Api";
import { setError, setLoading, setCurrentPage } from "reducers/global/globalAction";
import { route } from "i18n/bundle";
import moment from "moment";

export const fetchBillsMonthResume = () => {
	return  {
		type: 'SET_BILLS_MONTH_RESUME',
		payload: call('bills.billAmountMonthResume')
	};
}

export const setGenerateBillRecurrency = (data) => {
	return dispatch => {
        call('bills.generateMonthRecurrentBills', data).then(res => {
			if(res.data.errors){
                dispatch(setError('bill', res.data.errors))
                return;
            }
			dispatch(setRefreshBills());
		}).catch(err => {
            const result = err.response.data;
            if(result && result.errors){
                dispatch(setError('bill', result.errors))
                return;
            }
        })
    };
}

export const setRefreshBills = () => {
	return  {
		type: 'SET_BILL_REFRESH',
		payload: null
	};
}

export const fetchBills = (data) => {
	return  {
		type: 'SET_BILLS',
		payload: call('bills.get', data)
	};
}

export const fetchOverdueBills = (data) => {
	return  {
		type: 'SET_OVERDUE_BILLS',
		payload: call('bills.overdueBills', data)
	};
}

export const fetchTotalBills = (data) => {
	return  {
		type: 'SET_TOTAL_BILLS',
		payload: call('bills.totalMonth', data)
	};
}

export const setRemoveBillConfirmation = (data) => {
	return  {
		type: 'SET_REMOVE_BILL_CONFIRMATION',
		payload: data
	};
}

export const setRemoveBill = (data) => {
	return dispatch => {
        call('bills.remove', {}, [data.id]).then(res => {
			if(res.data.errors){
                dispatch(setError('bill', res.data.errors))
                return;
            }
			dispatch(setRemoveBillConfirmation(null));
			dispatch(setRefreshBills());
		}).catch(err => {
            const result = err.response.data;
            if(result && result.errors){
                dispatch(setError('bill', result.errors))
                return;
            }
        })
    };
}

export const setSaveBill = (data) => {
	return dispatch => {
		const service = data.id ? 'bills.update' : 'bills.add';
        call(service, data, [data.id]).then(res => {
			if(res.data.errors){
                dispatch(setError('bill', res.data.errors))
                return;
			}
			dispatch(setEditBill(null));
			if(data.redirect){
				dispatch(setLoading(true));
				dispatch(setCurrentPage(route('opened.bills')));
				window.location = route('opened.bills');
				return;
			}
			dispatch(setPayBill(null));
			dispatch(setRefreshBills());
		}).catch(err => {
			if(!err.response){
				return;
			}
            const result = err.response.data;
            if(result && result.errors){
                dispatch(setError('bill', result.errors))
                return;
            }
        })
    };
}

export const setEditBill = (data) => {
	if(data){
		data.dueDate =  data.dueDate || moment().format('YYYY-MM-DD');
	}
	return  {
		type: 'SET_EDIT_BILL',
		payload: data
	};
}

export const setPayBill = (data) => {
	if(data){
		data.paymentDate =  data.paymentDate || moment().format('YYYY-MM-DD');
	}
	return  {
		type: 'SET_PAY_BILL',
		payload: data
	};
}
