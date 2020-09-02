import React from 'react';
import moment from 'moment';
import { bundle } from 'i18n/bundle';

const BillsDateSelect = ({filter, setFilter, className = ''}) => {
    const year = moment().get('year');
    const getMonths = () => {
        return moment.months().map((month, idx) => (
            <option key={idx} value={idx + 1}>
                {month}
            </option>
        ))
    }

    return (
        <form className={'form form-inline content flex-end ' + className}>
            <div className="horizontal-form-group">
                <label className="text-danger" htmlFor="monthSelector">
                    {bundle('month')}:
                </label>
                <select
                    className="form-control"
                    id="monthSelector"
                    value={filter.month}
                    onChange={event => setFilter({ ...filter, month: Number(event.target.value) })}>
                    {getMonths()}
                </select>
            </div>
            <div className="horizontal-form-group">
                <label className="text-danger" htmlFor="monthSelector">
                    {bundle('year')}:
                </label>
                <select
                    className="form-control bill"
                    id="yearSelector"
                    value={filter.year}
                    onChange={event => setFilter({ ...filter, year: Number(event.target.value) })}>
                    <option value={year - 2}>{year - 2}</option>
                    <option value={year - 1}>{year - 1}</option>
                    <option value={year}>{year}</option>
                    <option value={year + 1}>{year + 1}</option>
                    <option value={year + 2}>{year + 2}</option>
                </select>
            </div>
        </form>
    );
};

export default BillsDateSelect;
