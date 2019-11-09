import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from 'reducers/global/globalAction';
import { bundle } from 'i18n/bundle';
import WalletCard from './fragments/WalletCard';
import Modal from 'components/global/fragments/Modal';
import WalletEditor from './fragments/WalletEditor';
import _ from 'lodash';
import { setCreatedWallet } from 'reducers/wallet/walletAction';

const WalletManager = () => {
    const dispatch = useDispatch();
    const walletList = useSelector(state => state.wallet.all);
    const created = useSelector(state => state.wallet.created);
    const [editWallet, setEditWallet] = useState(null);

    useEffect(() => {
        dispatch(setLoading(false));
    }, [dispatch]);
    
    useEffect(() => {
        if(editWallet && editWallet.id){
            setEditWallet(_.find(walletList, {id:editWallet.id}));
        }
    }, [walletList, editWallet]);

    useEffect(() => {
        if(created && created.id){
            setEditWallet(_.find(walletList, {id:created.id}));
            setCreatedWallet(null)
        }
    }, [walletList, created]);

    useEffect(() => {
        if(editWallet && editWallet.id){
            setEditWallet(_.find(walletList, {id:editWallet.id}));
        }
    }, [walletList, editWallet]);

    return (
        <div className="container-fluid wallet-manager">
            <div className="row">
                <h1 className="page-title">{bundle('wallet.manager')}</h1>
            </div>
            <div className="row">
                <button
                    type="button"
                    className="btn btn-primary btn-sm mb-3 btn-add-wallet"
                    onClick={() => setEditWallet({description: '', name: '', id: ''})}>
                    {bundle('wallet.add')}
                </button>
            </div>
            {editWallet && (
                <div className="wallet-editor">
                    <Modal title={bundle('wallet.editor')} setShow={() => setEditWallet(null)}>
                        <WalletEditor wallet={editWallet} onCancel={() => setEditWallet(null)}/>
                    </Modal>
                </div>    
            )}
            <div className="row">
                {walletList && walletList.map(wallet => (
                    <div className="col-12 col-sm-4 mb-3 wallet-collumn" key={wallet.id}>
                        <WalletCard wallet={wallet} setEditWallet={setEditWallet}/>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WalletManager;
