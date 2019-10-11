import React from 'react';
import { useDispatch } from 'react-redux';
import bundle from 'i18n/bundle';
import { credit as creditService, debit as debitService } from 'mymoney-sdk';
import { SET_LOADING } from 'store/globalActions';
import moment from 'moment';

const ExtractRecurrency = ({ setErrors, setRefresh }) => {
    const dispatch = useDispatch();

    const generateRecurrency = () => {
        dispatch({ type: SET_LOADING, payload: true })
        creditService.generateMonthRecurrentExtracts(moment().year(), moment().month() + 1).then(res => {
            debitService.generateMonthRecurrentExtracts(moment().year(), moment().month() + 1).then(res => {
                dispatch({ type: SET_LOADING, payload: false })
                if (res.status >= 400) {
                    setErrors(res.errors);
                    return;
                }
                 setRefresh(new Date().getTime());
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            console.log(err);
        })
    }
    return <div className="col-md-12">
        <div className="recurrency-btn">
            <p>{bundle('generate.extract.recurency.info')}</p>
            <button className="btn btn-primary pull-right"
                onClick={generateRecurrency}
                type="button">
                {bundle('generate.extract.recurency')}
            </button>
        </div>
    </div>
}

export default ExtractRecurrency;