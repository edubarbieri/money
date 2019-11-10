import React, { useState } from 'react';
import { bundle } from 'i18n/bundle';
import { useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { setGenerateEntryRecurrency } from 'reducers/credit/creditAction';

const ExtractRecurrency = () => {
    const dispatch = useDispatch();
    const year = moment().get('year');
    const month = moment().month();
    const [data] = useState({
        year: year,
        month: month + 1
    })


    return <div className="tooltip-btn primary ml-2">
        <button className="btn btn-outline-primary btn-sm pull-right" onClick={() => dispatch(setGenerateEntryRecurrency(data))} type="button">
            {bundle('generate.recurency')}
        </button>
        <FontAwesomeIcon icon={faInfoCircle} />
        <span>{bundle('generate.recurency.info')}</span>
    </div>;
};

export default ExtractRecurrency;
