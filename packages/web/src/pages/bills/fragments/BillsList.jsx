import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bundle } from 'i18n/bundle';
import moment from 'moment';
import { fetchBills} from 'reducers/bills/billsAction';
import { formatCurrency } from 'services/Util';
import Pagination from 'components/global/fragments/Pagination';
import BillsDateSelect from './BillsDateSelect';
import BillListItem from './BillListItem';

const BillsList = () => {
    const dispatch = useDispatch();
    const year = moment().get('year');
    const month = moment().month();
    const bills = useSelector(state => state.bills.all);
    const refresh = useSelector(state => state.bills.refresh);
    const wallet = useSelector(state => state.wallet.wallet);
    const [filter, setFilter] = useState({
        withCategory: true,
        withUser: true,
        pageSize: 20,
        page: 1,
        order: 'dueDate_ASC',
        year: year,
        month: month + 1
    });

    useEffect(() => {
        dispatch(fetchBills(filter));
    }, [dispatch, filter, refresh, wallet]);


    const sum = key => {
        let total = 0;
        for (let index = 0; index < bills.data.length; index++) {
            const element = bills.data[index];
            total = total + element[key];
        }
        return formatCurrency(Number(total).toFixed(2));
    };

    
    return (
        <div className="mt-3">
            <div className="row">
                <div className="col-12">
                    <BillsDateSelect filter={filter} setFilter={setFilter} className="mobile-dateselector" />
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="content list">
                        {bills.data && bills.data.map(bill => <BillListItem key={bill.id} bill={bill} />)}
                    </div>
                </div>
            </div>
            {bills.data && (
                <div className="row">
                    <div className="col-12">
                        <div className="content boxshadowless text-right">
                            <span className="font-weight-bold text-danger">{bundle('total.payed')}:</span>
                            <span className="ml-1 font-weight-bold">{sum('amountPaid')}</span><br/>
                            <span className="font-weight-bold text-danger">{bundle('total.bill')}:</span>
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
                            totalPages={bills.totalPages}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillsList;
