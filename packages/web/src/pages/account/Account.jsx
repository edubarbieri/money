import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import 'style/account.scss';
import { bundle } from 'i18n/bundle';

const Home = () => {
    const profile = useSelector(state => state.user.data);
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
        console.log('savvw');
    };

    const changeLanguage = value => {
        console.log(value);
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
                        <div className="panel-heading ">{bundle('user.data')}</div>
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
                                        <div>
                                            <label className="control-label" htmlFor="inptLanguage">
                                                {bundle('preffered.language')}
                                            </label>
                                            <select
                                                className="form-control"
                                                onChange={event => changeLanguage(event.target.value)}
                                                value={'pt-br'}>
                                                {['pt-br'].map(value => {
                                                    return (
                                                        <option key={value} value={value}>
                                                            {bundle(value)}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="control-label">{bundle('avatar')}</label>
                                        <br />
                                        {bundle('manage.avatar')}&nbsp;
                                        <a href="https://gravatar.com" target="_blank" rel="noopener noreferrer">
                                            <strong>Gravatar</strong>
                                        </a>
                                    </div>
                                    <div className="col-md-12 d-flex justify-content-end">
                                        <button type="button" className="flext-right btn btn-outline-primary btn-sm" onClick={doSave}>
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
