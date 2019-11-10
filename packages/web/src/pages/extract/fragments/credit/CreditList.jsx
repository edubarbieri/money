import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bundle } from 'i18n/bundle';
import { formatCurrency } from 'services/Util';
import Pagination from 'components/global/fragments/Pagination';
import { fetchCredits } from 'reducers/credit/creditAction';
import CreditListItem from './CreditListItem';

const CreditList = ({filterData}) => {
    const dispatch = useDispatch();
    const credits = useSelector(state => state.credit.all);
    const refresh = useSelector(state => state.credit.refresh);
    const wallet = useSelector(state => state.wallet.wallet);
    const [filter, setFilter] = useState(filterData);

    useEffect(() => {
        dispatch(fetchCredits(filter));
    }, [dispatch, filter, refresh, wallet]);


    const sum = key => {
        let total = 0;
        for (let index = 0; index < credits.data.length; index++) {
            const element = credits.data[index];
            total = total + element[key];
        }
        return formatCurrency(Number(total).toFixed(2));
    };

    return (
        <div className="mt-3">
            <div className="row">
                <div className="col-12">
                    <div className="list">
                        {credits.data && credits.data.map(credit => <CreditListItem key={credit.id} credit={credit} />)}
                    </div>
                </div>
            </div>
            {credits.data && (
                <div className="row">
                    <div className="col-12">
                        <div className="content mb-0 boxshadowless text-right">
                            <span className="font-weight-bold text-primary">{bundle('total.received')}:</span>
                            <span className="ml-1 font-weight-bold">{sum('amount')}</span>
                        </div>
                    </div>
                </div>
            )}
            <div className="row">
                <div className="col-12">
                    <div>
                        <Pagination
                            className="danger"
                            page={filter.page}
                            setPage={page => setFilter({ ...filter, page: page })}
                            totalPages={credits.totalPages}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreditList;
