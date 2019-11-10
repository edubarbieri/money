import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import 'style/wallet.scss';
import Modal from 'components/global/fragments/Modal';
import WalletSelector from './WalletSelector';
import { bundle, route } from 'i18n/bundle';
import { Link } from 'react-router-dom';

const WalletMessage = () => {
    const wallet = useSelector(state => state.wallet.wallet);
    const [show, setShow] = useState(!!!wallet);

    useEffect(() => {
        setShow(!!!wallet.id);
    }, [wallet]);

    return (
        show && (
            <Modal title={bundle('warning')} setShow={() => setShow(false)}>
                <div className="wallet-message">
                    {bundle('wallet.not.found.message1')}
                    <Link to={route('wallet.manager')} onClick={() => setShow(false)} className="font-weight-bold">
                        {bundle('wallet.not.found.create')}
                    </Link>
                    {bundle('wallet.not.found.message2')}
                    <div className="content mt-2">
                        <WalletSelector />
                    </div>
                </div>
            </Modal>
        )
    );
};

export default WalletMessage;
