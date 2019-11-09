import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bundle } from 'i18n/bundle';
import { setSaveBill, setPayBill } from 'reducers/bills/billsAction';
import Modal from 'components/global/fragments/Modal';
import moment from 'moment';

const BillsPayEditor = () => {
    const dispatch = useDispatch();
    const payBill = useSelector(state => state.bills.payBill);
    const [initialized, setInitialized] = useState(false);

    const [bill, setBill] = useState({
        amountPaid: '',
        amount: '0',
        dueDate: '',
        paymentDate: ''
    });

    useEffect(() => {
        if(!payBill){
            setBill(null);
            return;
        }
        payBill.amountPaid = payBill.amount;
        payBill.paymentDate = moment().format('YYYY-MM-DD');
        setBill(payBill);
        setInitialized(true);
    }, [payBill]);


    const validateAndSave = () => {
        if(!bill.paymentDate || !bill.amountPaid || Number(bill.amountPaid) < 0){
            return;
        }
        dispatch(setSaveBill(bill));
    }

    return (
        initialized &&
        bill && (
            <Modal title={bundle('payment')} setShow={() => dispatch(setPayBill(null))}>
                <form className="clear-focus">
                    <div className="form-row">
                        <div className={!bill.amountPaid ? 'col-6 form-group has-error' : 'col-6 form-group'}>
                            <label>{bundle('value.payed')}</label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <div className="input-group-text">{bundle('currency')}</div>
                                </div>
                                <input
                                    type="number"
                                    className="form-control border-left-0"
                                    value={bill.amountPaid}
                                    onChange={event => setBill({ ...bill, amountPaid: event.target.value })}
                                />
                            </div>
                        </div>
                        <div className={!bill.paymentDate ? 'col-6 form-group has-error' : 'col-6 form-group'}>
                            <label>{bundle('payment.date')}</label>
                            <input
                                type="date"
                                className="form-control"
                                value={bill.paymentDate}
                                onChange={event => setBill({ ...bill, paymentDate: event.target.value })}
                            />
                        </div>
                    </div>
                </form>
                <div className="modal-footer p10">
                    <button
                        type="button"
                        className="btn btn btn-outline-secondary btn-sm"
                        onClick={() => dispatch(setPayBill(null))}>
                        {bundle('cancel')}
                    </button>
                    <button type="button" className="btn btn-danger btn-sm" onClick={validateAndSave}>
                        {bundle('pay')}
                    </button>
                </div>
            </Modal>
        )
    );
};

export default BillsPayEditor;
