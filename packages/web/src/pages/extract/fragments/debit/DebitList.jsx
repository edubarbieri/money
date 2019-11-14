import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bundle } from 'i18n/bundle';
import { formatCurrency } from 'services/Util';
import Pagination from 'components/global/fragments/Pagination';
import { fetchDebits, setDebitFilter, fetchTotalDebits } from 'reducers/debit/debitAction';
import DebitListItem from './DebitListItem';

const DebitList = ({filterData}) => {
    const dispatch = useDispatch();
    const debits = useSelector(state => state.debit.all);
    const refresh = useSelector(state => state.debit.refresh);
    const wallet = useSelector(state => state.wallet.wallet);
    const filter = useSelector(state => state.debit.filter);
    const totalMonth = useSelector(state => state.debit.totalMonth);

    useEffect(() => {
        if(!filter || !filter.month){
            return;
        }
        dispatch(fetchDebits(filter));
        dispatch(fetchTotalDebits(filter));
    }, [dispatch, filter, refresh, wallet]);

    return (
        <div className="mt-3">
            <div className="row">
                <div className="col-12">
                    <div className="list">
                        {debits.data && debits.data.map(debit => <DebitListItem key={debit.id} debit={debit} />)}
                    </div>
                </div>
            </div>
            {debits.data && (
                <div className="row">
                    <div className="col-12">
                        <div className="content mb-0 boxshadowless text-right">
                            <span className="font-weight-bold text-danger">{bundle('total.speding')}:</span>
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
                            setPage={page => dispatch(setDebitFilter({ ...filter, page: page }))}
                            totalPages={debits.totalPages}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DebitList;
