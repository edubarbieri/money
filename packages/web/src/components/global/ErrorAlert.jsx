import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { bundle } from 'i18n/bundle';
import { setError } from 'reducers/global/globalAction';
import Alert from './fragments/Alert';

const ErrorAlert = ({errorKey = 'generic'}) => {
    const errors = useSelector(state => state.global.error);
    const dispatch = useDispatch();

    return (
        !!errors[errorKey].length && (
            <Alert className="danger" title={bundle('error')} setShow={() => dispatch(setError(errorKey, []))}>
                {errors[errorKey].map(error => (
                    <span key={error}>{bundle(error)}</span>
                ))}
            </Alert>
        )
    );
}

export default ErrorAlert;