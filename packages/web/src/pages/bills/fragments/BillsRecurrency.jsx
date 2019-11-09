import React from 'react';
import { bundle } from 'i18n/bundle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const BillsRecurrency = () => {

    const generateRecurrency = () => {};

    return <div className="tooltip-btn bill ml-2">
        <button className="btn btn-outline-danger btn-sm pull-right" onClick={generateRecurrency} type="button">
            {bundle('generate.recurency')}
        </button>
        <FontAwesomeIcon icon={faInfoCircle} />
        <span>{bundle('generate.recurency.info')}</span>
    </div>;
};

export default BillsRecurrency;
