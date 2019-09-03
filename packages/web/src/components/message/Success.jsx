import React, {useEffect} from 'react';
import bundle from 'i18n/bundle'

const Success = ({success, setSuccess}) => {
    
    useEffect(()=>{
        if(!success || success.length < 1){
            return;
        }
    }, [success])
    
    return !!success.length &&
        <div className="success-message">
            <span className="hide-error" onClick={() => setSuccess([])}>
                <i className="fas fa-times"/>
            </span>
            {success.map((value, idx) => <span key={idx}>{value}</span>)}
        </div>
}

export default Success;