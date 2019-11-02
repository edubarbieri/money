import React from 'react';
import 'style/wallet.scss';
import { bundle } from 'i18n/bundle';

const WalletSelector = () => {
    return <div className="wallet-selector d-flex">
       {bundle('wallet.selector')}
       <div className="selector w-100 ml-2">
           Principal
       </div>
    </div>
}

export default WalletSelector;