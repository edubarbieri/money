import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bundle } from 'i18n/bundle';
import { formatCurrency } from 'services/Util';
import Pagination from 'components/global/fragments/Pagination';
import { fetchCredits, setCreditsFilter, fetchTotalCredits } from 'reducers/credit/creditAction';
import CreditListItem from './CreditListItem';

const CreditList = ({filterData}) => {
    const dispatch = useDispatch();
    const credits = useSelector(state => state.credit.all);
    const refresh = useSelector(state => state.credit.refresh);
    const filter = useSelector(state => state.credit.filter);
    const wallet = useSelector(state => state.wallet.wallet);
    const totalMonth = useSelector(state => state.credit.totalMonth);

    useEffect(() => {
        if(!filter || !filter.month){
            return;
        }
        dispatch(fetchCredits(filter));
        dispatch(fetchTotalCredits(filter));
    }, [dispatch, filter, refresh, wallet]);

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
                            <span className="ml-1 font-weight-bold">{formatCurrency(Number(totalMonth.amount).toFixed(2))}</span>
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
                            setPage={page => dispatch(setCreditsFilter({ ...filter, page: page }))}
                            totalPages={credits.totalPages}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreditList;
