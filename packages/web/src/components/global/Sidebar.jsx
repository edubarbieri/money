import React from 'react';
import { useSelector } from 'react-redux';
import 'style/sidebar.scss';
import WalletSelector from 'components/wallet/WalletSelector';
import {
    faChartLine,
    faFileInvoiceDollar,
    faMoneyBillWave,
    faWallet,
    faFileImport,
    faCogs,
    faAngleDoubleRight,
    faSitemap,
    faTasks
} from '@fortawesome/free-solid-svg-icons';
import SidebarItem from 'components/global/fragments/SidebarItem';
import {Link} from 'react-router-dom';
import SiteInfo from './SiteInfo';

const Sidebar = () => {
    const toogle = useSelector(state => state.global.toogle);
    return (
        <div className={toogle === 'sidebar' ? 'col-12 col-md-3 col-xl-2 sidebar toogle' : 'col-12 col-md-3 col-xl-2 sidebar'}>
            <div className="desk-brand" >
                <Link to={process.env.PUBLIC_URL || '/'}>
                    <img src={process.env.PUBLIC_URL + '/img/lh-large.png'} width="240" height="62" alt="" />
                </Link>
                <SiteInfo/>
            </div>
            <WalletSelector />
            <ul className="menu list-group list-group-flush mt-2">
                <SidebarItem icon={faChartLine} label="dashboard" />
                <SidebarItem icon={faFileInvoiceDollar} label="opened.bills" />
                <SidebarItem icon={faMoneyBillWave} label="extract" />
                <SidebarItem icon={faTasks} label="planning" />
                <SidebarItem icon={faWallet} label="wallet.manager" />
                <SidebarItem icon={faFileImport} label="import">
                    <SidebarItem icon={faAngleDoubleRight} label="import.itau.extract" />
                </SidebarItem>
                <SidebarItem icon={faCogs} label="maintenance">
                    <SidebarItem icon={faSitemap} label="maintenance.category" />
                </SidebarItem>
            </ul>
        </div>
    );
};

export default Sidebar;
