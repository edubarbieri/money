import { call } from "services/Api";

export const fetchCreditMonthResume = () => {
	return  {
		type: 'SET_CREDIT_MONTH_RESUME',
		payload: call('credit.billAmountMonthResume')
	};
}
