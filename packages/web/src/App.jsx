import React, {useEffect, useState} from 'react';
import SideBar from './components/sidebar/SideBar';
import Container from './components/container/Container';
import Auth from './pages/auth/Auth';
import {WINDOW_WIDTH, SET_STARTED} from 'store/globalActions'
import {SET_TRANSIENT, SET_USER} from 'store/userActions'
import { BrowserRouter } from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux'
import './styles/sass/global';
import {auth} from 'mymoney-sdk';
import {debounce} from 'lodash';
import LoaderFragment from 'components/loader/LoaderFragment';

const App = () => {
    const dispatch = useDispatch();
    const isTransient  = useSelector(state => state.user.transient);
    const token  = useSelector(state => state.user.token);
    const emptyUser = {transient: true, activeWallet: {}, profile: {}, token: ''};
    const [validatedToken, setValidateToken] = useState(false);
    const debouncedCheckSize = debounce(() => {
        dispatch({ type: WINDOW_WIDTH, payload: window.innerWidth });
    }, 100);

    useEffect(() => {
        window.addEventListener("resize", debouncedCheckSize);
    });

    const checkIsValidToken = () => {
        auth.validateToken(token).then(isValid => {
            setValidateToken(true);
            dispatch({ type: SET_STARTED, payload: true });
            if(isValid){
                dispatch({ type: SET_TRANSIENT, payload: false });
                return;
            }
            dispatch({ type: SET_USER, payload: emptyUser });
        }).catch(err => {
            dispatch({ type: SET_USER, payload: emptyUser });
        });
    } 

    useEffect(checkIsValidToken, [token]);


    const getContent = () => {
        return isTransient ?  <Auth /> : 
            <div className="page-container">
                <SideBar/>
                <Container/>
            </div >
    }

    return <BrowserRouter>
        {validatedToken ? getContent() : <LoaderFragment />}
    </BrowserRouter>
    
}

export default App;