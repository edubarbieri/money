import { bundle } from "i18n/bundle";
import moment from 'moment';
import { getLang } from 'i18n/lang';
moment.locale(getLang().toLowerCase());

export const extractConfig = {
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
    legend: {
        position: 'top',
        horizontalAlign: 'left',
        floating: true,
        offsetX: 8,
        offsetY: -8
    }
};

export const billsConfig = {
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
    }
};