import React, {useEffect} from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import Login from './Login';
import {useDispatch} from 'react-redux';
import CreateUser from './CreateUser';
import { route } from 'i18n/bundle';
import 'style/auth.scss';
import Loader from 'components/global/Loader';
import { setLoading } from 'reducers/global/globalAction';

const Auth = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setLoading(false));
    }, [dispatch])

    return (
        <BrowserRouter>
            <Loader />
            <div className="auth">
                <div className="auth-container shadow-sm">
                    <Switch>
                        <Route path={route('create.user')} component={CreateUser} />
                        <Route component={Login} />
                    </Switch>
                </div>
            </div>
        </BrowserRouter>
    );
};

export default Auth;
