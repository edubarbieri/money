import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from 'reducers/global/globalAction';
import BillsGraph from 'components/bills/BillsGraph';
import ExtractGraph from 'components/bills/ExtractGraph';
import { bundle } from 'i18n/bundle';

const Home = () => {
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
                <div className="col-12 col-md-6">
                    <BillsGraph />
                </div>
                <div className="col-12 col-md-6">
                    <ExtractGraph />
                </div>
            </div>
        </div>
    );
};

export default Home;
