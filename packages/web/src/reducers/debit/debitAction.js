import { call } from "services/Api";
import { setError, setLoading } from "reducers/global/globalAction";
import { route } from "i18n/bundle";
import moment from "moment";

export const fetchDebitMonthResume = () => {
	return  {
		type: 'SET_DEBIT_MONTH_RESUME',
		payload: call('debit.debitAmountMonthResume')
	};
}


export const setRefreshDebits = () => {
	return  {
		type: 'SET_DEBIT_REFRESH',
		payload: null
	};
}


export const setDebitFilter = (data) => {
	return  {
		type: 'SET_DEBIT_FILTER',
		payload: data
	};
}

export const fetchDebits = (data) => {
	return  {
		type: 'SET_DEBITS',
		payload: call('debit.get', data)
	};
}

export const setRemoveDebitConfirmation = (data) => {
	return  {
		type: 'SET_REMOVE_DEBIT_CONFIRMATION',
		payload: data
	};
}

export const fetchTotalDebits = (data) => {
	return  {
		type: 'SET_TOTAL_DEBITS',
		payload: call('debit.totalMonth', data)
	};
}

export const setRemoveDebit = (data) => {
	return dispatch => {
        call('debit.remove', {}, [data.id]).then(res => {
			if(res.data.errors){
                dispatch(setError('debit', res.data.errors))
                return;
            }
			dispatch(setRemoveDebitConfirmation(null));
			dispatch(setRefreshDebits());
		}).catch(err => {
            const result = err.response.data;
            if(result && result.errors){
                dispatch(setError('debit', result.errors))
                return;
            }
        })
    };
}

export const setSaveDebit = (data) => {
	return dispatch => {
		const service = data.id ? 'debit.update' : 'debit.add';
        call(service, data, [data.id]).then(res => {
			if(res.data.errors){
                dispatch(setError('debit', res.data.errors))
                return;
			}
			dispatch(setEditDebit(null));
			if(data.redirect){
                dispatch(setLoading(true));
				window.location = route('extract');
				return;
			}
			dispatch(setRefreshDebits());
		}).catch(err => {
			if(!err.response){
				return;
			}
            const result = err.response.data;
            if(result && result.errors){
                dispatch(setError('debit', result.errors))
                return;
            }
        })
    };
}

export const setEditDebit = (data) => {
	if(data){
		data.entryDate =  data.entryDate || moment().format('YYYY-MM-DD');
	}
	return  {
		type: 'SET_EDIT_DEBIT',
		payload: data
	};
}
