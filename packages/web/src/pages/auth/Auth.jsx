import React from 'react';
import CreateUser from './CreateUser';
import Login from './Login';
import Desktop from 'components/wrapper/Desktop';
import { Route, Switch } from "react-router-dom";
import route from 'i18n/route';

const Auth = () => {

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="login-content">
            <Switch>
                <Route path={route('create.user')} component={CreateUser} />
                <Route component={Login} />
            </Switch>
        </div>
      </div>
      <Desktop>
        <span className="photo-copyright">Photo by Benjamin Lambert on Unsplash</span>
      </Desktop>
    </div>
  );
}

export default Auth;