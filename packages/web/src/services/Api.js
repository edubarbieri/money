// @ts-ignore
import config from 'config/general.yaml';
// @ts-ignore
import apiServices from 'config/apiServices.yaml';
import axios from 'axios';
import { Store } from 'reducers/index';
import { jsonQuerystringfy, messageFormat } from './Util';
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

const buildUrlWithoutParams = (definition, urlParams) => {
    let finalUrl = getHost() + messageFormat(definition.url, urlParams);
    return finalUrl;
};

const buildUrlWithParams = (definition, data = {}, urlParams = []) => {
    const finalUrl = getHost() + messageFormat(definition.url, urlParams);
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

export const call = async (api, data = {}, urlParams = []) => {
    const def = apiServices[api];
    if (!def) {
        return {};
    }

    if (def.pushToken && !getToken()) {
        return {};
    }

    if (def.pushWallet && !getWallet()) {
        return {};
    }

    switch (def.method) {
        case 'GET':
            return axios.get(buildUrlWithParams(def, data, urlParams), getConfig(def));
        case 'POST':
            return axios.post(buildUrlWithoutParams(def, urlParams), data, getConfig(def));
        case 'DELETE':
            return axios.delete(buildUrlWithParams(def, data, urlParams), getConfig(def));
        case 'PUT':
            return axios.put(buildUrlWithoutParams(def, urlParams), data, getConfig(def));
        default:
            return {};
    }
};
