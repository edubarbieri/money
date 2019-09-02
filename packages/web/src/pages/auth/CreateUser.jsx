import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux'
import { SET_ACTIVE_PAGE } from 'store/globalActions'
import { SET_TRANSIENT, SET_PROFILE, SET_TOKEN } from 'store/userActions'
import getBundle from 'i18n/bundle';
import 'sass/login';
import { Link } from 'react-router-dom';
import { auth } from 'mymoney-sdk';
import bundle from 'i18n/bundle';
import { validateEmail, validatePassword } from 'service/util';
import Error from 'components/message/Error';
import route from 'i18n/route';
import LoaderFragment from 'components/loader/LoaderFragment';

const Login = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: SET_ACTIVE_PAGE, payload: 'login-page' });
  }, [dispatch]);


  const [loading, setLoading] = useState(false);
  const [email, setemail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loginErrors, setLoginErrors] = useState([]);
  const [errors, setErrors] = useState({
    email: '',
    name: '',
    passwordConfirmation: '',
    password: ''
  });

  const doCreate = (event) => {
    event.preventDefault();
    setLoading(true);

    if(errors.email || errors.password || errors.passwordConfirmation || errors.name){
      return;
    }

    auth.signup(name, email, password, passwordConfirmation).then(res => {
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
          avatar: res.avatar
        }
      });
    }).catch(err => {
      setLoading(false);
      console.log(err);
    })
  }

  const validateAndSetName = (name) => {
    setErrors({ ...errors, name: '' })
    if (!name || name.length < 3) {
      setErrors({ ...errors, name: bundle('invalid.name') })
    }
    setName(name);
  }

  const validateAndSetemail = (email) => {
    setErrors({ ...errors, email: '' })
    if (!validateEmail(email)) {
      setErrors({ ...errors, email: bundle('invalid.email') })
    }
    setemail(email);
  }

  const validateAndSetPassword = (password) => {
    setErrors({ ...errors, password: '' })
    if (!validatePassword(password)) {
      setErrors({ ...errors, password: bundle('invalid.password') })
    }
    setPassword(password);
  }
 
  const validateAndSetPasswordConfirmation = (passwordConfirmation) => {
    setErrors({ ...errors, passwordConfirmation: '' })
    if (password !== passwordConfirmation) {
      setErrors({ ...errors, passwordConfirmation: bundle('invalid.password.confirmation') })
    }
    setPasswordConfirmation(passwordConfirmation);
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
        <strong>{getBundle("create.user")}</strong>
      </h2>
      <Error errors={loginErrors}  setErrors={setLoginErrors} />
      <form onSubmit={doCreate}>
        <div className="form-group">
          <input type="name"
            name="name"
            className="form-control"
            placeholder={getBundle("name")}
            value={name}
            required
            onChange={event => validateAndSetName(event.target.value)} />
            {errors.name && <span className="form-error">{errors.name}</span>}
        </div>
        <div className="form-group">
          <input type="email"
            name="email"
            className="form-control"
            placeholder={getBundle("capitalize.email")}
            value={email}
            required
            onChange={event => validateAndSetemail(event.target.value)} />
          {errors.email && <span className="form-error">{errors.email}</span>}
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
          <input type="password"
            name="password"
            required
            className="form-control"
            placeholder={getBundle("password.confirmation")}
            value={passwordConfirmation}
            onChange={event => validateAndSetPasswordConfirmation(event.target.value)} />
          {errors.passwordConfirmation && <span className="form-error">{errors.passwordConfirmation}</span>}
        </div>
        <div className="form-group">
          <input type="submit" value={getBundle("create")} className="btn btn-primary btn-block" />
        </div>
      </form>
      <Link to={route('login')}>{bundle('back.to.login')}</Link>
    </div>
  );
}

export default Login;