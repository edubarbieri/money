import React from 'react';
import {useSelector} from 'react-redux';
import bundle from 'i18n/bundle';
import {Link} from 'react-router-dom';
import route from 'i18n/route';

const SelectWalletMessage = () => {
    let wallet = useSelector(state => state.user.activeWallet);

    return (!wallet || !wallet.id) &&
        <div className="modal show fixed z-i-20">
            <span className="overlay"></span>
            <div className="modal-dialog ">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title text-primary">{bundle('warning')}</h4>
                    </div>
                    <div className="modal-body">
                        <p>
                            {bundle('wallet.not.found.message1')}
                            <Link to={route('wallet.manager')}>{bundle('wallet.not.found.create')}</Link>
                            {bundle('wallet.not.found.message2')}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    
}

export default SelectWalletMessage;