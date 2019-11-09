import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Header from './Header';
import { route } from 'i18n/bundle';
import Home from 'pages/home/Home';
import CategoryMaintenace from 'pages/maintenance/category/CategoryMaintenace';
import WalletManager from 'pages/wallet/WalletManager';
import ItauExtract from 'pages/import/ItauExtract';
import Bills from 'pages/bills/Bills';

const Container = () => {
    return <div className="col-12 col-md-9 col-xl-10">
        <Header />
        <Switch>
            <Route path={route('wallet.manager')} component={WalletManager} />
            <Route path={route('maintenance.category')} component={CategoryMaintenace} />
            <Route path={route('import.itau.extract')} component={ItauExtract} />
            <Route path={route('opened.bills')} component={Bills} />
            <Route path={route('dashboard')} component={Home} />
            <Route component={Home} />
        </Switch>
    </div>
}

export default Container;