import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dispatch } from 'services/Store';
import 'moment/locale/pt-br';
import { fetchBillsMonthResume } from 'reducers/bills/billsAction';
import { bundle } from 'i18n/bundle';
import _ from 'lodash';
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';
import { getLang } from 'i18n/lang';

moment.locale(getLang().toLowerCase());
let config = {
    chart: {
        toolbar: {
            show: true
        }
    },
    colors: ['#9a0400', '#545454'],
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
        labels: {
            formatter: value => {
                return moment.months(value);
            }
        }
    }
};
const BillsGraph = () => {
    const dispacth = useDispatch();
    const monthResume = useSelector(state => state.bills.monthResume);
    const refresh = useSelector(state => state.global.refresh);
    const [series, setSeries] = useState([]);
    const [options, setOptions] = useState({});

    useEffect(() => {
        dispatch(fetchBillsMonthResume());
    }, [dispacth, refresh]);

    useEffect(() => {
        setOptions({ ...config, xaxis: { ...config.xaxis, categories: _.map(monthResume, 'month') } });
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
                <div className="remove-padding">
                    <ReactApexChart options={options} series={series} type="line" width="100%" height="300px" />
                </div>
            </div>
        </div>
    );
};

export default BillsGraph;
