import React from 'react';
import {useDispatch} from 'react-redux';
import bundle from 'i18n/bundle';
import { bill as billService } from 'mymoney-sdk';
import { SET_LOADING } from 'store/globalActions';
import moment from 'moment';
import { isMobile } from 'service/util';

const BillsRecurrency = ({setErrors, setRefresh}) => {
    const dispatch = useDispatch();

    const generateRecurrency = () => {
        dispatch({ type: SET_LOADING, payload: true })
        billService.generateMonthRecurrentBills(moment().year(), moment().month() + 1).then(res => {
            dispatch({ type: SET_LOADING, payload: false })
            if (res.status >= 400) {
                setErrors(res.errors);
                return;
            }
            setRefresh(new Date().getTime());
        }).catch(err => {
            console.log(err);
        })
    }

    return <div className="col-md-12">
            <div className="recurrency-btn">
            <p>{bundle('generate.recurency.info')}</p>
            <button className="btn btn-danger pull-right"
                onClick={generateRecurrency}
                type="button">
                {bundle('generate.recurency')}
            </button>
        </div>
    </div>
}

export default BillsRecurrency;