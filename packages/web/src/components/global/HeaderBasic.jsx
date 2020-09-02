import React from 'react';
import { useSelector , useDispatch} from 'react-redux';
import { Link } from 'react-router-dom';
import 'style/header.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faBars} from '@fortawesome/free-solid-svg-icons';
import { setToogle } from 'reducers/global/globalAction';

const HeaderBasic = () => {
    const user = useSelector(state => state.user.data);
    const dispatch = useDispatch();
    return (
        <header className="navbar navbar-light bg-light flex-column flex-md-row">
            <div className="menu-header" onClick={() => dispatch(setToogle('sidebar'))}>
                <FontAwesomeIcon icon={faBars} />
            </div>
            <Link className="navbar-brand" to={process.env.PUBLIC_URL || '/'}>
                <img src={process.env.PUBLIC_URL + '/img/lh-large.png'} width="160" height="40" alt="" />
            </Link>
            <div className="user-header">
                <div className="avatar">
                    <img src={user.avatar} alt={user.name + ' profile picture'} />
                </div>
            </div>
        </header>
    );
};

export default HeaderBasic;
