import { call } from "services/Api";
import { setRefresh, setError } from "reducers/global/globalAction";
import { bundle } from "i18n/bundle";
import _ from 'lodash';

export const setWallet = (data) => {
	return dispatch => {
        dispatch({type: 'SET_WALLET', payload: data});
		dispatch(setRefresh());
    };
}

export const setRemoveWallet = (data) => {
	return dispatch => {
        call('wallet.remove', {}, [data.id]).then(res => {
			dispatch(fetchWallets());
		})
    };
}

export const saveWallet = (data) => {
	return dispatch => {
		const service = data.id ? 'wallet.update' : 'wallet.create';
        call(service, data, [data.id]).then(res => {
			if(!data.id){
				dispatch(setCreatedWallet(res.data));
			}
			dispatch(fetchWallets());
		})
    };
}

export const removeWalletUser = (data) => {
	return dispatch => {
        call('wallet.removeUser', data, [data.id]).then(res => {
			if (res.status > 400) {
				dispatch(setError('userWallet', res.errors));
			}
			dispatch(fetchWallets());
		})
    };
}


const checkUserInWallet = (currentEditWallet, id) => {
	return _.find(currentEditWallet.users, {id: id});
}

export const addWalletUser = (data) => {
	return (dispatch, getState) => {
        call('user.findByEmail', {email: data.email}).then(res => {
			const userId = res.data.id;
			if(!userId){
				dispatch(setError('userWallet', [bundle('member.not.found')]))
                return;
			}

			const currentEditWallet =  _.find(getState().wallet.all, {id:data.id});
			if(checkUserInWallet(currentEditWallet, userId)){
				dispatch(setError('userWallet', [bundle('member.already.wallet')]));
				return;
			}

			data.userId = res.data.id;
			call('wallet.addUser', data, [data.id]).then(res => {
				if (res.status > 400) {
					dispatch(setError('userWallet', res.errors));
				}
				dispatch(fetchWallets());
			}).catch(err => {
				dispatch(setError('userWallet', ['generic.error']));
			})
		})
    };
}

export const fetchWallets = () => {
	return  {
		type: 'SET_ALL_WALLET',
		payload: call('wallet.getAllWithUser')
	};
}

export const setCreatedWallet = (data) => {
	return  {
		type: 'SET_CREATED',
		payload: data
	};
}
