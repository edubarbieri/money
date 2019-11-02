import React, { useState } from 'react';
import { useSelector , useDispatch} from 'react-redux';
import { Link } from 'react-router-dom';
import 'style/header.scss';
import { route, bundle } from 'i18n/bundle';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUserCog, faSignOutAlt} from '@fortawesome/free-solid-svg-icons';
import { doLogout } from 'reducers/auth/authAction';

const Header = () => {
    const user = useSelector(state => state.user.data);
    const dispatch = useDispatch();
    const [showUserInfo, setShowUserInfo] = useState(false);
    return (
        <header className="navbar navbar-light bg-light flex-column flex-md-row">
            <a className="navbar-brand" href={process.env.PUBLIC_URL}>
                <img src={process.env.PUBLIC_URL + '/img/lh-large.png'} width="160" height="40" alt="" />
            </a>
            <div className="user-header">
                <div className="avatar" onClick={() => setShowUserInfo(!showUserInfo)}>
                    <img src={user.avatar} alt={user.name + ' profile picture'} />
                </div>
                <div className={showUserInfo ? 'user-info show' : 'user-info '}>
                    <div className="avatar">
                        <img src={user.avatar} alt={user.name + ' profile picture'} />
                    </div>
                    <h5 className="text-center font-weight-bold">{user.name}</h5>
                    <h6 className="text-center text-muted">{user.email}</h6>
                    <div className="dropdown-divider"></div>
                    <div className="dopdown-actions">
                        <Link to={route('my.account')}>
                            <div className="dropdown-item" onClick={() => setShowUserInfo(false)}>
                                <FontAwesomeIcon icon={faUserCog} />
                                <text>{bundle('account.settings')}</text>
                            </div>
                        </Link>
                        <div className="dropdown-item" onClick={() => dispatch(doLogout())}>
                            <FontAwesomeIcon icon={faSignOutAlt} />
                            <text>{bundle('logout')}</text>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
