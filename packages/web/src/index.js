import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
// @ts-ignore
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { Store, Persistor } from 'reducers/index';
import 'style/global.scss';
import ErrorBoundary from 'components/global/ErrorBoundary';

ReactDOM.render(
    <Provider store={Store}>
        <PersistGate persistor={Persistor}>
            <ErrorBoundary>
                <App />
            </ErrorBoundary>
        </PersistGate>
    </Provider>,
    document.getElementById('root')
);

serviceWorker.register({onUpdate : (data) => window.alert('update sw: ' + data)});
