import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Redirect } from 'react-router-dom';
import { SET_LOADING } from 'store/globalActions'
import bundle, {bundleFormat} from 'i18n/bundle';
import route from 'i18n/route';
import WalletMemberSelector from './WalletMemberSelector';
import Breadcrumb from 'components/breadcrumb/Breadcrumb';
import OneButton from 'components/buttons/OneButton';
import {wallet as walletService} from 'mymoney-sdk';
import Errors from 'components/message/Error';
import _ from 'lodash';
import { SET_WALLETS } from 'store/walletActions';

const WalletEditor = ({ match }) => {
  const dispatch = useDispatch();
  const isEdit = !!match.params.id;
  let started  = useSelector(state => state.global.started);
  let refresh  = useSelector(state => state.global.refresh);
  const [redirect, setRedirect] = useState('');
  const [wallet, setWallet] = useState({name: '', description: '', id: '', members: {}});
  const [errors, setErrors] = useState({name: '', description: ''});
  const [creationErrors, setCreationErrors] = useState([]);
  let pWalletId = match.params.id;
  
  useEffect(()=>{
    if(!pWalletId || (refresh.type !== 'wallet' && !started)){
      return;
    }
    dispatch({ type: SET_LOADING, payload: true });
    walletService.getAllMyWithUser().then(result => {
      if(result.status >= 400){
        dispatch({ type: SET_LOADING, payload: false });
        return;
      }
      dispatch({ type: SET_WALLETS, payload: result});
      const findedWallet = _.find(result, {id: pWalletId});
      if(findedWallet){
        setWallet(findedWallet);
      }
      dispatch({ type: SET_LOADING, payload: false });
    })
  }, [started, dispatch, pWalletId, refresh])

  const pages = [{
    link: route('wallet.manager'),
    label: bundle('wallet.manager')
  }, {
    label: (isEdit) ? bundle('wallet.editor') : bundle('wallet.create')
  }]


  const doSave = () => {
    if(!wallet.name){
      setErrors({...errors, name: bundle('required.field')})
      return;
    }
    if(errors.name){
      return;
    }

    dispatch({ type: SET_LOADING, payload: true });

    if(wallet.id){
      walletService.update(wallet.id, wallet.name, wallet.description).then(result => {
        saveCallback(result);
      }).catch(err => {
        setCreationErrors(err.errors);
        dispatch({ type: SET_LOADING, payload: false });
      })
      return;
    }

    walletService.create(wallet.name, wallet.description).then(result => {
      saveCallback(result);
    }).catch(err => {
      setCreationErrors(err.errors);
      dispatch({ type: SET_LOADING, payload: false });
    })
  }

  const saveCallback = (result) => {
    dispatch({ type: SET_LOADING, payload: false });
    if(result.status >= 400){
      setCreationErrors(result.errors);
      return;
    }
    setRedirect(route('wallet.editor') + '/' + result.id);
  }

  const validateAndSetName = (name) => {
    setWallet({...wallet, name: name});
    setErrors({...errors, name: ''});
    if(!name){
      setErrors({...errors, name: bundle('required.field')})
      return;
    }
    if(name.length < 3){
      setErrors({...errors, name: bundleFormat('invalid.qtd.chars', 3)})
    }
  }

  return (
    <div>
      {redirect && <Redirect to={redirect} />}
      <h1 className="page-title">{bundle('wallet')}:&nbsp;
        <strong>{wallet.name}</strong>
      </h1>
      <Breadcrumb pages={pages} />
      <div className="row">
        <div className="col-md-12 col-lg-8 col-xl-6 col-xxl-6">
          <div className="panel panel-minimal">
            <div className="panel-heading"></div>
            <div className="panel-body">
              <Errors errors={creationErrors}  setErrors={setErrors} />
              <form>
                <div className="row">
                  <div className="col-md-4">
                    <div className={(errors.name) ? 'form-group has-error': 'form-group'}>
                      <label className="control-label" htmlFor="walletInptName">{bundle('name')}</label>
                      <input type="text" 
                        id="walletInptName" 
                        value={wallet.name}
                        onChange={(event) => validateAndSetName(event.target.value)}
                        className="form-control" />
                        {errors.name && <span className="form-error">{errors.name}</span>}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="control-label" htmlFor="walletInptDescription">{bundle('description')}</label>
                      <input type="text" 
                        id="walletInptDescription" 
                        value={wallet.description}
                        onChange={(event) => setWallet({...wallet, description: event.target.value})}
                        className="form-control" />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <OneButton onClick={doSave} label={bundle('save')} />
                  </div>
                </div>
              </form>
            </div>
            {isEdit && <WalletMemberSelector wallet={wallet}/>}  
          </div>
          <OneButton light={true} fixed={true} onClick={() => setRedirect(route('wallet.manager'))} label={bundle('back')} />
        </div>
      </div >
    </div >
  );
}

export default WalletEditor;