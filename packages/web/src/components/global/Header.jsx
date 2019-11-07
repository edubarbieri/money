import React from 'react';
import { useSelector , useDispatch} from 'react-redux';
import { Link } from 'react-router-dom';
import 'style/header.scss';
import { route, bundle } from 'i18n/bundle';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUserCog, faSignOutAlt, faBars} from '@fortawesome/free-solid-svg-icons';
import { doLogout } from 'reducers/auth/authAction';
import { setToogle } from 'reducers/global/globalAction';
import RegisterLink from './RegisterLink';

const Header = () => {
    const user = useSelector(state => state.user.data);
    const dispatch = useDispatch();
    const toogle = useSelector(state => state.global.toogle);
    return (
        <header className="navbar navbar-light bg-light flex-column flex-md-row">
            <div className="menu-header" onClick={() => dispatch(setToogle('sidebar'))}>
                <FontAwesomeIcon icon={faBars} />
            </div>
            <Link className="navbar-brand" to={process.env.PUBLIC_URL || '/'}>
                <img src={process.env.PUBLIC_URL + '/img/lh-large.png'} width="160" height="40" alt="" />
            </Link>
            <div className="user-header">
                <div className="avatar" onClick={() => dispatch(setToogle('userInfo'))}>
                    <img src={user.avatar} alt={user.name + ' profile picture'} />
                </div>
                <div className={toogle === 'userInfo' ? 'user-info show' : 'user-info '}>
                    <div className="avatar">
                        <img src={user.avatar} alt={user.name + ' profile picture'} />
                    </div>
                    <h6 className="text-center font-weight-bold">{user.name}</h6>
                    <p className="text-center text-muted">{user.email}</p>
                    <div className="dropdown-divider"></div>
                    <div className="dopdown-actions">
                        <RegisterLink to={route('my.account')}>
                            <div className="dropdown-item" onClick={() =>dispatch(setToogle(''))}>
                                <FontAwesomeIcon icon={faUserCog} />
                                <span>{bundle('account.settings')}</span>
                            </div>
                        </RegisterLink>
                        <div className="dropdown-item" onClick={() => dispatch(doLogout())}>
                            <FontAwesomeIcon icon={faSignOutAlt} />
                            <span>{bundle('logout')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
