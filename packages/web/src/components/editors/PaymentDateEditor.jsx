import React, {useState, useEffect} from 'react';
import bundle from 'i18n/bundle';
import Datepicker from './Datepicker';

const PaymentDateEditor = ({ data,  onSet, show, setShow }) => {

    const [paymentData, setPaymentData] = useState({
        date: new Date(),
        amount: data.amount
    });

    useEffect(()=> {
        setPaymentData({date: new Date(), amount: data.amount});
    }, [data]);

    const onConfirm = () => {
        setShow(false);
        onSet(data, paymentData);
    }

    return show &&
        <div className="modal fixed show payment-editor">
            <span className="overlay"></span>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <i className="fas fa-times close-modal" onClick={() => setShow(false)} />
                        <h4 className="modal-title text-primary">{bundle('payment.date')}</h4>
                    </div>
                    <div className="modal-body">
                        <label className="m-0">{bundle("value")}</label>
                        <div className="input-group">
                            <span className="input-group-addon p-0">
                                {bundle('currency')}
                            </span>
                            <input type="number"
                                className="form-control"
                                value={paymentData.amount}
                                placeholder="0.00"
                                step="any"
                                min="0"
                                onChange={event => setPaymentData({ ...paymentData, amount: event.target.value})} />
                            </div>
                        <Datepicker 
                            date={paymentData.date}
                            setDate={value => setPaymentData({...paymentData, date: value})}
                            title={bundle('payment.date')}
                        />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-light btn-sm" onClick={() => setShow(false)}>{bundle('cancel')}</button>
                        <button type="button" className="btn btn-primary btn-sm" onClick={onConfirm}>{bundle('continue')}</button>
                    </div>
                </div>
            </div>
        </div>
}

export default PaymentDateEditor;