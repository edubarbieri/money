// import { call } from "services/Api";
// import { setError } from "reducers/global/globalAction";

export const setEditPlan = (data) => {
	return {
		type: 'SET_EDIT_PLAN',
		payload: data
	}
}