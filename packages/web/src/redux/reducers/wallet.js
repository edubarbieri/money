import types from '../walletActions';

const initialState = {
    members: [],
    wallets: [],
    categories: []
}

export default function(state = initialState, action) {
  switch (action.type) {
    case types.SET_WALLET_MEMBERS: {
      return {...state, members: action.payload};
    }
    case types.SET_WALLETS: {
      return {...state, wallets: action.payload};
    }
    case types.SET_CATEGORIES: {
      return {...state, categories: action.payload};
    }
    default:
      return state;
  }
}