import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from 'reducers/global/globalAction';
import { bundle } from 'i18n/bundle';

const WalletManager = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setLoading(false));
    }, [dispatch]);

    return (
        <div className="container-fluid">
            <div className="row">
                <h1 className="page-title">{bundle('dashboard')}</h1>
            </div>
            <div className="row">
                <div className="col-12"></div>
            </div>
        </div>
    );
};

export default WalletManager;
