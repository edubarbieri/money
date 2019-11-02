import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import Header from './Header';
import { route } from 'i18n/bundle';
import Home from 'pages/Home/Home';

const Container = () => {
    return <div className="col-12 col-md-9 col-xl-10">
        <Header />
        <BrowserRouter>
            <Switch>
                <Route path={route('dashboard')} component={Home} />
                <Route component={Home} />
            </Switch>
        </BrowserRouter>
    </div>
}

export default Container;