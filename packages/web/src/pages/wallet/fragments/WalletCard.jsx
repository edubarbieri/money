import React, { useEffect, useState } from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { setLoading } from 'reducers/global/globalAction';
import { bundle } from 'i18n/bundle';
import Modal from 'components/global/fragments/Modal';
import { setRemoveWallet, setWallet } from 'reducers/wallet/walletAction';

const WalletCard = ({ wallet, setEditWallet }) => {
    const currentWallet = useSelector(state => state.wallet.wallet);
    const dispatch = useDispatch();
    const [showRemove, setShowRemove] = useState(false);

    useEffect(() => {
        dispatch(setLoading(false));
    }, [dispatch]);

    const removeWallet = () => {
        dispatch(setRemoveWallet(wallet));
    }

    const changeWallet = (changeWallet) => {
        if(changeWallet.id === currentWallet.id){
            return;
        }
        dispatch(setWallet(changeWallet));
    }

    return (
        <div className="wallet-card">
            {showRemove && (
                <Modal title={bundle('remove.wallet')} setShow={() => setShowRemove(false)}>
                    <p>{bundle('remove.wallet.confirmation', wallet.name)}</p>
                    <div className="modal-footer p10">
                        <button type="button" className="btn btn btn-outline-secondary btn-sm"
                            onClick={() => setShowRemove(false)}>
                            {bundle('cancel')}
                        </button>
                        <button type="button" className="btn btn-danger btn-sm" onClick={removeWallet}>
                            {bundle('remove')}
                        </button>
                    </div>
                </Modal>
            )}
            <div className="card shadow-sm">
                <div className="row no-gutters">
                    <div className="col-md-3 wallet-member-container">
                        <div className="wallet-member-center">
                            {wallet.users.map(user => (
                                <div className="wallet-member" key={user.id}>
                                    <img src={user.avatar} alt={user.name} />
                                    <span className="wallet-member-name">{user.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="col-md-9">
                        <div className="card-body">
                            <h5 className="card-title">
                                {bundle('wallet')}:&nbsp;<span className="text-primary">{wallet.name}</span>
                            </h5>
                            <div>{wallet.description}&nbsp;</div>
                            <div className="card-footer p-0 mt-2 d-flex justify-content-end wallet-card-actions">
                                <button type="button" className="btn btn btn-outline-secondary btn-sm"
                                    onClick={() => changeWallet(wallet)}>
                                    {bundle('doSelect')}
                                </button>
                                {wallet.isOwner && (
                                    <button type="button" className="btn btn-outline-danger btn-sm ml-2" onClick={() => setShowRemove(true)}>
                                        {bundle('remove')}
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="btn btn-outline-primary btn-sm ml-2"
                                    onClick={() => setEditWallet(wallet)}>
                                    {bundle('edit')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletCard;
