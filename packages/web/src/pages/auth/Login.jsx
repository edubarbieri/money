import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { bundle, route } from 'i18n/bundle';
import { validateEmail, validatePassword } from 'services/Util';
import {Link} from 'react-router-dom';
import { callLogin } from 'reducers/auth/authAction';
import ErrorMessage from 'components/global/ErrorMessage';

const Login = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({ email: '', password: '' });

    const doLogin = (event) => {
        event.preventDefault();
        let hasErrors = false;
        if (!validateEmail(data.email)) {
            setErrors({ ...errors, email: bundle('invalid.email') });
            hasErrors = true;
        }
        if (!validatePassword(data.password)) {
            hasErrors = true;
            setErrors({ ...errors, password: bundle('invalid.password') });
        }

        if (hasErrors) {
            return;
        }

        dispatch(callLogin(data));
    };

    const validateAndSetEmail = email => {
        setErrors({ ...errors, email: '' });
        if (!validateEmail(email)) {
            setErrors({ ...errors, email: bundle('invalid.email') });
        }
        setData({ ...data, email: email });
    };

    const validateAndSetPassword = password => {
        setErrors({ ...errors, password: '' });
        if (!validatePassword(password)) {
            setErrors({ ...errors, password: bundle('invalid.password') });
        }
        setData({ ...data, password: password });
    };

    return (
        <div className="text-center">
            <img src={process.env.PUBLIC_URL + '/img/lv-large.png'} alt="site logo" />
            <h5 className="mt-4">
                <strong>{bundle('welcome.message')}</strong>&nbsp;
                {bundle('login.message')}
            </h5>
            <form className="text-left mt-4" onSubmit={doLogin}>
                <ErrorMessage errorKey="auth" />
                <div className="form-group">
                    <input
                        type="email"
                        className="form-control"
                        value={data.email}
                        onChange={event => validateAndSetEmail(event.target.value)}
                        placeholder={bundle('capitalize.email')}
                    />
                    {errors.email && <small className="form-text text-danger">{errors.email}</small>}
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        className="form-control"
                        value={data.password}
                        onChange={event => validateAndSetPassword(event.target.value)}
                        placeholder={bundle('login.password')}
                    />
                    {errors.password && <small className="form-text text-danger">{errors.password}</small>}
                </div>
                <button type="submit" className="btn btn-outline-primary mt-3 w-100">
                    {bundle('login')}
                </button>
            </form>
            <Link to={route('create.user')} className="auth-redirect">{bundle('docreate.user')}</Link>
        </div>
    );
};

export default Login;
