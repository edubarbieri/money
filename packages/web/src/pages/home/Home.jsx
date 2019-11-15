import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from 'reducers/global/globalAction';
import BillsGraph from 'components/graph/BillsGraph';
import ExtractGraph from 'components/graph/ExtractGraph';
import FastOptionsCard from 'components/cards/FastOptionsCard';
import TotalBillsCard from 'components/cards/TotalBillsCard';
import TotalExtractCard from 'components/cards/TotalExtractCard';
import OverdueBillsCard from 'components/cards/OverdueBillsCard';

const Home = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setLoading(false));
    }, [dispatch]);

    return (
        <div className="container-fluid">
            <div className="row">
                <FastOptionsCard />
                <TotalBillsCard />
                <TotalExtractCard />
                <OverdueBillsCard />
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
