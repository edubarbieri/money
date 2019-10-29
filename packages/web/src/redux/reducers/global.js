import types from '../globalActions';

const initialState = {
    activePage: '/',
    loading: false,
    width: window.innerWidth,
    started: false,
    refresh: {type: '', value: ''}
}

export default function (state = initialState, action) {
    switch (action.type) {
        case types.SET_ACTIVE_PAGE:{
            return { ...state, activePage: action.payload };
        }
        case types.SET_LOADING:{
            return { ...state, loading: action.payload };
        }
        case types.WINDOW_WIDTH:{
            return { ...state, width: action.payload };
        }
        case types.SET_STARTED:{
            return { ...state, started: action.payload };
        }
        case types.SET_REFRESH:{
            return { ...state, refresh: action.payload };
        }
        default:
            return state;
    }
}