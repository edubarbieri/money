import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from 'components/global/Sidebar';
import Container from 'components/global/Container';
import Auth from 'pages/auth/Auth';
import { Rehydratated, Store } from './reducers';
import { callValidateToken } from 'reducers/auth/authAction';
import Loader from 'components/global/Loader';
import {BrowserRouter} from 'react-router-dom';
import _ from 'lodash';
import { setResize } from 'reducers/global/globalAction';
import WalletMessage from 'components/wallet/WalletMessage';

function App() {
    const transient = useSelector(state => state.auth.transient);
    const initialized = useSelector(state => state.global.initialized);
    const dispatch = useDispatch();

    useEffect(() => {
        const debounceDispatch = _.debounce(() =>{dispatch(setResize())}, 66);
        window.addEventListener('resize', debounceDispatch);
    }, [dispatch]);

    useEffect(() => {
        Rehydratated.then(() => {
            const state = Store.getState()
            dispatch(callValidateToken(state.auth.token));
        });
    }, [dispatch]);

    const renderApp = () => {
        return transient ? (
            <Auth />
        ) : (
            <BrowserRouter>
                <Loader />
                <WalletMessage />
                <div className="container-fluid">
                    <div className="row flex-xl-nowrap">
                        <Sidebar />
                        <Container />
                    </div>
                </div>
            </BrowserRouter>
        );
    };

    return initialized ? renderApp() : <Loader />;
}

export default App;
