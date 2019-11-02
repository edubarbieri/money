export const setLoading = data => {
    return {
        type: 'SET_LOADING',
        payload: data
    };
};

export const setCurrentPage = data => {
    return {
        type: 'SET_CURRENT_PAGE',
        payload: data
    };
};

export const setToogle = data => {
    return {
        type: 'SET_TOOGLE',
        payload: data
    };
};

export const setInitialized = () => {
    return {
        type: 'SET_INITIALIZED',
        payload: null
    };
};

export const setError = (type, data) => {
    let messageType = 'SET_GENERIC_ERROR';
    switch (type) {
        case 'auth':
            messageType = 'SET_AUTH_ERROR';
            break;
        default:
            break;
    }
    return {
        type: messageType,
        payload: data
    };
};
