import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { bundle } from 'i18n/bundle';
import { saveWallet, addWalletUser, removeWalletUser } from 'reducers/wallet/walletAction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import ErrorMessage from 'components/global/ErrorMessage';
import { validateEmail } from 'services/Util';

const WalletEditor = ({ wallet, onCancel }) => {
    const [editWallet, setEditWallet] = useState({ ...wallet, name: wallet.name, users: wallet.users });
    const [walletUser, setWalletUser] = useState('');
    const dispatch = useDispatch();

    const sendSave = () => {
        if (!editWallet.name) {
            return;
        }
        dispatch(saveWallet(editWallet));
    };
    
    const removeUser = (userId) => {
        const data = {
            userId: userId,
            id: wallet.id
        }
        dispatch(removeWalletUser(data));
    }

    const sendInvite = (event) => {
        event.preventDefault();
        if (!validateEmail(walletUser)) {
            return;
        }
        const data = {
            email: walletUser,
            id: wallet.id,
            isOwner: false
        }
        dispatch(addWalletUser(data));
        setWalletUser('')
    }

    return (
        <div className="row wallet-editor">
            <div className="col-12 col-md-6">
                <form>
                    <div className={!editWallet.name ? 'form-group has-error' : 'form-group'}>
                        <label>{bundle('name')}</label>
                        <input type="text" className="form-control"
                            value={editWallet.name}
                            onChange={event => setEditWallet({ ...editWallet, name: event.target.value })}
                        />
                    </div>
                    <div className={!editWallet.description ? 'form-group has-error' : 'form-group'}>
                        <label>{bundle('description')}</label>
                        <input type="text" className="form-control"
                            value={editWallet.description}
                            onChange={event => setEditWallet({ ...editWallet, description: event.target.value })}
                        />
                    </div>
                </form>
                <div className="modal-footer wallet-editor-actions">
                    <button type="button" className="btn btn btn-outline-secondary btn-sm" onClick={onCancel}>
                        {bundle('cancel')}
                    </button>
                    <button type="button" className="btn btn-primary btn-sm" onClick={sendSave}>
                        {bundle('save')}
                    </button>
                </div>
            </div>
            <div className="col-12 col-md-6">
                <div className="wallet-member-selector">
                    <p>
                        {editWallet.id ? bundle('member.invite') : bundle('member.invite.after')}
                    </p>
                    <div className="member-email">
                        <form onSubmit={sendInvite}>
                            <input 
                                className="input-member" 
                                type="email" 
                                value={walletUser}
                                disabled={!editWallet.id}
                                onChange={event => setWalletUser(event.target.value)}
                                placeholder={bundle('email')} />
                        </form>
                        <ErrorMessage errorKey="userWallet" />
                    </div>
                    <div className="member-list">
                        {wallet.users && wallet.users.map(user => (
                            <div className="member" key={user.id}>
                                <img src={user.avatar} alt={user.name} />
                                {user.name}
                                {!user.isOwner && <FontAwesomeIcon className="remove-member" onClick={() => removeUser(user.id)} icon={faTrashAlt} />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WalletEditor;
