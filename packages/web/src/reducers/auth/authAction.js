import { call } from 'services/Api';
import { setUserData } from 'reducers/user/userAction';
import _ from 'lodash';
import { setInitialized, setError } from 'reducers/global/globalAction';

export const setAuthToken = data => {
    return {
        type: 'SET_TOKEN',
        payload: data
    };
};

export const doLogout = () => {
    return {
        type: 'LOGOUT',
        payload: null
    };
};

export const callLogin = async data => {
    return dispatch => {
        call('login', data).then(res => {
            const result = res.data;
            if(result.errors){
                dispatch(setError('auth', result.errors))
                return;
            }
            dispatch(setUserData(_.omit(result, 'token')));
            dispatch(setAuthToken(result));
        }).catch(err => {
            const result = err.response.data;
            if(result && result.errors){
                dispatch(setError('auth', result.errors))
                return;
            }
        });
    };
};

export const callSignup = async data => {
    return dispatch => {
        call('signup', data).then(res => {
            const result = res.data;
            if(result.errors){
                dispatch(setError('auth', result.errors))
                return;
            }
            dispatch(setUserData(_.omit(result, 'token')));
            dispatch(setAuthToken(result));
        }).catch(err => {
            const result = err.response.data;
            if(result && result.errors){
                dispatch(setError('auth', result.errors))
                return;
            }
        });
    };
};

export const callValidateToken = async token => {
    return (dispatch, getState) => {
        if (!token) {
            dispatch(setInitialized());
			dispatch(doLogout());
            return;
        }
        call('validateToken', {token}).then(res => {
            dispatch(setInitialized());
            if (res.data.valid) {
                dispatch(setAuthToken({token}));
				return;
            }
			dispatch(doLogout());
        });
    };
};
