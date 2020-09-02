import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { bundle } from 'i18n/bundle';
import { formatCurrency } from 'services/Util';
import moment from 'moment';
import { setEditCredit, setRemoveCreditConfirmation } from 'reducers/credit/creditAction';

const CreditListItem = ({ credit }) => {
    const dispatch = useDispatch();
    const [expand, setExpand] = useState(false);
    const getRecurrency = bill => {
        return bill.recurrentTotal
            ? `${bill.recurrentCount}${bundle('of')}${bill.recurrentTotal || 0}`
            : bill.recurrent
            ? bundle('yes')
            : bundle('no');
    };

    const formatDate = date => {
        if (!date) {
            return;
        }
        return moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY');
    };

    const actionsButtons = entry => {
        return [
            <div
                key="edit"
                onClick={() => dispatch(setEditCredit(credit))}
                className={credit.paymentDate ? 'disabled row-options edit' : 'row-options edit'}>
                <FontAwesomeIcon icon={faEdit} />
                <label>{bundle('edit')}</label>
            </div>,
            <div key="remove" onClick={() => dispatch(setRemoveCreditConfirmation(credit))} className="row-options remove">
                <FontAwesomeIcon icon={faTrashAlt} />
                <label>{bundle('remove')}</label>
            </div>
        ];
    };
    return (
        <div className="card collapse">
            <div className="card-title collapse-toogle p-1" onClick={() => setExpand(!expand)}>
                {credit.description}
                <span className="text-primary float-right">{formatCurrency(Number(credit.amount).toFixed(2))}</span>
            </div>
            <div className={expand ? 'collapse-container show pt-2' : 'collapse-container pt-2'}>
                <div>
                    <span className="font-weight-bold">{bundle('description')}</span>: {credit.description}
                </div>
                <div>
                    <span className="font-weight-bold">{bundle('value')}</span>:{' '}
                    {formatCurrency(Number(credit.amount).toFixed(2))}
                </div>
                <div>
                    <span className="font-weight-bold">{bundle('entry.date')}</span>: {formatDate(credit.entryDate)}
                </div>
                <div>
                    <span className="font-weight-bold">{bundle('category')}</span>:{' '}
                    {credit.category && credit.category.name}
                </div>
                <div>
                    <span className="font-weight-bold">{bundle('member')}</span>: {credit.user && credit.user.name}
                </div>
                <div>
                    <span className="font-weight-bold">{bundle('recurrency')}</span>: {getRecurrency(credit)}
                </div>
                <div className="row actions-container">{actionsButtons(credit)}</div>
            </div>
        </div>
    );
};

export default CreditListItem;
