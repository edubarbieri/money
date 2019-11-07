import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Header from './Header';
import { route } from 'i18n/bundle';
import Home from 'pages/Home/Home';
import CategoryMaintenace from 'pages/maintenance/category/CategoryMaintenace';

const Container = () => {
    return <div className="col-12 col-md-9 col-xl-10">
        <Header />
        <Switch>
            <Route path={route('maintenance.category')} component={CategoryMaintenace} />
            <Route path={route('dashboard')} component={Home} />
            <Route component={Home} />
        </Switch>
    </div>
}

export default Container;