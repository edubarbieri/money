import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import { bundle } from 'i18n/bundle';
import { setError } from 'reducers/global/globalAction';
import { FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faTimes} from '@fortawesome/free-solid-svg-icons';

const ErrorMessage = ({errorKey = 'generic'}) => {
    const errors = useSelector(state => state.global.error);
    const dispatch = useDispatch();

    return !!errors[errorKey].length &&
        <div className="error-message">
            <span className="hide-error" onClick={() => dispatch(setError(errorKey, []))}>
                <FontAwesomeIcon icon={faTimes}/>
            </span>
            {errors[errorKey].map((error) => <span key={error}>{bundle(error)}</span>)}
        </div>
}

export default ErrorMessage;