import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'moment/locale/pt-br';
import { bundle } from 'i18n/bundle';
import _ from 'lodash';
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';
import { getLang } from 'i18n/lang';
import { fetchCreditMonthResume } from 'reducers/credit/creditAction';
import { fetchDebitMonthResume } from 'reducers/debit/debitAction';
import { extractConfig } from './GraphConfig';
import { fetchBillsMonthResume } from 'reducers/bills/billsAction';

moment.locale(getLang().toLowerCase());

const ExtractGraph = () => {
    const dispatch = useDispatch();
    const creditMonthResume = useSelector(state => state.credit.monthResume);
    const debitMonthResume = useSelector(state => state.debit.monthResume);
    const billsMonthResume = useSelector(state => state.bills.monthResume);
    const refresh = useSelector(state => state.global.refresh);
    const [series, setSeries] = useState([]);
    const [options, setOptions] = useState({});

    useEffect(() => {
        dispatch(fetchCreditMonthResume());
        dispatch(fetchDebitMonthResume());
        dispatch(fetchBillsMonthResume());
    }, [dispatch, refresh]);

    useEffect(() => {
        if ((!creditMonthResume.length && !debitMonthResume.length) || !billsMonthResume.length) {
            return;
        }
        let auxMonth = [];
        let months = _.map(billsMonthResume, 'month');
        if (_.isEmpty(months)) {
            return;
        }

        let lastIndex = 0;
        for (let date = months[0]; date < _.last(months); date++) {
            if (!_.find(creditMonthResume, { month: date })) {
                creditMonthResume.splice(lastIndex, 0, { amount: 0, month: date });
            }
            if (!_.find(debitMonthResume, { month: date })) {
                debitMonthResume.splice(lastIndex, 0, { amount: 0, month: date });
            }
            if (!_.find(billsMonthResume, { month: date })) {
                billsMonthResume.splice(lastIndex, 0, { amount: 0, month: date });
            }
            lastIndex++;
        }

        months = _.map(billsMonthResume, 'month');
        for (let index = 0; index < months.length; index++) {
            const element = months[index];
            auxMonth.push(moment.monthsShort(element));
        }

        setOptions({ ...extractConfig, xaxis: { ...extractConfig.xaxis, categories: auxMonth } });
        setSeries([
            {
                name: bundle('bills'),
                data: _.map(billsMonthResume, 'amount')
            },
            {
                name: bundle('credit'),
                data: _.map(creditMonthResume, 'amount')
            },
            {
                name: bundle('debit'),
                data: _.map(debitMonthResume, 'amount')
            }
        ]);
    }, [creditMonthResume, debitMonthResume, billsMonthResume]);

    return (
        <div className="col-12 col-lg-4 p-0">
            <div className="card content">
                <div className="card-body p-0">
                    <h5 className="card-title pl-1">{bundle('extract.last.months')}</h5>
                    <div className="fix-graph">
                        <ReactApexChart options={options} series={series} type="line" width="100%" height="200px" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExtractGraph;
