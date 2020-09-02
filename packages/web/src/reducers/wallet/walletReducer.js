const INITIAL_STATE = {
    wallet: {},
    created: {},
    all: []
};

const addTreeOptionsToUserWallet = wallet => {
	if(!wallet.users){
		return;
	}
    for (let index = 0; index < wallet.users.length; index++) {
        const element = wallet.users[index];
        element.value = element.id;
    }
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'SET_WALLET':
            let wallet = action.payload || {};
            addTreeOptionsToUserWallet(wallet);
            return { ...state, wallet: wallet };
        case 'SET_CREATED':
            return { ...state, created: action.payload };
        case 'SET_ALL_WALLET':
            return { ...state, all: action.payload.data };
        default:
            return state;
    }
};
