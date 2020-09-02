import { call } from "services/Api";
import { setError, setLoading, setCurrentPage } from "reducers/global/globalAction";
import { setRefreshDebits } from "reducers/debit/debitAction";
import { route } from "i18n/bundle";
import moment from "moment";

export const fetchCreditMonthResume = () => {
	return  {
		type: 'SET_CREDIT_MONTH_RESUME',
		payload: call('credit.creditAmountMonthResume')
	};
}

export const fetchTotalCredits = (data) => {
	return  {
		type: 'SET_TOTAL_CREDITS',
		payload: call('credit.totalMonth', data)
	};
}

export const setGenerateEntryRecurrency = (data) => {
	return dispatch => {
        call('entry.generateMonthRecurrentEntries', data).then(res => {
			if(res.data.errors){
                dispatch(setError('credit', res.data.errors))
                return;
            }
			dispatch(setRefreshCredits());
			dispatch(setRefreshDebits());
		}).catch(err => {
            const result = err.response.data;
            if(result && result.errors){
                dispatch(setError('credit', result.errors))
                return;
            }
        })
    };
}

export const setRefreshCredits = () => {
	return  {
		type: 'SET_CREDIT_REFRESH',
		payload: null
	};
}

export const setCreditsFilter = (data) => {
	return  {
		type: 'SET_CREDIT_FILTER',
		payload: data
	};
}

export const fetchCredits = (data) => {
	return  {
		type: 'SET_CREDITS',
		payload: call('credit.get', data)
	};
}

export const setRemoveCreditConfirmation = (data) => {
	return  {
		type: 'SET_REMOVE_CREDIT_CONFIRMATION',
		payload: data
	};
}

export const setRemoveCredit = (data) => {
	return dispatch => {
        call('credit.remove', {}, [data.id]).then(res => {
			if(res.data.errors){
                dispatch(setError('credit', res.data.errors))
                return;
            }
			dispatch(setRemoveCreditConfirmation(null));
			dispatch(setRefreshCredits());
		}).catch(err => {
            const result = err.response.data;
            if(result && result.errors){
                dispatch(setError('credit', result.errors))
                return;
            }
        })
    };
}

export const setSaveCredit = (data) => {
	return dispatch => {
		const service = data.id ? 'credit.update' : 'credit.add';
        call(service, data, [data.id]).then(res => {
			if(res.data.errors){
                dispatch(setError('credit', res.data.errors))
                return;
			}
			dispatch(setEditCredit(null));
			if(data.redirect){
				dispatch(setLoading(true));
				dispatch(setCurrentPage(route('extract')));
				window.location = route('extract');
				return;
			}
			dispatch(setRefreshCredits());
		}).catch(err => {
			if(!err.response){
				return;
			}
            const result = err.response.data;
            if(result && result.errors){
                dispatch(setError('credit', result.errors))
                return;
            }
        })
    };
}

export const setEditCredit = (data) => {
	if(data){
		data.entryDate =  data.entryDate || moment().format('YYYY-MM-DD');
	}
	return  {
		type: 'SET_EDIT_CREDIT',
		payload: data
	};
}
