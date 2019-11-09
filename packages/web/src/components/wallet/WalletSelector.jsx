import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'style/wallet.scss';
import { bundle } from 'i18n/bundle';
import { fetchWallets, setWallet } from 'reducers/wallet/walletAction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown} from '@fortawesome/free-solid-svg-icons';

const WalletSelector = () => {
    const wallet = useSelector(state => state.wallet.wallet);
    const walletList = useSelector(state => state.wallet.all);
    const [showSelector, setShowSelector] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchWallets());
    }, [dispatch]);
    
    const changeWallet = (changeWallet) => {
        if(changeWallet.id === wallet.id){
            return;
        }
        setShowSelector(false);
        dispatch(setWallet(changeWallet));
    }

    return (
        <div className="wallet-selector-container">
            <div className="wallet-selector d-flex">
                {bundle('wallet.selector')}
                <div className="display w-100 ml-2" onClick={() => (walletList.length > 1 || !wallet.name) && setShowSelector(!showSelector)}>
                    {wallet.name ? wallet.name : bundle('select')}
                    <FontAwesomeIcon icon={faAngleDown} />
                </div>
            </div>
            <div className={showSelector ? 'selector show' : 'selector'}>
                {walletList.map((walletItem, idx) => (
                    <div className="item" key={walletItem.id} onClick={() => changeWallet(walletItem)}>
                        {walletItem.name}
                    </div>
                )) }
            </div>
        </div>
    );
};

export default WalletSelector;
