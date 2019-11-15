import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'moment/locale/pt-br';
import { fetchTotalBills } from 'reducers/bills/billsAction';
import { bundle, route } from 'i18n/bundle';
import moment from 'moment';
import { getLang } from 'i18n/lang';
import { formatCurrency } from 'services/Util';
import RegisterLink from 'components/global/RegisterLink';
import { fetchTotalDebits } from 'reducers/debit/debitAction';
import { fetchTotalCredits } from 'reducers/credit/creditAction';

moment.locale(getLang().toLowerCase());

const TotalExtractCard = () => {
    const dispatch = useDispatch();
    const debitMonth = useSelector(state => state.debit.totalMonth);
    const creditMonth = useSelector(state => state.credit.totalMonth);

    const year = moment().get('year');
    const month = moment().month();
    const [filter] = useState({
        year: year,
        month: month + 1
    });

    useEffect(() => {
        dispatch(fetchTotalCredits(filter));
        dispatch(fetchTotalDebits(filter));
    }, [dispatch]);

    const getBalance = () => {
        const diff = debitMonth.amount - creditMonth.amount;
        if(diff > 0){
            return <span className="text-danger">- {formatCurrency(Number(debitMonth.amount - creditMonth.amount).toFixed(2))}</span>
        }
        return <span className="text-primary">{formatCurrency(Number(debitMonth.amount - creditMonth.amount).toFixed(2))}</span>
    }

    return (
        <div className="col-12 col-lg-4 pl-0">
            <div className="card content card-month-resume extract">
                <div className="card-body p-1">
                    <div className="d-flex">
                        <div className="month-info flex-column ">
                            <span className="text-primary">{bundle('extract')}</span>
                            <span>{filter.month}/{filter.year}</span>
                        </div>
                    </div>
                    <div className=" d-flex flex-column resume">
                        <small className="font-weight-bold  text-muted">{bundle('total.received')}:</small>
                        <span className="font-weight-bold">
                            {formatCurrency(Number(creditMonth.amount).toFixed(2))}
                        </span>
                        <small className="font-weight-bold text-muted">{bundle('total.speding')}:</small>
                        <span className="font-weight-bold">
                            {formatCurrency(Number(debitMonth.amount).toFixed(2))}
                        </span>
                    </div>
                    <div className="d-flex flex-column pending">
                        <small className="font-weight-bold text-muted">{bundle('balance')}:</small>
                        <span className="font-weight-bold pending-value">
                           {getBalance()}
                        </span>
                        <RegisterLink to={route('opened.bills')} className="w-100">
                            <button type="button" className="btn btn-sm w-100 btn-light">{bundle('view.more')}</button>
                        </RegisterLink>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TotalExtractCard;
