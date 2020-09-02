import React from 'react';
import moment from 'moment';
import {useSelector} from 'react-redux';
import 'style/steps.scss';
import 'moment/locale/pt-br';
import { getLang } from 'i18n/lang';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faQuestion, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { formatCurrency, isMobile } from 'services/Util';
import { bundle } from 'i18n/bundle';
moment.locale(getLang().toLowerCase());

const PlanMonthCheck = ({initDate, endDate}) => {
    const resize = useSelector(state => state.global.resize);

    const formatMonth = value => {
        let date = moment();
        if (value < 0) {
            date = moment().subtract(value * -1, 'months');
        } else {
            date = moment().add(value, 'months');
        }
        return `${date.format('MMM')}/${date.format('YY')}`;
    };

    const renderDate = () => {
        let diffInit = moment(initDate).diff(moment(), 'months');
        let diffEnd = moment(endDate).diff(moment(), 'months');

        let count = 0;
        let loop = Array(9);
        if(isMobile(resize)){
            diffInit = 1;
            loop = Array(3);
        }else{
            if (diffInit > 4) {
                diffInit = 4;
            }
            if (diffEnd < 4) {
                diffInit = diffInit + (3 - diffEnd);
            }
        }
        diffInit = diffInit * -1;

        return [...loop].map(() => {
            const currentMonth = diffInit + count;
            const dateFormatted = formatMonth(currentMonth);
            let stepStatus = 'pending';
            let icon = stepStatus;
            if (currentMonth === 0) {
                stepStatus = icon = 'active';
            } else if (currentMonth < 0) {
                stepStatus = 'completed';
                if (currentMonth === -2) {
                    stepStatus += ' done';
                    icon = 'done';
                } else {
                    stepStatus += ' failed';
                    icon = 'failed';
                }
            }

            count++;
            return (
                <li className={stepStatus} key={dateFormatted}>
                    <span className="bubble">
                        {icon === 'pending' && <FontAwesomeIcon className="status-icon pending" icon={faQuestion} />}
                        {icon === 'done' && <FontAwesomeIcon className="status-icon done" icon={faCheck} />}
                        {icon === 'failed' && <FontAwesomeIcon className="status-icon failed" icon={faTimes} />}
                        {icon === 'active' && <FontAwesomeIcon className="status-icon active" icon={faCalendar} />}
                    </span>
                    {dateFormatted}
                    {icon === 'done' && (
                        <div className="month-resume">
                            <span className="content-badge text-danger">-&nbsp;{formatCurrency(-10.23)}</span>
                            <span className="content-badge text-primary">+&nbsp;{formatCurrency(150.23)}</span>
                            <span className="content-badge text-primary">+&nbsp;{formatCurrency(245.2)}</span>
                        </div>
                    )}
                    {(icon === 'failed' || icon === 'pending') && (
                        <div className="month-resume">
                            <span className="content-badge text-muted">{formatCurrency(0.0)}</span>
                        </div>
                    )}
                    {icon === 'active' && (
                        <div className="month-resume current-month">
                            <span className="content-badge text-primary">{formatCurrency(150.23)}</span>
                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <div className="input-group-text">{bundle('currency')}</div>
                                    </div>
                                    <input
                                        type="number"
                                        className="form-control border-left-0"
                                        value={formatCurrency(120.01)}
                                    />
                                </div>
                                <button type="button" className="btn btn-primary p-0 pl-1 pr-1 shadow-sm f-075">
                                    {bundle('apply')}
                                </button>
                            </div>
                            <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-prepend">
                                        <div className="input-group-text">{bundle('currency')}</div>
                                    </div>
                                    <input
                                        type="number"
                                        className="form-control border-left-0"
                                        value={formatCurrency(120.01)}
                                    />
                                </div>
                                <button type="button" className="btn btn-danger p-0 pl-1 pr-1 shadow-sm f-075">
                                    {bundle('rescue')}
                                </button>
                            </div>
                        </div>
                    )}
                </li>
            );
        });
    };

    return (
        <div className="w-100">
            <h5 className="text-primary font-600 month-resume-title">{bundle('monthly.tracking')}</h5>
            <ul className="progress-indicator">{renderDate()}</ul>
        </div>
    );
};

export default PlanMonthCheck;
