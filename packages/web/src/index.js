import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { Store, Persistor } from './redux/store';
import {init as initSdk} from './sdk';

ReactDOM.render(
  <Provider store={Store}>
    <PersistGate loading={null} persistor={Persistor}>
      <App /> 
    </PersistGate>
  </Provider>
, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
initSdk();
