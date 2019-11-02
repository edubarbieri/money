import React from 'react';
import 'style/sidebar.scss';
import WalletSelector from 'components/wallet/WalletSelector';

const Sidebar = () => {
    return <div className="col-12 col-md-3 col-xl-2 sidebar">
        <WalletSelector />
    </div>
}

export default Sidebar;