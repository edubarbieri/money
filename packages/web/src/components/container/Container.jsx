import React from 'react';
import Home from 'pages/home/Home';
import Header from 'components/header/Header';
import Loader from 'components/loader/Loader';
import Extract from 'pages/extract/Extract';
import WalletManager from 'pages/walletManager/WalletManager';
import Account from 'pages/account/Account';
import FutureProjects from 'pages/futureProjects/FutureProjects';
import Receipts from 'pages/receipts/Receipts';
import WalletEditor from 'pages/walletManager/WalletEditor';
import CategoryMaintenance from 'pages/maintenance/category/CategoryMaintenace';
import { Route, Switch} from "react-router-dom";
import route from 'i18n/route';
import Bills from 'pages/bills/Bills';
import { isMobile } from 'service/util';
import Footer from 'components/footer/Footer';
import ItauExtract from 'pages/import/ItauExtract';

const Container = () => {
  return ( 
      <div className="main-container gray-bg">
          <div className="main-header row">
            <Header />
          </div>
          <div className="main-content row">
            <Loader />
            <Switch>
              <Route path={route('extract')} component={Extract} />
              <Route path={route('my.account')} component={Account} />
              <Route path={route('receipts')} component={Receipts} />
              <Route path={route('future.projects')} component={FutureProjects} />
              <Route path={route('wallet.manager')} component={WalletManager} />
              <Route path={route('wallet.create')} component={WalletEditor} />
              <Route path={route('wallet.editor') + '/:id'} component={WalletEditor} />
              <Route path={route('maintenance.category')} component={CategoryMaintenance} />
              <Route path={route('opened.bills')} component={Bills} />
              <Route path={route('import.itau.extract')} component={ItauExtract} />
              <Route component={Home} />
            </Switch>
          </div>
          {isMobile() && <Footer />}
      </div >
  );
}

export default Container;