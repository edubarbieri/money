import React, { useState } from 'react';
import 'sass/sidebar';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import bundle from 'i18n/bundle';
import route from 'i18n/route';
import Footer from 'components/footer/Footer';
import { isMobile } from 'service/util';

const SideBar = () => {
  const activePage = useSelector(state => state.global.activePage);
  const [expandedMaintenance, setExpandedMaintenance] = useState(false);
  const [expandedImport, setExpandedImport] = useState(false);
  const [collapseSidebar, setCollapseSidebar] = useState(true);

  return (
    <div className="page-sidebar">
      <header className="site-header">
        <a href="/">
          <div className="site-logo">
            <img src="/img/lh-large.png" alt="Site logo" />
          </div>
        </a>
        <div className="sidebar-mobile-menu visible-xs" onClick={() => setCollapseSidebar(!collapseSidebar)}>
          <i className="icon-menu mobile-menu-icon fas fa-bars"></i>
        </div>
      </header>
      <ul id="side-nav" className={(collapseSidebar) ? 'main-menu navbar-collapse collapse' : 'main-menu navbar-collapse collapse in'}>
        <li className={activePage === '/' ? 'active' : ''}>
          <Link to="/" onClick={() => setCollapseSidebar(!collapseSidebar)}>
            <i className="fas fa-chart-line"></i>
            <span className="title">{bundle('dashboard')}</span>
          </Link>
        </li>
        <li className={activePage === route('opened.bills') ? 'active' : ''}>
          <Link to={route('opened.bills')} onClick={() => setCollapseSidebar(!collapseSidebar)}>
            <i className="fas fa-file-invoice-dollar"></i>
            <span className="title">{bundle('opened.bills')}</span>
          </Link>
        </li>
        <li className={activePage === route('receipts') ? 'active' : ''}>
          <Link to={route('receipts')} onClick={() => setCollapseSidebar(!collapseSidebar)}>
            <i className="fas fa-hand-holding-usd"></i>
            <span className="title">{bundle('receipts')}</span>
          </Link>
        </li>
        <li className={activePage === route('extract') ? 'active' : ''}>
          <Link to={route('extract')} onClick={() => setCollapseSidebar(!collapseSidebar)}>
            <i className="fas fa-money-bill-wave"></i>
            <span className="title">{bundle('extract')}</span>
          </Link>
        </li>
        {/* <li className={activePage === route('future.projects') ? 'active' : ''}>
          <Link to={route('future.projects')} onClick={() => setCollapseSidebar(!collapseSidebar)}>
            <i className="fas fa-plane-departure"></i>
            <span className="title">{bundle('future.projects')}</span>
          </Link>
        </li> */}
        <li className={activePage === route('wallet.manager') ? 'active' : ''}>
          <Link to={route('wallet.manager')} onClick={() => setCollapseSidebar(!collapseSidebar)}>
            <i className="fas fa-wallet"></i>
            <span className="title">{bundle('wallet.manager')}</span>
          </Link>
        </li>
        <li className={(expandedImport) ? 'active has-sub' : 'has-sub'}>
          <div className="dropdown" onClick={() => setExpandedImport(!expandedImport)}>
            <i className="fas fa-file-import"></i>
            <span className="title">{bundle('import')}</span>
          </div>
          <ul className={(expandedImport) ? 'nav collapse in' : 'nav collapse'}>
            <li className={activePage === route('import.itau.extract') ? 'active' : ''}>
              <Link to={route('import.itau.extract')} onClick={() => setCollapseSidebar(!collapseSidebar)}>
                <i className="fas fa-angle-double-right"></i>
                <span className="title">{bundle('import.itau.extract')}</span>
              </Link>
            </li>
          </ul>
        </li>
        <li className={(expandedMaintenance) ? 'active has-sub' : 'has-sub'}>
          <div className="dropdown" onClick={() => setExpandedMaintenance(!expandedMaintenance)}>
            <i className="fas fa-cogs"></i>
            <span className="title">{bundle('maintenance')}</span>
          </div>
          <ul className={(expandedMaintenance) ? 'nav collapse in' : 'nav collapse'}>
            <li className={activePage === route('maintenance.category') ? 'active' : ''}>
              <Link to={route('maintenance.category')} onClick={() => setCollapseSidebar(!collapseSidebar)}>
                <i className="fas fa-sitemap"></i>
                <span className="title">{bundle('maintenance.category')}</span>
              </Link>
            </li>
          </ul>
        </li>
      </ul>
      {!isMobile() && <Footer />}
    </div >
  );
}

export default SideBar;