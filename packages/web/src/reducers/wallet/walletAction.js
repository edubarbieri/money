import { call } from "services/Api";

export const setWallet = (data) => {
	return  {
		type: 'SET_WALLET',
		payload: data
	};
}

export const fetchWallets = () => {
	return  {
		type: 'SET_ALL_WALLET',
		payload: call('wallet.getAll')
	};
}
