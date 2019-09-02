import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { SET_ACTIVE_PAGE } from 'store/globalActions'
import { SET_TRANSIENT, SET_PROFILE, SET_TOKEN } from 'store/userActions'
import getBundle from 'i18n/bundle';
import 'sass/login';
import { auth } from 'mymoney-sdk';
import bundle from 'i18n/bundle';
import { validateEmail, validatePassword } from 'service/util';
import Error from 'components/message/Error';
import { Link } from 'react-router-dom';
import route from 'i18n/route';
import LoaderFragment from 'components/loader/LoaderFragment';
import config from 'app/config';

const Login = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: SET_ACTIVE_PAGE, payload: 'login-page' });
  }, [dispatch]);


  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState([]);
  const [errors, setErrors] = useState({
    username: '',
    password: ''
  });

  const doLogin = (event) => {
    event.preventDefault();
    setLoading(true);
    if(errors.username || errors.password){
      return;
    }

    auth.login(username, password).then(res => {
      if (res.status >= 400) {
        setLoading(false);
        setLoginErrors(res.errors);
        return;
      }

      dispatch({ type: SET_TRANSIENT, payload: false });
      dispatch({ type: SET_TOKEN, payload: res.token });
      dispatch({
        type: SET_PROFILE, payload: {
          id: res.id,
          name: res.name,
          email: res.email,
          avatar: res.avatar || config.defaultAvatar
        }
      });
    }).catch(err => {
      setLoading(false);
      console.log(err);
    })
  }

  const validateAndSetUsername = (username) => {
    setErrors({ ...errors, username: '' })
    if (!validateEmail(username)) {
      setErrors({ ...errors, username: bundle('invalid.email') })
    }
    setUsername(username);
  }

  const validateAndSetPassword = (password) => {
    setErrors({ ...errors, password: '' })
    if (!validatePassword(password)) {
      setErrors({ ...errors, password: bundle('invalid.password') })
    }
    setPassword(password);
  }

  return (
    <div>
      {loading && <LoaderFragment />}
      <div className="login-branding">
        <div className="site-logo">
          <img src="/img/lv-large.png" alt="Site logo" />
        </div>
      </div>
      <h2>
        <strong>{getBundle("welcome.message")}</strong>&nbsp;
                {getBundle("login.message")}
      </h2>
      <Error errors={loginErrors} setErrors={loginErrors}/>
      <form onSubmit={doLogin}>
        <div className="form-group">
          <input type="email"
            name="email"
            className="form-control"
            placeholder={getBundle("capitalize.email")}
            value={username}
            required
            onChange={event => validateAndSetUsername(event.target.value)} />
          {errors.username && <span className="form-error">{errors.username}</span>}
        </div>
        <div className="form-group">
          <input type="password"
            name="password"
            required
            className="form-control"
            placeholder={getBundle("login.password")}
            value={password}
            onChange={event => validateAndSetPassword(event.target.value)} />
          {errors.password && <span className="form-error">{errors.password}</span>}
        </div>
        <div className="form-group">
          <input type="submit" value={getBundle("login")} className="btn btn-primary btn-block" />
        </div>
      </form>
      <Link to={route('create.user')}>{bundle('docreate.user')}</Link>
    </div>
  );
}

export default Login;