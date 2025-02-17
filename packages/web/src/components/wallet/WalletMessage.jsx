import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import 'style/wallet.scss';
import Modal from 'components/global/fragments/Modal';
import WalletSelector from './WalletSelector';
import { bundle } from 'i18n/bundle';

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
                    <WalletSelector />
                </div>
            </Modal>
        )
    );
};

export default WalletMessage;
