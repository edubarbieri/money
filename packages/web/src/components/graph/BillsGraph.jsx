import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'moment/locale/pt-br';
import { fetchBillsMonthResume } from 'reducers/bills/billsAction';
import { bundle } from 'i18n/bundle';
import _ from 'lodash';
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';
import { getLang } from 'i18n/lang';
import { billsConfig } from './GraphConfig';

moment.locale(getLang().toLowerCase());

const BillsGraph = () => {
    const dispacth = useDispatch();
    const monthResume = useSelector(state => state.bills.monthResume);
    const refresh = useSelector(state => state.global.refresh);
    const [series, setSeries] = useState([]);
    const [options, setOptions] = useState({});

    useEffect(() => {
        dispacth(fetchBillsMonthResume());
    }, [dispacth, refresh]);

    useEffect(() => {
        if(!monthResume.length){
            return;
        }
        let auxMonth = [];
        let months = _.map(monthResume, 'month');
        for (let index = 0; index < months.length; index++) {
            const element = months[index];
            auxMonth.push(moment.months(element))
        }
        setOptions({ ...billsConfig, xaxis: { ...billsConfig.xaxis, categories: auxMonth} });
        setSeries([
            {
                name: bundle('total'),
                data: _.map(monthResume, 'amount')
            }
        ]);
    }, [monthResume]);

    return (
        <div className="card">
            <div className="card-body">
                <h5 className="card-title text-center text-danger">{bundle('bills.last.months')}</h5>
                <div className="remove-padding fix-graph">
                    <ReactApexChart options={options} series={series} type="line" width="100%" height="300px" />
                </div>
            </div>
        </div>
    );
};

export default BillsGraph;
