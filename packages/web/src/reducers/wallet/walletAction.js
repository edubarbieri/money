import { call } from "services/Api";
import { setRefresh } from "reducers/global/globalAction";

export const setWallet = (data) => {
	return dispatch => {
        dispatch({type: 'SET_WALLET', payload: data});
		dispatch(setRefresh());
    };
}

export const fetchWallets = () => {
	return  {
		type: 'SET_ALL_WALLET',
		payload: call('wallet.getAll')
	};
}
