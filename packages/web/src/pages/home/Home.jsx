import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from 'reducers/global/globalAction';
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
                <ExtractGraph />
            </div>
        </div>
    );
};

export default Home;
