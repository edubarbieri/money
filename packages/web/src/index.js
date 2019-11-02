import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
// @ts-ignore
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from "react-redux";
import { Store, Persistor } from "reducers/index";
import 'style/global.scss';

ReactDOM.render(
    <Provider store={Store}>
        <PersistGate persistor={Persistor}>
            <App />
        </PersistGate>
    </Provider>
, document.getElementById('root'));

serviceWorker.register();
