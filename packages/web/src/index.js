import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
// @ts-ignore
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { Store, Persistor } from 'reducers/index';
import 'style/global.scss';
import { setUpdateVersion } from 'reducers/global/globalAction';

ReactDOM.render(
    <Provider store={Store}>
        <PersistGate persistor={Persistor}>
                <App />
        </PersistGate>
    </Provider>,
    document.getElementById('root')
);

const updateAppVersion = (data) => {
    console.log(data);
    Store.dispatch(setUpdateVersion())
}

serviceWorker.register({onUpdate: updateAppVersion});
