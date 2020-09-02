import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { route } from 'i18n/bundle';
import Home from 'pages/home/Home';
import CategoryMaintenace from 'pages/maintenance/category/CategoryMaintenace';
import WalletManager from 'pages/wallet/WalletManager';
import ItauExtract from 'pages/import/ItauExtract';
import Bills from 'pages/bills/Bills';
import Extract from 'pages/extract/Extract';
import Account from 'pages/account/Account';
import Header from './Header';
import Planning from 'pages/planning/Planning';

const Container = () => {
    return <div className="col-12 col-md-9 col-xl-10">
        <Header />
        <Switch>
            <Route path={route('wallet.manager')} component={WalletManager} />
            <Route path={route('maintenance.category')} component={CategoryMaintenace} />
            <Route path={route('import.itau.extract')} component={ItauExtract} />
            <Route path={route('opened.bills')} component={Bills} />
            <Route path={route('extract')} component={Extract} />
            <Route path={route('my.account')} component={Account} />
            <Route path={route('planning')} component={Planning} />
            <Route component={Home} />
        </Switch>
    </div>
}

export default Container;