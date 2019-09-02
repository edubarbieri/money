import React from 'react';
import {useDispatch} from 'react-redux'
import {SET_ACTIVE_PAGE} from 'store/globalActions';
import bundle from 'i18n/bundle';
import route from 'i18n/route';

const FutureProjects = () => {
  const dispatch = useDispatch();
  dispatch({ type: SET_ACTIVE_PAGE, payload: route('future.projects') })

  return ( 
      <>
        <h1 className="page-title">{bundle('future.projects')}</h1>
      </>
  );
}

export default FutureProjects;