import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'moment/locale/pt-br';
import { fetchTotalBills } from 'reducers/bills/billsAction';
import { bundle, route } from 'i18n/bundle';
import moment from 'moment';
import { getLang } from 'i18n/lang';
import { formatCurrency } from 'services/Util';
import RegisterLink from 'components/global/RegisterLink';
import {toPattern} from 'vanilla-masker';

moment.locale(getLang().toLowerCase());

const TotalBillsCard = () => {
    const dispatch = useDispatch();
    const monthResume = useSelector(state => state.bills.totalMonth);
    const refresh = useSelector(state => state.global.refresh);
    
    const year = moment().get('year');
    const month = moment().month();
    const [filter, setFilter] = useState({
        year: year,
        month: month + 1
    });
    
    const [expanded, setExpanded] = useState(false);
    const [date, setDate] = useState(filter.month +'/'+ filter.year);

    const setDateFilter = (event) => {
        let value = event.target.value;
        if(value.length === 2){
            value =  toPattern(value, '99/9999');
        }
        setDate(value);
    }


    const changeFilterSubmit = (event) => {
        event.preventDefault();
        changeFilter();
    }

    const changeFilter = () => {
        const submitDate =  toPattern(date, '99/9999');
        if(!moment(submitDate, 'MM/YYYY').isValid()){
            return;
        }
        const [month, year] = submitDate.split('/');
        setFilter({month: Number(month), year: Number(year)});
        setExpanded(false);
        setDate(submitDate);
    }
    
    useEffect(() => {
        dispatch(fetchTotalBills(filter));
    }, [dispatch, filter, refresh]);

    return (
        <div className="col-12 col-lg-4 pl-0">
            <div className="card content card-month-resume">
                <div className="card-body p-1">
                    <div className="d-flex">
                        <div className="month-info flex-column" onClick={() => setExpanded(true)}>
                            <span className="text-danger">{bundle('bills')}</span>
                            {!expanded && <span>{filter.month}/{filter.year}</span>}
                            {expanded && <form onSubmit={changeFilterSubmit} className="text-center">
                                <input type="text" 
                                    autoFocus 
                                    className="input-wizard"
                                    value={date}
                                    onBlur={changeFilter} 
                                    onChange={setDateFilter}/>
                            </form>}
                        </div>
                    </div>
                    <div className=" d-flex flex-column resume">
                        <small className="font-weight-bold text-muted">{bundle('total.bill')}:</small>
                        <span className="font-weight-bold">
                            {formatCurrency(Number(monthResume.amount).toFixed(2))}
                        </span>
                        <small className="font-weight-bold  text-muted">{bundle('total.payed')}:</small>
                        <span className="font-weight-bold">
                            {formatCurrency(Number(monthResume.amountPayed).toFixed(2))}
                        </span>
                    </div>
                    <div className="d-flex flex-column pending">
                        <small className="font-weight-bold text-muted">{bundle('pending')}:</small>
                        <span className="font-weight-bold text-danger pending-value">
                            {formatCurrency(Number(monthResume.amount - monthResume.amountPayed).toFixed(2))}
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

export default TotalBillsCard;
