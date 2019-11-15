import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from 'reducers/global/globalAction';
import BillsGraph from 'components/graph/BillsGraph';
import ExtractGraph from 'components/graph/ExtractGraph';
import FastOptions from 'components/global/fragments/FastOptions';
import TotalBillsCard from 'components/cards/TotalBillsCard';
import TotalExtractCard from 'components/cards/TotalExtractCard';

const Home = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setLoading(false));
    }, [dispatch]);

    return (
        <div className="container-fluid">
            <div className="row">
                <FastOptions />
                <TotalBillsCard />
                <TotalExtractCard />
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
