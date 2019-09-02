import React from 'react';
import {useDispatch} from 'react-redux'
import {SET_ACTIVE_PAGE} from 'store/globalActions';
import bundle from 'i18n/bundle';
import SelectWalletMessage from 'components/global/SelectWalletMessage';

const Home = () => {
  const dispatch = useDispatch();
  dispatch({ type: SET_ACTIVE_PAGE, payload: '/' })

  return ( 
      <div>
        <h1 className="page-title">{bundle('dashboard')}</h1>
        <SelectWalletMessage />
      </div>
  );
}

export default Home;