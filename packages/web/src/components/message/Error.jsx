import React, {useEffect} from 'react';
import bundle from 'i18n/bundle'

const Errors = ({errors, setErrors}) => {
    
    useEffect(()=>{
        if(!errors || errors.length < 1){
            return;
        }
    }, [errors])
    
    return !!errors.length &&
        <div className="error-message">
            <span className="hide-error" onClick={() => setErrors([])}>
                <i className="fas fa-times"/>
            </span>
            {errors.map((error, idx) => <span key={idx}>{bundle(error)}</span>)}
        </div>
}

export default Errors;