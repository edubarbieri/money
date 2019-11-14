// @ts-nocheck
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import storageSession from 'redux-persist/lib/storage/session'
import promise from "redux-promise";
import multi from "redux-multi";
import thunk from "redux-thunk";
import config from 'config/general.yaml';

import auth from 'reducers/auth/authReducer';
import user from 'reducers/user/userReducer';
import wallet from 'reducers/wallet/walletReducer';
import global from 'reducers/global/globalReducer';
import bills from 'reducers/bills/billsReducer';
import credit from 'reducers/credit/creditReducer';
import debit from 'reducers/debit/debitReducer';
import category from 'reducers/category/categoryReducer';
import importation from 'reducers/import/importReducer';
import { getUrlParameter } from 'services/Util';

const debug = getUrlParameter('debug');

const persistWallet = {
	key: config.appKey + ':wallet',
	storage: storageSession,
	blacklist: ['all', 'created'] 
}

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
	global,
	bills,
	debit,
	credit,
	category,
	importation,
	wallet: persistReducer(persistWallet, wallet),
	auth: persistReducer(persistAuth, auth),
	user: persistReducer(persistUser, user)
});

const devTools = (process.env.NODE_ENV === 'development' || 'true' === debug)
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
