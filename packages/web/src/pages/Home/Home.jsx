import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from 'reducers/global/globalAction';
import BillsGraph from 'components/bills/BillsGraph';
import ExtractGraph from 'components/bills/ExtractGraph';

const Home = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setLoading(false));
    }, [dispatch]);

    return (
        <div className="row">
            <div className="col-12 col-md-4">
                <BillsGraph />
            </div>
            <div className="col-12 col-md-4">
                <ExtractGraph />
            </div>
        </div>
    );
};

export default Home;
