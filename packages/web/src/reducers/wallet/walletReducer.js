const INITIAL_STATE = {
	wallet: {},
	userWallets: []
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case 'SET_WALLET':
			return {...state, wallet: action.payload};
		case 'SET_USER_WALLETS':
			return {...state, userWallets: action.payload};
		default:
			return state;
	}
};