import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import bundle, { bundleFormat } from 'i18n/bundle';
import Breadcrumb from 'components/breadcrumb/Breadcrumb';
import 'sass/account'
import OneButton from 'components/buttons/OneButton';
import {user} from 'mymoney-sdk';
import { SET_PROFILE } from 'store/userActions';
import { SET_LOADING, SET_ACTIVE_PAGE } from 'store/globalActions';
import Errors from 'components/message/Error';
import route from 'i18n/route';

const Home = () => {
  const dispatch = useDispatch();
  dispatch({ type: SET_ACTIVE_PAGE, payload: route('my.account')})
  const profile = useSelector(state => state.user.profile);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [editErrors, setEditErrors] = useState([]);
  const [errors, setErrors] = useState({
    name: '',
    avatar: ''
  });

  const pages = [{
    label: bundle('account')
  }]

  const validateAndSetName = (name) => {
    setEditedProfile({...editedProfile, name: name});
    setErrors({...errors, name: ''});
    if(!name){
      setErrors({...errors, name: bundle('required.field')})
      return;
    }
    if(name.length < 3){
      setErrors({...errors, name: bundleFormat('invalid.qtd.chars', 3)})
    }
  }

  const doSave = () => {
    if(errors.name){
      return;
    }
    dispatch({ type: SET_LOADING, payload: true});
    user.updateUser(editedProfile.id, editedProfile.email, editedProfile.name).then(res => {
      dispatch({ type: SET_LOADING, payload: false });
      if(res.status >= 400){
        setEditErrors(res.errors);
        return;
      }
      dispatch({
        type: SET_PROFILE, payload: {
          id: res.id,
          name: res.name,
          email: res.email,
          avatar: res.avatar
        }
      })
    });
  }

  return (
    <div className="my-account">
      <h1 className="page-title">{bundle('account')}</h1>
      <Breadcrumb pages={pages} />
      <div className="row">
        <div className="col-md-2 col-sm-12 current-info">
          <div className="panel panel-minimal">
            <div className="panel-body">
              <div className="avatar-container">
                <img alt={profile.name + ' avatar'} className="img-circle avatar" src={profile.avatar} />
              </div>
              <h4>{profile.name}</h4>
              <h6>{profile.email}</h6>
            </div>
          </div>
        </div>
        <div className="col-md-10 col-sm-12">
          <div className="panel panel-primary">
            <div className="panel-heading ">
                {bundle('user.data')}
            </div>
            <div className="panel-body">
              <Errors errors={editErrors} setErrors={setEditErrors}/>
              <form>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-group">
                      <label className="control-label" htmlFor="inptEmail">{bundle('email')}</label>
                      <input type="text"
                        id="inptEmail"
                        value={editedProfile.email}
                        onChange={() => {}}
                        disabled={true}
                        className="form-control" />
                    </div>
                  </div>
                  <div className="col-md-12">
                    <div className={(errors.name) ? 'form-group has-error' : 'form-group'}>
                      <label className="control-label" htmlFor="inptName">{bundle('name')}</label>
                      <input type="text"
                        id="inptName"
                        value={editedProfile.name}
                        onChange={(event) => validateAndSetName(event.target.value)}
                        className="form-control" />
                      {errors.name && <span className="form-error">{errors.name}</span>}
                    </div>
                  </div>
                  <div className="col-md-12">
                    <label className="control-label" >{bundle('avatar')}</label>
                    <br/>
                    {bundle('manage.avatar')}&nbsp;
                    <a href="https://gravatar.com" target="_blank" rel="noopener noreferrer"><strong>Gravatar</strong></a>
                  </div>
                  <div className="col-md-12">
                    <OneButton onClick={doSave} label={bundle('save')} />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}

export default Home;