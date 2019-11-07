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

moment.locale(getLang().toLowerCase());
let config = {
    chart: {
        toolbar: {
            show: true
        }
    },
    colors: ['#007fbb', '#9a0400'],
    dataLabels: {enabled: false},
    stroke: { curve: 'smooth' },
    grid: {
        borderColor: '#e7e7e7'
    },
    markers: {
        size: 6
    },
    yaxis: {
        title: {
            text: bundle('total')
        },
        labels: {
            formatter: value => {
                return bundle('currency') + parseFloat(value).toFixed(2);
            }
        }
    },
    xaxis: {
        categories: [],
        labels: {
            formatter: value => {
                return moment.months(value);
            }
        }
    },
    legend: {
        position: 'top',
        horizontalAlign: 'left',
        floating: true,
        offsetX: 8,
        offsetY: -8
    }
};
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
        if(!creditMonthResume.length || !debitMonthResume.length){
            return;
        }
        setOptions({ ...config, xaxis: { ...config.xaxis, categories: _.map(creditMonthResume, 'month') } });
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
                <div className="remove-padding">
                    <ReactApexChart options={options} series={series} type="line" width="100%" height="300px" />
                </div>
            </div>
        </div>
    );
};

export default ExtractGraph;
