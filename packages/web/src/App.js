import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from 'components/global/Sidebar';
import Container from 'components/global/Container';
import Auth from 'pages/Auth/Auth';
import { Rehydratated, Store } from './reducers';
import { callValidateToken } from 'reducers/auth/authAction';
import Loader from 'components/global/Loader';
import Header from 'components/global/Header';
import {BrowserRouter} from 'react-router-dom';

function App() {
    const transient = useSelector(state => state.auth.transient);
    const initialized = useSelector(state => state.global.initialized);
    const dispatch = useDispatch();

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
                <Header />
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
