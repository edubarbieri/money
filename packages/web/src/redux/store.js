import { createStore, combineReducers } from "redux";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import global from "./reducers/global";
import user from "./reducers/user";
import wallet from "./reducers/wallet";
import ux from "./reducers/ux";

const userPersistConfig = {
  key: 'user',
  storage,
};

const interfacePersistConfig = {
  key: 'ux',
  storage
};

const conbinedReducers = combineReducers({
  global,
  wallet,
  user: persistReducer(userPersistConfig, user),
  ux: persistReducer(interfacePersistConfig, ux)
});

let store;
if(process.env.NODE_ENV === 'development'){
  // @ts-ignore
  store = createStore(conbinedReducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__({ trace: true, traceLimit: 25 }));
}else{
  store = createStore(conbinedReducers);
}

let reidratedSuccess;
let reidratedError;
export const reidrated = new Promise((resolve, reject) =>{
  reidratedSuccess = resolve;
  reidratedError = reject;
});

let persistor = persistStore(store, {}, () => {
  reidratedSuccess(store.getState());
});

export const Store = store;
export const Persistor = persistor;
