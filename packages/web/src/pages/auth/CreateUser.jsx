import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { bundle, route } from 'i18n/bundle';
import { validateEmail, validatePassword, getUserAvatar } from 'services/Util';
import {Link} from 'react-router-dom';
import { callSignup } from 'reducers/auth/authAction';
import ErrorMessage from 'components/global/ErrorMessage';

const CreateUser = () => {
    const dispatch = useDispatch();
    const [data, setData] = useState({ name: '', email: '', password: '', confirmPassword: '', avatar: '' });
    const [errors, setErrors] = useState({ name: '', email: '', password: '', confirmPassword: '', avatar: '' });

    const doCreate = (event) => {
        event.preventDefault();
        let hasErrors = false;
        if (!data.name || data.name.length < 3) {
            setErrors({ ...errors, name: bundle('invalid.name') });
            hasErrors = true;
        }
        if (!validateEmail(data.email)) {
            setErrors({ ...errors, email: bundle('invalid.email') });
            hasErrors = true;
        }
        if (!validatePassword(data.password)) {
            hasErrors = true;
            setErrors({ ...errors, password: bundle('invalid.password') });
        }
        if (data.password !== data.confirmPassword) {
            setErrors({ ...errors, confirmPassword: bundle('invalid.password.confirmation') });
            hasErrors = true;
        }

        if (hasErrors) {
            return;
        }

        data.avatar = getUserAvatar(data.email);

        dispatch(callSignup(data));
    };

    const validateAndSetName = name => {
        setErrors({ ...errors, name: '' });
        if (!name || name.length < 3) {
            setErrors({ ...errors, name: bundle('invalid.name') });
        }
        setData({ ...data, name: name });
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

    const validateAndSetPasswordConfirmation = confirmPassword => {
        setErrors({ ...errors, confirmPassword: '' });
        if (data.password !== confirmPassword) {
            setErrors({ ...errors, confirmPassword: bundle('invalid.password.confirmation') });
        }
        setData({ ...data, confirmPassword: confirmPassword });
    };

    return (
        <div className="text-center">
            <img src={process.env.PUBLIC_URL + '/img/lv-large.png'} alt="site logo" />
            <h5 className="mt-4">
                {bundle('create.user')}
            </h5>
            <form className="text-left mt-4" onSubmit={doCreate}>
                <ErrorMessage errorKey="auth" />
                <div className="form-group">
                    <input
                        type="text"
                        className="form-control"
                        value={data.name}
                        onChange={event => validateAndSetName(event.target.value)}
                        placeholder={bundle('name')}
                    />
                    {errors.email && <small className="form-text text-danger">{errors.name}</small>}
                </div>
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
                <div className="form-group">
                    <input
                        type="password"
                        className="form-control"
                        value={data.confirmPassword}
                        onChange={event => validateAndSetPasswordConfirmation(event.target.value)}
                        placeholder={bundle('password.confirmation')}
                    />
                    {errors.password && <small className="form-text text-danger">{errors.password}</small>}
                </div>
                <button type="submit" className="btn btn-outline-primary mt-3 w-100">
                    {bundle('create')}
                </button>
            </form>
            <Link to={route('login')} className="auth-redirect">{bundle('back.to.login')}</Link>
        </div>
    );
};

export default CreateUser;
