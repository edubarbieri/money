import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dispatch } from 'services/Store';
import 'moment/locale/pt-br';
import { bundle } from 'i18n/bundle';
import _ from 'lodash';
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';
import { getLang } from 'i18n/lang';
import { fetchCreditMonthResume } from 'reducers/credit/creditAction';
import { fetchDebitMonthResume } from 'reducers/debit/debitAction';
import { extractConfig } from './GraphConfig';

moment.locale(getLang().toLowerCase());

const ExtractGraph = () => {
    const dispacth = useDispatch();
    const creditMonthResume = useSelector(state => state.credit.monthResume);
    const debitMonthResume = useSelector(state => state.debit.monthResume);
    const refresh = useSelector(state => state.global.refresh);
    const [series, setSeries] = useState([]);
    const [options, setOptions] = useState({});

    useEffect(() => {
        dispatch(fetchCreditMonthResume());
        dispatch(fetchDebitMonthResume());
    }, [dispacth, refresh]);

    useEffect(() => {
        if(!creditMonthResume.length && !debitMonthResume.length){
            return;
        }
        let auxMonth = [];
        let months = _.map(creditMonthResume, 'month');
        if(_.isEmpty(months)){
            months = _.map(debitMonthResume, 'month');
        }
        for (let index = 0; index < months.length; index++) {
            const element = months[index];
            auxMonth.push(moment.months(element))
        }
        setOptions({ ...extractConfig, xaxis: { ...extractConfig.xaxis, categories: auxMonth } });
        setSeries([
            {
                name: bundle('credit'),
                data: _.map(creditMonthResume, 'amount')
            },
            {
                name: bundle('debit'),
                data: _.map(debitMonthResume, 'amount')
            }
        ]);
    }, [creditMonthResume, debitMonthResume]);

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title text-center text-primary">{bundle('extract.last.months')}</h5>
                <div className="remove-padding fix-graph">
                    <ReactApexChart options={options} series={series} type="line" width="100%" height="300px" />
                </div>
            </div>
        </div>
    );
};

export default ExtractGraph;
