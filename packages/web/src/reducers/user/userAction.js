import { call } from "services/Api";
import { setError } from "reducers/global/globalAction";

export const setUserData = (data) => {
	return {
		type: 'SET_DATA',
		payload: data
	}
}

export const setUserLang = (data) => {
	return {
		type: 'SET_LANG',
		payload: data
	}
}

export const setUpdateUser = ({name, avatar, id}) => {
	return dispatch => {
        call('user.update', {name, avatar}, [id]).then(res => {
			if(res.data.errors){
                dispatch(setError('user', res.data.errors))
                return;
            }
			dispatch(setUserData(res.data));
		}).catch(err => {
            const result = err.response.data;
            if(result && result.errors){
                dispatch(setError('user', result.errors))
                return;
            }
        })
    };
}

