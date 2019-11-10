import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoiceDollar, faTrashAlt, faEdit } from '@fortawesome/free-solid-svg-icons';
import { bundle } from 'i18n/bundle';
import { formatCurrency } from 'services/Util';
import moment from 'moment';
import { setRemoveBillConfirmation, setEditBill, setPayBill } from 'reducers/bills/billsAction';

const BillListItem = ({ bill }) => {
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

    const actionsButtons = bill => {
        return [
            <div
                key="edit"
                onClick={() => dispatch(setEditBill(bill))}
                className={bill.paymentDate ? 'row-options disabled col-4 edit' : 'row-options col-4 edit'}>
                <FontAwesomeIcon icon={faEdit} />
                <label>{bundle('edit')}</label>
            </div>,
            <div key="remove" onClick={() => dispatch(setRemoveBillConfirmation(bill))} className="row-options col-4 remove">
                <FontAwesomeIcon icon={faTrashAlt} />
                <label>{bundle('remove')}</label>
            </div>,
            <div
                key="pay"
                className={bill.paymentDate ? 'row-options disabled col-4 plus' : 'row-options col-4 plus'}
                onClick={() => dispatch(setPayBill(bill))}>
                <FontAwesomeIcon icon={faFileInvoiceDollar} />
                <label>{bundle('payed')}</label>
            </div>
        ];
    };
    return (
        <div className="card collapse" >
            <div className="card-title collapse-toogle p-1" onClick={() => setExpand(!expand)}>
                <span  className={bill.isPayd && 'disabled'}>
                    {bill.description}
                </span>
                <span className="text-danger float-right">{formatCurrency(Number(bill.amount).toFixed(2))}</span>
            </div>
            <div className={expand ? 'collapse-container show pt-2' : 'collapse-container pt-2'}>
                <div>
                    <span className="font-weight-bold">{bundle('description')}</span>: {bill.description}
                </div>
                <div>
                    <span className="font-weight-bold">{bundle('value')}</span>:{' '}
                    {formatCurrency(Number(bill.amount).toFixed(2))}
                </div>
                <div>
                    <span className="font-weight-bold">{bundle('due.date')}</span>: {formatDate(bill.dueDate)}
                </div>
                <div>
                    <span className="font-weight-bold">{bundle('payment.date')}</span>: {formatDate(bill.paymentDate)}
                </div>
                <div>
                    <span className="font-weight-bold">{bundle('category')}</span>:{' '}
                    {bill.category && bill.category.name}
                </div>
                <div>
                    <span className="font-weight-bold">{bundle('value.payed')}</span>:{' '}
                    {bill.amountPaid > 0 && formatCurrency(Number(bill.amountPaid).toFixed(2))}
                </div>
                <div>
                    <span className="font-weight-bold">{bundle('member')}</span>: {bill.user && bill.user.name}
                </div>
                <div>
                    <span className="font-weight-bold">{bundle('recurrency')}</span>: {getRecurrency(bill)}
                </div>
                <div className="row actions-container">{actionsButtons(bill)}</div>
            </div>
        </div>
    );
};

export default BillListItem;
