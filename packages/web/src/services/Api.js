// @ts-ignore
import config from 'config/general.yaml';
// @ts-ignore
import apiServices from 'config/apiServices.yaml';
import axios from 'axios';
import { Store } from 'reducers/index';
import { jsonQuerystringfy } from './Util';
import { setLoading } from 'reducers/global/globalAction';

axios.interceptors.request.use(
    (config) => {
        Store.dispatch(setLoading(true))
        return config;
    },
    (error) => {
        Store.dispatch(setLoading(false))
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    function(response) {
        Store.dispatch(setLoading(false))
        return response;
    },
    function(error) {
        Store.dispatch(setLoading(false))
        return Promise.reject(error);
    }
);

const getHost = () => {
    const isEnvProduction = process.env.NODE_ENV === 'production';
    return isEnvProduction ? config.prodApiUrl : config.devApiUrl;
};

const getToken = () => {
    const state = Store.getState();
    return state.auth.token;
};

const getWallet = () => {
    const state = Store.getState();
    const wallet = state.wallet.wallet;
    return wallet ? wallet.id : '';
};

const buildUrlWithoutParams = definition => {
    let finalUrl = getHost() + definition.url;
    return finalUrl;
};

const buildUrlWithParams = (definition, data = {}) => {
    const finalUrl = getHost() + definition.url;
    if (data) {
        return finalUrl + jsonQuerystringfy(data);
    }
    return finalUrl;
};

const getConfig = def => {
    let headers = {
        'Content-Type': 'application/json'
    };

    if (def.pushToken) {
        headers.Authorization = getToken();
    }

    if (def.pushWallet) {
        headers.walletId = getWallet();
    }
    return {
        headers
    };
};

export const call = async (api, data = {}) => {
    const def = apiServices[api];
    if (!def) {
        return;
    }
    switch (def.method) {
        case 'GET':
            return axios.get(buildUrlWithParams(def, data), getConfig(def));
        case 'POST':
            return axios.post(buildUrlWithoutParams(def), data, getConfig(def));
        case 'DELETE':
            return axios.delete(buildUrlWithParams(def, data), getConfig(def));
        case 'PUT':
            return axios.put(buildUrlWithoutParams(def), data, getConfig(def));
        default:
            return;
    }
};
