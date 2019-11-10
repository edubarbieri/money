import { call } from "services/Api";
import { setError } from "reducers/global/globalAction";

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
	return  {
		type: 'SET_EDIT_BILL',
		payload: data
	};
}

export const setPayBill = (data) => {
	return  {
		type: 'SET_PAY_BILL',
		payload: data
	};
}
