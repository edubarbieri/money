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
    colors: ['#9a0400', '#1b1b1b', '#ffc107'],
    dataLabels: {enabled: false},
    grid: {
        borderColor: '#e7e7e7'
    },
    markers: {
        size: 5
    },
    yaxis: {
        show: true,
        labels: {
            formatter: value => {
                if(value >= 1000){
                    return bundle('currency') + ' ' + (value / 1000) + 'k'
                }
                return bundle('currency')  + ' ' + parseFloat(value);
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
