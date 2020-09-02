import React from 'react';
import {Link} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import { setCurrentPage, setToogle } from 'reducers/global/globalAction';

const RegisterLink = ({to, children, className= ''}) => {
    const dispatch = useDispatch();

    return (
        <Link to={to} className={className} onClick={() => {dispatch(setCurrentPage(to)); dispatch(setToogle(''))}}>
            {children}
        </Link>
    );
}

export default RegisterLink;