import React, {useState, useEffect} from 'react';
import { Redirect } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import bundle from 'i18n/bundle';
import 'sass/header';
import { SET_ACTIVE_WALLET } from 'store/userActions';
import { SET_WALLET_MEMBERS, SET_WALLETS, SET_CATEGORIES } from 'store/walletActions';
import {setActiveWallet} from 'mymoney-sdk';
import { wallet as walletService, category as categoryService } from 'mymoney-sdk';
import _ from 'lodash';
import { SET_REFRESH } from 'store/globalActions';

const WalletSelector = ({match = {}}) => {
    const dispatch= useDispatch();
    let wallet = useSelector(state => state.user.activeWallet);
    let wallets = useSelector(state => state.wallet.wallets);
    let started = useSelector(state => state.global.started);
    setActiveWallet((wallet) ? wallet.id : '');
    const [expanded, setExpanded] = useState(false);
    
    useEffect(()=>{
        if(!started){
            return;
        }
        walletService.getAllMyWithUser().then(result => {
            if (!result.status) {
                dispatch({ type: SET_WALLETS, payload: result});
                dispatch({ type: SET_WALLET_MEMBERS, payload: (wallet) ? wallet.users : []});
            }
        });
        if(!wallet.id){
            return;
        }
        categoryService.getWithPath().then(result => {
            if(result.status >= 400){
                console.log('Error on fetch categories');
                return;
            }
            dispatch({ type: SET_CATEGORIES, payload: result});
        }).catch(err => {
            console.log(err)
        })
    }, [started, dispatch, wallet])

    const changeWallet = (walletId) => {
        const selectWallet = _.find(wallets, {id: walletId});
        dispatch({ type: SET_ACTIVE_WALLET, payload: selectWallet});
        setActiveWallet(walletId);
        setExpanded(false);
        dispatch({ type: SET_REFRESH, payload: new Date().getTime()});
        dispatch({ type: SET_WALLET_MEMBERS, payload: selectWallet.users});
    }

    const listAllWallets = () => {
        return wallets.map((wallet, idx) => (
            <li key={idx} className="wallet-item" onClick={()=>changeWallet(wallet.id)}>
                {wallet.name}
            </li>
        ))
    }

    return (
        <div className="pull-left">
            <div className={(expanded) ? 'dropdown open wallet-selector-container' : 'dropdown wallet-selector-container'}>
                <div data-toggle="dropdown" 
                    className="dropdown-toggle wallet-selector" 
                    onClick={() => setExpanded(!expanded)}>
                    {bundle('wallet.selector')}&nbsp;
                    <span className="wallet-active">{(wallet) ? wallet.name : ''}</span>
                </div>
                <ul className="dropdown-menu wallet-list">
                    <li className="change-label">
                        {bundle('wallet.change')}
                    </li>
                    {listAllWallets()}
                </ul>
            </div>
            <div onClick={() => setExpanded(false)} className="bg-fixed"></div>
        </div>
    );
}

export default WalletSelector;
