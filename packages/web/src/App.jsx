import React, {useEffect} from 'react';
import SideBar from './components/sidebar/SideBar';
import Container from './components/container/Container';
import Auth from './pages/auth/Auth';
import {WINDOW_WIDTH, SET_STARTED} from 'store/globalActions'
import {SET_TRANSIENT, SET_USER} from 'store/userActions'
import { BrowserRouter } from "react-router-dom";
import {useSelector, useDispatch} from 'react-redux'
import './styles/sass/global';
import './styles/sass/base';
import './styles/sass/footer';
import './styles/sass/tables';
import {auth} from 'mymoney-sdk';
import {debounce} from 'lodash';

const App = () => {
    const dispatch = useDispatch();
    let isTransient  = useSelector(state => state.user.transient);
    let token  = useSelector(state => state.user.token);
    const emptyUser = {transient: true, activeWallet: {}, profile: {}, token: ''};
    
    const debouncedCheckSize = debounce(() => {
        dispatch({ type: WINDOW_WIDTH, payload: window.innerWidth });
    }, 100);

    useEffect(() => {
        window.addEventListener("resize", debouncedCheckSize);
    });

    const checkIsValidToken = () => {
        auth.validateToken(token).then(isValid => {
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

    return <BrowserRouter>
        {isTransient ?  
            <Auth />
             : 
            <div className="page-container">
                <SideBar/>
                <Container/>
            </div >
        }
    </BrowserRouter>
    
}

export default App;