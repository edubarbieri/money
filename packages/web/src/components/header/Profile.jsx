import React, { useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {SET_TOKEN} from 'store/userActions'
import { Link } from "react-router-dom";
import getBundle from 'i18n/bundle';
import route from 'i18n/route';
import 'sass/header';
import 'sass/typography';

const Profile = () => {
    const userProfile = useSelector(state => state.user.profile);
    const [expanded, setExpanded] = useState(false);
    const dispatch = useDispatch();

    const logout = () =>{
        dispatch({ type: SET_TOKEN, payload: ''});
    }

    return (
        <ul className="user-info pull-right">
            <li className={(expanded) ? 'profile-info dropdown open' : 'profile-info dropdown'}>
                <div data-toggle="dropdown" 
                    className="dropdown-toggle" 
                    aria-expanded={expanded}
                    onClick={() => setExpanded(!expanded)}>
                    <img className="img-circle avatar"  alt="" src={userProfile.avatar} />
                </div>
                <ul className="dropdown-menu">
                    <li className="user-detailed-info">
                        <div className="avatar-container">
                            <img className="img-circle avatar"  alt="" src={userProfile.avatar} />
                        </div>
                        <strong>{userProfile.name}</strong><br/>
                        {userProfile.email}
                    </li>
                    <li className="divider"></li>
                    <li>
                        <Link to={route('my.account')}>
                            <div onClick={() => setExpanded(false)}>
                                <i className="fas fa-user-cog f12"></i>
                                {getBundle('account.settings')}
                            </div>
                        </Link>
                    </li>
                    <li>
                        <div onClick={logout}>
                            <i className="fas fa-sign-out-alt f12"></i>
                            {getBundle('logout')}
                        </div>
                    </li>
                </ul>
            </li>
            <div onClick={() => setExpanded(false)} className="bg-fixed"></div>
        </ul>
    );
}

export default Profile;