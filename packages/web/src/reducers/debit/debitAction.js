import { call } from "services/Api";

export const fetchDebitMonthResume = () => {
	return  {
		type: 'SET_DEBIT_MONTH_RESUME',
		payload: call('debit.billAmountMonthResume')
	};
}
