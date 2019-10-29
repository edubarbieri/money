import types from '../userActions';

const initialState = {
    transient: true,
    activeWallet: {},
    profile: {},
    token: '',
    prefferedLang: ''
}

export default function(state = initialState, action) {
  switch (action.type) {
    case types.SET_USER: {
      return action.payload;
    }
    case types.SET_TRANSIENT: {
      return {...state, transient: action.payload};
    }
    case types.SET_PROFILE: {
      return {...state, profile: action.payload};
    }
    case types.SET_ACTIVE_WALLET: {
      return {...state, activeWallet: action.payload};
    }
    case types.SET_TOKEN: {
      return {...state, token: action.payload};
    }
    case types.SET_LANG: {
      return {...state, prefferedLang: action.payload};
    }
    default:
      return state;
  }
}