import { call } from "services/Api";

export const fetchBillsMonthResume = () => {
	return  {
		type: 'SET_BILLS_MONTH_RESUME',
		payload: call('bills.billAmountMonthResume')
	};
}
