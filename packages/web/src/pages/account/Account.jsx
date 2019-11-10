import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import 'style/account.scss';
import { bundle, routeLang } from 'i18n/bundle';
import { dispatch } from 'services/Store';
import { setUpdateUser, setUserLang } from 'reducers/user/userAction';
import { getRegisteredLanges } from 'i18n/lang';

const Home = () => {
    const profile = useSelector(state => state.user.data);
    const lang = useSelector(state => state.user.lang);
    const [editedProfile, setEditedProfile] = useState(profile);
    const [errors, setErrors] = useState({
        name: ''
    });

    const validateAndSetName = name => {
        setEditedProfile({ ...editedProfile, name: name });
        setErrors({ ...errors, name: '' });
        if (!name) {
            setErrors({ ...errors, name: bundle('required.field') });
            return;
        }
        if (name.length < 3) {
            setErrors({ ...errors, name: bundle('invalid.qtd.chars', 3) });
        }
    };

    const doSave = () => {
        if (errors.name) {
            return;
        }
        dispatch(setUpdateUser(editedProfile));
    };

    const setLang = (lang) => {
        dispatch(setUserLang(lang));
        setTimeout(() => {
            window.location.href = routeLang('my.account', lang);
        }, 100)
    };


    return (
        <div className="my-account">
            <h1 className="page-title">{bundle('account')}</h1>
            <div className="row">
                <div className="col-md-2 col-sm-12 current-info">
                    <div className="panel panel-minimal">
                        <div className="panel-body">
                            <div className="avatar-container">
                                <img
                                    alt={profile.name + ' avatar'}
                                    className="img-circle avatar"
                                    src={profile.avatar}
                                />
                            </div>
                            <h4>{profile.name}</h4>
                            <h5 className="text-muted">{profile.email}</h5>
                        </div>
                    </div>
                </div>
                <div className="col-md-10 col-sm-12">
                    <div className="panel panel-primary user-edit-data">
                        <div className="panel-heading font-weight-bold mb-2 text-primary">{bundle('user.data')}</div>
                        <div className="panel-body">
                            <form>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label className="control-label" htmlFor="inptEmail">
                                                {bundle('email')}
                                            </label>
                                            <input
                                                type="text"
                                                id="inptEmail"
                                                value={editedProfile.email}
                                                onChange={() => {}}
                                                disabled={true}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className={errors.name ? 'form-group has-error' : 'form-group'}>
                                            <label className="control-label" htmlFor="inptName">
                                                {bundle('name')}
                                            </label>
                                            <input
                                                type="text"
                                                id="inptName"
                                                value={editedProfile.name}
                                                onChange={event => validateAndSetName(event.target.value)}
                                                className="form-control"
                                            />
                                            {errors.name && <span className="form-error">{errors.name}</span>}
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label className="control-label" htmlFor="inptLanguage">
                                                {bundle('preffered.language')}
                                            </label>
                                            <select
                                                className="form-control"
                                                onChange={event => setLang(event.target.value)}
                                                value={lang}>
                                                {getRegisteredLanges().map(value => {
                                                    return (
                                                        <option key={value.lang} value={value.lang}>
                                                            {value.name}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group">
                                            <label className="control-label">{bundle('avatar')}</label><br/>
                                            {bundle('manage.avatar')}&nbsp;
                                            <a href="https://gravatar.com" target="_blank" rel="noopener noreferrer">
                                                <strong>Gravatar</strong>
                                            </a>
                                        </div>
                                    </div>
                                    <div className="col-md-12 d-flex justify-content-end">
                                        <button
                                            type="button"
                                            className="flext-right btn btn-outline-primary btn-sm"
                                            onClick={doSave}>
                                            {bundle('save')}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
