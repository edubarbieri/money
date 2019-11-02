// @ts-nocheck
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import storageSession from 'redux-persist/lib/storage/session'
import promise from "redux-promise";
import config from 'config/general.yaml';
import auth from 'reducers/auth/authReducer';
import user from 'reducers/user/userReducer';
import wallet from 'reducers/wallet/walletReducer';
import global from 'reducers/global/globalReducer';
import multi from "redux-multi";
import thunk from "redux-thunk";


const persistAuth = {
	key: config.appKey + ':auth',
	storage: storageSession,
	blacklist: ['transient'] 
}

const persistUser = {
	key: config.appKey + ':user',
	storage: storageSession
}

const conbinedReducers = combineReducers({
	wallet,
	global,
	auth: persistReducer(persistAuth, auth),
	user: persistReducer(persistUser, user)
});

const devTools = (process.env.NODE_ENV === 'development')
	? window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
	: {};

const store = applyMiddleware(promise, thunk, multi)(createStore)(
	conbinedReducers,
	devTools
);

let rehydratateResolve;
const rehydratated = new Promise((resolve) => {
	rehydratateResolve = resolve;
})

let persistor = persistStore(store, null, rehydratateResolve);

export const Store = store;
export const Persistor = persistor;
export const Rehydratated = rehydratated;
