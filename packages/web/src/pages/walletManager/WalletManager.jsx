import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { SET_ACTIVE_PAGE, SET_LOADING } from 'store/globalActions'
import { Link } from 'react-router-dom';
import bundle, { bundleFormat } from 'i18n/bundle';
import route from 'i18n/route';
import Breadcrumb from 'components/breadcrumb/Breadcrumb';
import { wallet } from 'mymoney-sdk';
import config from 'app/config';
import Modal from 'components/modal/Modal';
import ErrorMessage from 'components/message/Error';
import { SET_WALLETS } from 'store/walletActions';
import { SET_ACTIVE_WALLET } from 'store/userActions';
import _ from 'lodash';

const WalletManager = () => {
  const dispatch = useDispatch();
  dispatch({ type: SET_ACTIVE_PAGE, payload: route('wallet.manager') })
  let started = useSelector(state => state.global.started);
  let activeWallet = useSelector(state => state.user.activeWallet);

  const [errors, setErrors] = useState([]);
  const [walletList, setWalletList] = useState([]);
  const pages = [{
    label: bundle('wallet.manager')
  }]
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const [removeConfirmationData, setRemoveConfirmationData] = useState({
    title: '',
    text: '',
    id: '',
    onConfirm: null,
    onCancel: null,
    category: null
  });
  
  useEffect(() => {
    if (!started) {
      return;
    }
    dispatch({ type: SET_LOADING, payload: true });
    wallet.getAllMyWithUser().then(result => {
      if (result.status >= 400) {
        dispatch({ type: SET_LOADING, payload: false });
        return;
      }
      setWalletList(result);
      dispatch({ type: SET_LOADING, payload: false });
      dispatch({ type: SET_WALLETS, payload: result});
    })
  }, [started, dispatch])

  const renderMemberList = (wallet) => {
    if (!wallet.users) {
      return;
    }
    return wallet.users.map((user, idx) => (
      <span className="tooltip-trigger" key={idx} >
        <img className="img-circle avatar" alt="" src={user.avatar || config.defaultAvatar} />
        <span className="tooltip-text">{user.name}</span>
      </span>
    ))
  };


  const callbackRemoveConfirmation = (id) => {
    setShowRemoveConfirmation(false);
    dispatch({ type: SET_LOADING, payload: true });
    wallet.remove(id).then(result => {
      if(result.status >= 400){
        dispatch({ type: SET_LOADING, payload: false });
        setErrors(result.errors);
        return;
      }
      wallet.getAllMyWithUser().then(result => {
        if (result.status >= 400) {
          dispatch({ type: SET_LOADING, payload: false });
          return;
        }
        setWalletList(result);
        dispatch({ type: SET_LOADING, payload: false });
        dispatch({ type: SET_WALLETS, payload: result});
        checkActiveWallet(result);
      })
    })
  }

  const checkActiveWallet = (wallets) => {
    if(!activeWallet || !activeWallet.id){
      return;
    }
    let selectedWallet = _.find(wallets, {id:activeWallet.id});
    if(!selectedWallet && wallets.length){
      selectedWallet = wallets[0];
    }
    dispatch({ type: SET_ACTIVE_WALLET, payload: selectedWallet});
  }

  const handleRemoveWallet = (wallet) => {
    if(!wallet){
        return;
    }
    setRemoveConfirmationData({...removeConfirmationData,
        title: bundle('remove.category'),
        text: bundleFormat('remove.wallet.confirmation', wallet.name),
        onConfirm: callbackRemoveConfirmation,
        onCancel: () => setShowRemoveConfirmation(false),
        id: wallet.id
    });
    setShowRemoveConfirmation(true);
}

  const renderWallets = () => {
    return walletList.map((wallet, idx) => (
      <div key={idx} className="col-md-6 col-lg-4 col-xl-3 col-xxl-3">
        <div className="panel panel-minimal">
          <div className="panel-heading clearfix">
            <div className="panel-title">{wallet.name}</div>
            <ul className="panel-tool-options">
              <li>
                <Link to={route('wallet.editor') + '/' + wallet.id}>
                  <i className="far fa-edit"></i>
                </Link>
              </li>
              <li>
                <i className="far fa-trash-alt" onClick={() => handleRemoveWallet(wallet)}></i>
              </li>
            </ul>
          </div>
          <div className="panel-body">
            <p>{wallet.description}</p>
            <div className="member-list">
              <h6>{bundle('members')}:</h6>
              {renderMemberList(wallet)}
            </div>
          </div>
        </div>
      </div>
    ))
  }

  const renderRemoveConfirmation = () => {
    return showRemoveConfirmation &&
        <Modal
          text={removeConfirmationData.text}
          title={removeConfirmationData.title}
          size=""
          fixed={true}
          onConfirm={() => removeConfirmationData.onConfirm(removeConfirmationData.id)}
          onClose={() => removeConfirmationData.onCancel(removeConfirmationData.id)}
          onCancel={() => removeConfirmationData.onCancel(removeConfirmationData.id)}
        />
  }

  return (
    <div>
      <h1 className="page-title">{bundle('wallet.manager')}</h1>
      <Breadcrumb pages={pages} />
      {renderRemoveConfirmation()}
      <div className="row">
        <div className="col-md-12">
          <ErrorMessage errors={errors} setErrors={setErrors}/>
        </div>
        {renderWallets()}
        <div className="col-md-3">
          <div className="panel panel-minimal bn">
            <Link to={route('wallet.create')}>
              <div className="btn-plus">
                <i className="fas fa-plus" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WalletManager;