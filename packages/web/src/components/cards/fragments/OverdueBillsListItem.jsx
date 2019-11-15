import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { bundle } from 'i18n/bundle';
import { formatCurrency } from 'services/Util';
import moment from 'moment';

const OverdueBillsListItem = ({ bill }) => {
    const dispatch = useDispatch();
    const [expand, setExpand] = useState(false);

    const formatDate = date => {
        if (!date) {
            return;
        }
        return moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY');
    };

    return (
        <div className="card collapse mb-2">
            <div className="card-title collapse-toogle p-1" onClick={() => setExpand(!expand)}>
                <span>{bill.description}</span>
                <span className="text-danger float-right">
                    {'overdue' === bill.state ? (
                        <span className="badge badge-danger">{bundle(bill.state)}</span>
                    ) : (
                        <span className="badge badge-warning">{bundle(bill.state)}</span>
                    )}
                </span>
            </div>
            <div className={expand ? 'collapse-container show p-2' : 'collapse-container p-2'}>
                <div>
                    <span className="font-weight-bold">{bundle('description')}</span>: {bill.description}
                </div>
                <div>
                    <span className="font-weight-bold">{bundle('value')}</span>:{' '}
                    {formatCurrency(Number(bill.amount).toFixed(2))}
                </div>
                <div>
                    <span className="font-weight-bold">{bundle('due')}</span>: {formatDate(bill.dueDate)}
                </div>
            </div>
        </div>
    );
};

export default OverdueBillsListItem;
