import React, {lazy, Suspense } from 'react';
import Header from 'components/header/Header';
import Loader from 'components/loader/Loader';
import { Route, Switch} from "react-router-dom";
import route from 'i18n/route';
import Bills from 'pages/bills/Bills';
import { isMobile } from 'service/util';
import Footer from 'components/footer/Footer';
import LoaderFragment from 'components/loader/LoaderFragment';

const ItauExtract = lazy(() => import('pages/import/ItauExtract'));
const Extract = lazy(() => import('pages/extract/Extract'));
const WalletManager = lazy(() => import('pages/walletManager/WalletManager'));
const Account = lazy(() => import('pages/account/Account'));
const WalletEditor = lazy(() => import('pages/walletManager/WalletEditor'));
const Home = lazy(() => import('pages/home/Home'));
const CategoryMaintenance = lazy(() => import('pages/maintenance/category/CategoryMaintenace'));

const Container = () => {
  return ( 
      <div className="main-container gray-bg">
          <div className="main-header row">
            <Header />
          </div>
          <div className="main-content row">
            <Loader />
            <Suspense fallback={<LoaderFragment />}>
              <Switch>
                <Route path={route('extract')} component={Extract} />
                <Route path={route('my.account')} component={Account} />
                <Route path={route('wallet.manager')} component={WalletManager} />
                <Route path={route('wallet.create')} component={WalletEditor} />
                <Route path={route('wallet.editor') + '/:id'} component={WalletEditor} />
                <Route path={route('maintenance.category')} component={CategoryMaintenance} />
                <Route path={route('opened.bills')} component={Bills} />
                <Route path={route('import.itau.extract')} component={ItauExtract} />
                <Route component={Home} />
              </Switch>
            </Suspense>
          </div>
          {isMobile() && <Footer />}
      </div >
  );
}

export default Container;